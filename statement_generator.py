#!/usr/bin/env python3
"""
ARBA Transport Statement Generator
Reads load data from Excel, generates owner & driver PDFs per truck
"""

import os
from datetime import datetime, timedelta
import io

import pandas as pd
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
)

# -------------------------------------------------------------------
# CONFIG – CHANGE FOR YOUR SETUP
# -------------------------------------------------------------------

INPUT_EXCEL = "loads_data.xlsx"     # your Excel with the green row table
OUTPUT_DIR = "statements"          # folder for PDFs

OWNER_PERCENTAGE = 0.88            # 88% to owner
DRIVER_PERCENTAGE = 0.65           # 0.65 per mile for driver (like right pic)

# fixed deductions for example – edit as needed
DEDUCTIONS = {
    "ELD (weekly)": 110.00,
    "Cargo insurance (weekly)": 400.00,
    "Trailer (weekly)": 200.00,
}


# -------------------------------------------------------------------
# HELPERS
# -------------------------------------------------------------------

def load_data(path: str):
    if not os.path.exists(path):
        raise FileNotFoundError(f"{path} not found in current folder.")
    xls = pd.ExcelFile(path)
    week_sheets = [n for n in xls.sheet_names if str(n).startswith("Week ")]
    sheet = (
        week_sheets[-1]
        if week_sheets
        else ("Board" if "Board" in xls.sheet_names else xls.sheet_names[0])
    )
    df = pd.read_excel(xls, sheet_name=sheet)
    return df, sheet

def load_data_from_bytes(data: bytes, sheet_override: str | None = None):
    xls = pd.ExcelFile(io.BytesIO(data))
    if sheet_override and sheet_override in xls.sheet_names:
        sheet = sheet_override
    else:
        week_sheets = [n for n in xls.sheet_names if str(n).startswith("Week ")]
        sheet = (
            week_sheets[-1]
            if week_sheets
            else ("Board" if "Board" in xls.sheet_names else xls.sheet_names[0])
        )
    df = pd.read_excel(xls, sheet_name=sheet)
    return df, sheet

def get_sheet_names_from_bytes(data: bytes):
    try:
        xls = pd.ExcelFile(io.BytesIO(data))
        return list(xls.sheet_names)
    except Exception:
        return []

def parse_loads_sheet(df: pd.DataFrame):
    col_map = {}
    for c in df.columns:
        name = str(c).strip().lower()
        col_map[name] = c
    def get_col(*names):
        for n in names:
            key = n.lower()
            if key in col_map:
                return col_map[key]
        return None
    period_col = get_col("period")
    truck_col = get_col("unit number", "truck", "unit", "truck number")
    owner_col = get_col("owner name", "owner", "llc", "llc name")
    driver_col = get_col("driver name", "driver")
    loadnum_col = get_col("load number", "load #", "load")
    pu_col = get_col("pick up location", "pickup location", "pick up", "pickup")
    del_col = get_col("delivery location", "delivery")
    gross_col = get_col("gross")
    miles_col = get_col("miles", "total miles")
    fuel_col = get_col("fuel")
    rows = []
    period_val = None
    for _, r in df.iterrows():
        # capture period first non-empty
        if period_col:
            val = r.get(period_col)
            if pd.notna(val) and not period_val:
                period_val = str(val).strip()
        truck = r.get(truck_col) if truck_col else None
        owner = r.get(owner_col) if owner_col else None
        driver = r.get(driver_col) if driver_col else None
        loadnum = r.get(loadnum_col) if loadnum_col else None
        pu = r.get(pu_col) if pu_col else None
        dl = r.get(del_col) if del_col else None
        gross = _to_amount(r.get(gross_col)) if gross_col else None
        miles = _to_amount(r.get(miles_col)) if miles_col else None
        fuel = _to_amount(r.get(fuel_col)) if fuel_col else 0.0
        tk = _norm_id(truck)
        if tk and (pd.notna(loadnum) or (isinstance(gross, (int, float)) or isinstance(miles, (int, float)))):
            rows.append({
                "Week": period_val or "",
                "Truck": tk,
                "Driver/Carrier": str(owner).strip() if pd.notna(owner) else "",
                "DriverName": str(driver).strip() if pd.notna(driver) else "",
                "Load Number": str(loadnum).strip() if pd.notna(loadnum) else "",
                "Pickup location": str(pu).strip() if pd.notna(pu) else "",
                "Delivery location": str(dl).strip() if pd.notna(dl) else "",
                "Gross": float(gross or 0.0),
                "Total miles": float(miles or 0.0),
                "Fuel": float(fuel or 0.0),
                "PU date": "",  # not provided
            })
    return pd.DataFrame(rows)

def parse_terms_drivers(df: pd.DataFrame):
    # Robust header-based parsing with positional fallback
    headers = [str(c).strip().lower() for c in df.columns]
    def find_col(*cands, default_index=None):
        for cand in cands:
            cand = cand.lower()
            if cand in headers:
                return df.columns[headers.index(cand)]
        if default_index is not None and default_index < len(df.columns):
            return df.columns[default_index]
        return None
    unit_col = find_col("unit number", "unit", default_index=0)
    rate_col = find_col("rate per mile", "per mile", default_index=2)
    dname_col = find_col("driver name", "driver", default_index=3)
    company_col = find_col("llc name", "llc", "company", default_index=6)
    mapping = {}
    for _, r in df.iterrows():
        unit = r.get(unit_col) if unit_col is not None else None
        rate = r.get(rate_col) if rate_col is not None else None
        dname = r.get(dname_col) if dname_col is not None else None
        company = r.get(company_col) if company_col is not None else None
        key = _norm_id(unit)
        if key:
            # normalize textual rpm values like "0.65", "65", "65¢", "0.65 per mile"
            raw = rate
            if pd.notna(raw):
                raw = str(raw).lower().replace("per mile", "").replace("¢", "").replace("$", "").strip()
            rpm = _to_amount(raw)
            if isinstance(rpm, (int, float)):
                if rpm > 10:
                    rpm = rpm / 100.0
            mapping[key] = {
                "rate_per_mile": float(rpm) if isinstance(rpm, (int, float)) else None,
                "driver_name": str(dname).strip() if pd.notna(dname) else "",
                "company": str(company).strip() if pd.notna(company) else "",
            }
    return mapping

def parse_terms_owners(df: pd.DataFrame):
    headers = [str(c).strip().lower() for c in df.columns]
    def find_col(*cands, default_index=None):
        for cand in cands:
            cand = cand.lower()
            if cand in headers:
                return df.columns[headers.index(cand)]
        if default_index is not None and default_index < len(df.columns):
            return df.columns[default_index]
        return None
    unit_col = find_col("unit number", "unit", default_index=0)
    rpm_col = find_col("rate per mile", "per mile", default_index=2)
    dname_col = find_col("driver name", "driver", default_index=3)
    mapping = {}
    for _, r in df.iterrows():
        unit = r.get(unit_col) if unit_col is not None else None
        rpm_raw = r.get(rpm_col) if rpm_col is not None else None
        dname = r.get(dname_col) if dname_col is not None else None
        key = _norm_id(unit)
        if key:
            raw = rpm_raw
            if pd.notna(raw):
                raw = str(raw).lower().replace("per mile", "").replace("¢", "").replace("$", "").strip()
            rpm = _to_amount(raw)
            if isinstance(rpm, (int, float)) and rpm > 10:
                rpm = rpm / 100.0
            mapping[key] = {
                "per_mile": float(rpm) if isinstance(rpm, (int, float)) else None,
                "driver_name": str(dname).strip() if pd.notna(dname) else "",
            }
    return mapping

def generate_statements_from_two_excels(loads_excel_bytes: bytes,
                                        loads_sheet: str | None,
                                        terms_excel_bytes: bytes,
                                        drivers_sheet: str | None,
                                        owners_sheet: str | None):
    xls_loads = pd.ExcelFile(io.BytesIO(loads_excel_bytes))
    sheet_loads = loads_sheet if (loads_sheet and loads_sheet in xls_loads.sheet_names) else xls_loads.sheet_names[0]
    df_loads_raw = pd.read_excel(xls_loads, sheet_name=sheet_loads)
    df_loads = parse_loads_sheet(df_loads_raw)
    # period parsing
    period = ""
    if "Week" in df_loads.columns and not df_loads.empty:
        period = str(df_loads.iloc[0].get("Week") or "")
    start, end = parse_week_period(period)
    # group by truck
    trucks = []
    for truck in df_loads["Truck"].dropna().unique():
        rows = df_loads[df_loads["Truck"] == truck].copy()
        owner = str(rows.iloc[0].get("Driver/Carrier", "Owner")).strip() or "Owner"
        trucks.append({"truck": truck, "owner": owner, "rows": rows})
    # terms
    xls_terms = pd.ExcelFile(io.BytesIO(terms_excel_bytes))
    drivers_sheet_name = drivers_sheet if (drivers_sheet and drivers_sheet in xls_terms.sheet_names) else ("Drivers" if "Drivers" in xls_terms.sheet_names else xls_terms.sheet_names[0])
    owners_sheet_name = owners_sheet if (owners_sheet and owners_sheet in xls_terms.sheet_names) else ("Owner" if "Owner" in xls_terms.sheet_names else xls_terms.sheet_names[-1])
    df_drivers = pd.read_excel(xls_terms, sheet_name=drivers_sheet_name)
    df_owners = pd.read_excel(xls_terms, sheet_name=owners_sheet_name)
    drivers_map = parse_terms_drivers(df_drivers)
    owners_map = parse_terms_owners(df_owners)
    files = []
    for t in trucks:
        truck = t["truck"]
        rows = t["rows"]
        key = _norm_id(truck)
        # names and rates
        dcfg = drivers_map.get(key, {})
        ocfg = owners_map.get(key, {})
        driver_rpm = dcfg.get("rate_per_mile") or ocfg.get("per_mile")
        driver_name = (dcfg.get("driver_name") or ocfg.get("driver_name") or str(rows.iloc[0].get("DriverName") or "") or "Driver").strip()
        owner_name = (dcfg.get("company") or str(rows.iloc[0].get("Driver/Carrier") or "") or "Owner").strip()
        owner_pct = None
        # fuel total
        fuel_total = float(rows["Fuel"].sum()) if "Fuel" in rows.columns else 0.0
        owner_base = f"{owner_name.replace(' ', '_')}_{truck}_{start:%m_%d_%Y}_to_{end:%m_%d_%Y}"
        driver_base = f"{driver_name.replace(' ', '_')}_{truck}_{start:%m_%d_%Y}_to_{end:%m_%d_%Y}"
        owner_bytes = make_statement_pdf_bytes(rows, owner_name, truck, start, end, True, fuel_total, driver_rate_per_mile=driver_rpm, owner_percentage=owner_pct)
        driver_bytes = make_statement_pdf_bytes(rows, driver_name, truck, start, end, False, fuel_total, driver_rate_per_mile=driver_rpm, owner_percentage=None)
        files.append({"name": f"OWNER_{owner_base}.pdf", "bytes": owner_bytes})
        files.append({"name": f"DRIVER_{driver_base}.pdf", "bytes": driver_bytes})
    return files
def _to_amount(x):
    try:
        return float(x)
    except Exception:
        s = str(x).replace("$", "").replace(",", "").strip()
        try:
            return float(s)
        except Exception:
            return None

def _norm_id(x):
    s = str(x).strip()
    filtered = "".join(ch for ch in s if ch.isdigit() or ch == ".")
    if not filtered:
        return ""
    try:
        if "." in filtered:
            return str(int(float(filtered)))
        return str(int(filtered))
    except Exception:
        try:
            return str(int(float(filtered)))
        except Exception:
            return ""

def extract_fuel_map(df: pd.DataFrame):
    if df.empty:
        return {}
    row0 = df.iloc[0]
    driver_col = None
    total_col = None
    for c in df.columns:
        v = str(row0.get(c, "")).strip().lower()
        if v == "driver id":
            driver_col = c
        if v == "total":
            total_col = c
    if not driver_col or not total_col:
        return {}
    mapping = {}
    for _, r in df.iloc[1:].iterrows():
        d = r.get(driver_col)
        t = r.get(total_col)
        if pd.notna(d) and pd.notna(t):
            key = _norm_id(d)
            if key:
                amt = _to_amount(t)
                if isinstance(amt, (int, float)):
                    mapping[key] = float(amt)
    return mapping

def extract_owner_map(path: str):
    try:
        xls = pd.ExcelFile(path)
        if "Truck-Owner" not in xls.sheet_names:
            return {}
        df = pd.read_excel(xls, sheet_name="Truck-Owner")
        mapping = {}
        for _, r in df.iterrows():
            cols = list(df.columns)
            if not cols:
                continue
            truck_val = r.get(cols[0])
            owner_val = r.get(cols[1]) if len(cols) > 1 else None
            key = _norm_id(truck_val)
            if key and pd.notna(owner_val):
                mapping[key] = str(owner_val).strip()
        return mapping
    except Exception:
        return {}

def extract_owner_map_from_bytes(data: bytes):
    try:
        xls = pd.ExcelFile(io.BytesIO(data))
        if "Truck-Owner" not in xls.sheet_names:
            return {}
        df = pd.read_excel(xls, sheet_name="Truck-Owner")
        mapping = {}
        for _, r in df.iterrows():
            cols = list(df.columns)
            if not cols:
                continue
            truck_val = r.get(cols[0])
            owner_val = r.get(cols[1]) if len(cols) > 1 else None
            key = _norm_id(truck_val)
            if key and pd.notna(owner_val):
                mapping[key] = str(owner_val).strip()
        return mapping
    except Exception:
        return {}

def normalize_week_sheet(df: pd.DataFrame):
    if df.empty:
        return df
    row0 = df.iloc[0]
    targets = {
        "PU date",
        "Load Number",
        "Pickup location",
        "Delivery location",
        "Gross",
        "Total miles",
        "invoice #",
        "Driver/Carrier",
        "Truck",
        "Week",
    }
    col_map = {}
    for c in df.columns:
        label = str(row0.get(c, "")).strip()
        if label in targets:
            col_map[c] = label
    if not col_map:
        return df
    out = df.rename(columns=col_map).iloc[1:].copy()
    return out

def parse_week_period(week_value: str):
    """
    Expects something like '11.17.25-11.23.25' from the Week column.
    If parsing fails, uses current week.
    """
    try:
        txt = str(week_value).strip()
        # normalize separators
        txt = txt.replace(" ", "")
        if "-" in txt:
            start_txt, end_txt = txt.split("-")
        else:
            # fallback – just treat as single date
            start_txt = end_txt = txt

        def parse_one(s):
            parts = s.split(".")
            if len(parts) == 2:
                m, d = map(int, parts)
                y = datetime.today().year
                return datetime(y, m, d)
            if len(parts) != 3:
                raise ValueError
            m, d, y = map(int, parts)
            if y < 100:
                y = 2000 + y
            return datetime(y, m, d)

        start = parse_one(start_txt)
        end = parse_one(end_txt)
        return start, end
    except Exception:
        today = datetime.today()
        start = today - timedelta(days=today.weekday())
        end = start + timedelta(days=6)
        return start, end


def get_trucks(df: pd.DataFrame):
    valid_rows = []
    for _, r in df.iterrows():
        tk = _norm_id(r.get("Truck"))
        g = _to_amount(r.get("Gross"))
        m = _to_amount(r.get("Total miles"))
        pu = r.get("PU date")
        ln = r.get("Load Number")
        if isinstance(pu, str) and pu.strip().lower() == "pu date":
            continue
        if tk and (isinstance(g, (int, float)) or isinstance(m, (int, float))) and pd.notna(pu) and pd.notna(ln):
            valid_rows.append(r)
    if not valid_rows:
        return []
    clean = pd.DataFrame(valid_rows)
    trucks = []
    for truck in clean["Truck"].dropna().unique():
        rows = clean[clean["Truck"] == truck].copy()
        owner = str(rows.iloc[0].get("Driver/Carrier", "Owner")).strip() or "Owner"
        trucks.append({"truck": truck, "owner": owner, "rows": rows})
    return trucks


def calc_totals(rows: pd.DataFrame):
    miles = rows["Total miles"].astype(float).sum()
    gross = rows["Gross"].astype(float).sum()
    rate_per_mile = gross / miles if miles else 0
    return miles, gross, rate_per_mile


# -------------------------------------------------------------------
# PDF GENERATION
# -------------------------------------------------------------------

def make_statement_pdf_bytes(rows: pd.DataFrame,
                              owner_name: str, truck: str,
                              start: datetime, end: datetime,
                              for_owner: bool,
                              fuel_amount: float,
                              driver_rate_per_mile: float | None = None,
                              owner_percentage: float | None = None):
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=letter,
        topMargin=0.5 * inch,
        bottomMargin=0.5 * inch,
        leftMargin=0.5 * inch,
        rightMargin=0.5 * inch,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "Title",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=20,
        alignment=TA_CENTER,
        textColor=colors.red,
        spaceAfter=6,
    )
    hdr_style = ParagraphStyle(
        "Hdr",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        alignment=TA_LEFT,
        spaceAfter=2,
    )
    normal = styles["Normal"]
    normal.fontSize = 8

    story = []
    story.append(Paragraph("ARBA EXPRESS", title_style))
    story.append(Spacer(1, 0.1 * inch))
    period_str = f"{start:%m/%d/%Y} - {end:%m/%d/%Y}"
    header_data = [
        ["Work Period", period_str, "", "Owner Name" if for_owner else "Driver Name",
         owner_name],
        ["Unit Number", str(truck), "", "", ""],
    ]
    header = Table(header_data, colWidths=[1.0 * inch, 1.6 * inch, 0.4 * inch,
                                           1.0 * inch, 1.8 * inch])
    header.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (3, 0), (3, -1), "Helvetica-Bold"),
    ]))
    story.append(header)
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("Loads", hdr_style))
    if for_owner:
        loads_header = ["Load Number", "Pickup location",
                        "Delivery location", "Gross", "Percentage", "Owner Pay"]
    else:
        loads_header = ["Load Number", "Pickup location", "Delivery location",
                        "Miles", "$ Per Mile", "Gross Pay"]
    data = [loads_header]
    total_miles = 0.0
    total_gross = 0.0
    for _, r in rows.iterrows():
        pu = r.get("PU date", "")
        if isinstance(pu, (datetime, pd.Timestamp)):
            pu_txt = pu.strftime("%m/%d/%Y")
        else:
            pu_txt = str(pu)
        miles = _to_amount(r.get("Total miles", 0)) or 0.0
        gross = _to_amount(r.get("Gross", 0)) or 0.0
        if not isinstance(miles, (int, float)):
            miles = 0.0
        if not isinstance(gross, (int, float)):
            gross = 0.0
        if for_owner:
            pct = owner_percentage if owner_percentage is not None else OWNER_PERCENTAGE
            owner_pay = gross * pct
            data.append([
                str(r.get("Load Number", "")),
                str(r.get("Pickup location", "")),
                str(r.get("Delivery location", "")),
                f"{gross:,.2f}",
                f"{pct*100:.2f}%",
                f"{owner_pay:,.2f}",
            ])
        else:
            route = f"{r.get('Pickup location','')} - {r.get('Delivery location','')}"
            rate = driver_rate_per_mile if driver_rate_per_mile is not None else (gross / miles if miles else 0)
            data.append([
                str(r.get("Load Number", "")),
                str(r.get("Pickup location", "")),
                str(r.get("Delivery location", "")),
                f"{miles:,.0f}",
                f"{rate:.2f}",
                f"{gross:,.2f}",
            ])
        total_miles += miles
        total_gross += gross
    if for_owner:
        pct = owner_percentage if owner_percentage is not None else OWNER_PERCENTAGE
        owner_total = total_gross * pct
        data.append(["", "", "TOTAL",
                     f"{total_gross:,.2f}",
                     f"{pct*100:.2f}%",
                     f"{owner_total:,.2f}"])
    else:
        avg_rate = driver_rate_per_mile if driver_rate_per_mile is not None else (total_gross / total_miles if total_miles else 0)
        data.append(["", "TOTAL",
                     f"{total_miles:,.0f}",
                     f"{avg_rate:.2f}",
                     f"{total_gross:,.2f}"])
    if for_owner:
        tbl = Table(
            data,
            colWidths=[0.95 * inch, 1.6 * inch, 1.6 * inch,
                       0.9 * inch, 0.9 * inch, 0.9 * inch],
        )
    else:
        tbl = Table(
            data,
            colWidths=[0.95 * inch, 1.6 * inch, 1.6 * inch,
                       0.8 * inch, 0.8 * inch, 0.9 * inch],
        )
    tbl.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (3, 1), (-1, -1), "RIGHT"),
        ("BACKGROUND", (0, -1), (-1, -1), colors.whitesmoke),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 7),
    ]))
    story.append(tbl)
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("ADDITIONS", hdr_style))
    add_data = [
        ["Description", "Amount"],
        ["", ""],
        ["TOTAL ADDITIONS", "0.00"],
    ]
    add_tbl = Table(add_data, colWidths=[4.0 * inch, 1.5 * inch])
    add_tbl.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
        ("BACKGROUND", (0, 0), (-1, 0), colors.yellow),
        ("BACKGROUND", (0, 2), (-1, 2), colors.yellow),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 2), (-1, 2), "Helvetica-Bold"),
        ("ALIGN", (1, 1), (1, -1), "RIGHT"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
    ]))
    story.append(add_tbl)
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("DEDUCTIONS", hdr_style))
    ded_data = [["Description", "Amount"]]
    total_ded = 0.0
    for name, val in DEDUCTIONS.items():
        ded_data.append([name, f"{val:,.2f}"])
        total_ded += val
    if fuel_amount:
        ded_data.append(["Fuel", f"{fuel_amount:,.2f}"])
        total_ded += fuel_amount
    ded_data.append(["TOTAL DEDUCTIONS", f"{total_ded:,.2f}"])
    ded_tbl = Table(ded_data, colWidths=[4.0 * inch, 1.5 * inch])
    ded_tbl.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
        ("BACKGROUND", (0, 0), (-1, 0), colors.yellow),
        ("BACKGROUND", (0, -1), (-1, -1), colors.yellow),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("ALIGN", (1, 1), (1, -1), "RIGHT"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
    ]))
    story.append(ded_tbl)
    story.append(Spacer(1, 0.15 * inch))
    if for_owner:
        base = total_gross * (owner_percentage if owner_percentage is not None else OWNER_PERCENTAGE)
        label = "CHECK AMOUNT TO THE OWNER"
    else:
        rpm = driver_rate_per_mile if driver_rate_per_mile is not None else DRIVER_PERCENTAGE
        base = total_miles * rpm
        label = "CHECK AMOUNT TO THE DRIVER"
    check_amount = base - total_ded
    check_tbl = Table(
        [["", "", label, f"{check_amount:,.2f}"]],
        colWidths=[2.0 * inch, 1.0 * inch, 2.1 * inch, 1.4 * inch],
    )
    check_tbl.setStyle(TableStyle([
        ("BACKGROUND", (2, 0), (3, 0), colors.lightgrey),
        ("GRID", (2, 0), (3, 0), 0.5, colors.grey),
        ("FONTNAME", (2, 0), (3, 0), "Helvetica-Bold"),
        ("ALIGN", (2, 0), (3, 0), "RIGHT"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
    ]))
    story.append(check_tbl)
    doc.build(story)
    return buf.getvalue()

def make_statement_pdf(filename: str, rows: pd.DataFrame,
                       owner_name: str, truck: str,
                       start: datetime, end: datetime,
                       for_owner: bool,
                       fuel_amount: float,
                       driver_rate_per_mile: float | None = None,
                       owner_percentage: float | None = None):
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        topMargin=0.5 * inch,
        bottomMargin=0.5 * inch,
        leftMargin=0.5 * inch,
        rightMargin=0.5 * inch,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "Title",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=20,
        alignment=TA_CENTER,
        textColor=colors.red,
        spaceAfter=6,
    )
    hdr_style = ParagraphStyle(
        "Hdr",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        alignment=TA_LEFT,
        spaceAfter=2,
    )
    normal = styles["Normal"]
    normal.fontSize = 8

    story = []

    # top logo text
    story.append(Paragraph("ARBA EXPRESS", title_style))
    story.append(Spacer(1, 0.1 * inch))

    period_str = f"{start:%m/%d/%Y} - {end:%m/%d/%Y}"

    # header info table
    header_data = [
        ["Work Period", period_str, "", "Owner Name" if for_owner else "Driver Name",
         owner_name],
        ["Unit Number", str(truck), "", "", ""],
    ]
    header = Table(header_data, colWidths=[1.0 * inch, 1.6 * inch, 0.4 * inch,
                                           1.0 * inch, 1.8 * inch])
    header.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (3, 0), (3, -1), "Helvetica-Bold"),
    ]))
    story.append(header)
    story.append(Spacer(1, 0.15 * inch))

    # loads table
    story.append(Paragraph("Loads", hdr_style))
    if for_owner:
        loads_header = ["Load Number", "Pickup location",
                        "Delivery location", "Gross", "Percentage", "Owner Pay"]
    else:
        loads_header = ["Load Number", "Pickup location", "Delivery location",
                        "Miles", "$ Per Mile", "Gross Pay"]
    data = [loads_header]
    total_miles = 0.0
    total_gross = 0.0
    for _, r in rows.iterrows():
        miles = _to_amount(r.get("Total miles", 0)) or 0.0
        gross = _to_amount(r.get("Gross", 0)) or 0.0
        if not isinstance(miles, (int, float)):
            miles = 0.0
        if not isinstance(gross, (int, float)):
            gross = 0.0
        if for_owner:
            pct = owner_percentage if owner_percentage is not None else OWNER_PERCENTAGE
            owner_pay = gross * pct
            data.append([
                str(r.get("Load Number", "")),
                str(r.get("Pickup location", "")),
                str(r.get("Delivery location", "")),
                f"{gross:,.2f}",
                f"{pct*100:.2f}%",
                f"{owner_pay:,.2f}",
            ])
        else:
            rate = driver_rate_per_mile if driver_rate_per_mile is not None else (gross / miles if miles else 0)
            data.append([
                str(r.get("Load Number", "")),
                str(r.get("Pickup location", "")),
                str(r.get("Delivery location", "")),
                f"{miles:,.0f}",
                f"{rate:.2f}",
                f"{gross:,.2f}",
            ])
        total_miles += miles
        total_gross += gross
    if for_owner:
        pct = owner_percentage if owner_percentage is not None else OWNER_PERCENTAGE
        owner_total = total_gross * pct
        data.append(["", "", "TOTAL",
                     f"{total_gross:,.2f}",
                     f"{pct*100:.2f}%",
                     f"{owner_total:,.2f}"])
    else:
        avg_rate = driver_rate_per_mile if driver_rate_per_mile is not None else (total_gross / total_miles if total_miles else 0)
        data.append(["", "TOTAL",
                     f"{total_miles:,.0f}",
                     f"{avg_rate:.2f}",
                     f"{total_gross:,.2f}"])

    if for_owner:
        tbl = Table(
            data,
            colWidths=[0.95 * inch, 1.6 * inch, 1.6 * inch,
                       0.9 * inch, 0.9 * inch, 0.9 * inch],
        )
    else:
        tbl = Table(
            data,
            colWidths=[0.95 * inch, 1.6 * inch, 1.6 * inch,
                       0.8 * inch, 0.8 * inch, 0.9 * inch],
        )
    tbl.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (3, 1), (-1, -1), "RIGHT"),
        ("BACKGROUND", (0, -1), (-1, -1), colors.whitesmoke),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 7),
    ]))
    story.append(tbl)
    story.append(Spacer(1, 0.15 * inch))

    # additions block (blank)
    story.append(Paragraph("ADDITIONS", hdr_style))
    add_data = [
        ["Description", "Amount"],
        ["", ""],
        ["TOTAL ADDITIONS", "0.00"],
    ]
    add_tbl = Table(add_data, colWidths=[4.0 * inch, 1.5 * inch])
    add_tbl.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
        ("BACKGROUND", (0, 0), (-1, 0), colors.yellow),
        ("BACKGROUND", (0, 2), (-1, 2), colors.yellow),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 2), (-1, 2), "Helvetica-Bold"),
        ("ALIGN", (1, 1), (1, -1), "RIGHT"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
    ]))
    story.append(add_tbl)
    story.append(Spacer(1, 0.1 * inch))

    story.append(Paragraph("DEDUCTIONS", hdr_style))
    ded_data = [["Description", "Amount"]]
    total_ded = 0.0
    for name, val in DEDUCTIONS.items():
        ded_data.append([name, f"{val:,.2f}"])
        total_ded += val
    if fuel_amount:
        ded_data.append(["Fuel", f"{fuel_amount:,.2f}"])
        total_ded += fuel_amount
    ded_data.append(["TOTAL DEDUCTIONS", f"{total_ded:,.2f}"])
    ded_tbl = Table(ded_data, colWidths=[4.0 * inch, 1.5 * inch])
    ded_tbl.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
        ("BACKGROUND", (0, 0), (-1, 0), colors.yellow),
        ("BACKGROUND", (0, -1), (-1, -1), colors.yellow),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("ALIGN", (1, 1), (1, -1), "RIGHT"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
    ]))
    story.append(ded_tbl)
    story.append(Spacer(1, 0.15 * inch))

    # check amount
    if for_owner:
        base = total_gross * (owner_percentage if owner_percentage is not None else OWNER_PERCENTAGE)
        label = "CHECK AMOUNT TO THE OWNER"
    else:
        rpm = driver_rate_per_mile if driver_rate_per_mile is not None else DRIVER_PERCENTAGE
        base = total_miles * rpm
        label = "CHECK AMOUNT TO THE DRIVER"

    check_amount = base - total_ded  # additions = 0 for now

    check_tbl = Table(
        [["", "", label, f"{check_amount:,.2f}"]],
        colWidths=[2.0 * inch, 1.0 * inch, 2.1 * inch, 1.4 * inch],
    )
    check_tbl.setStyle(TableStyle([
        ("BACKGROUND", (2, 0), (3, 0), colors.lightgrey),
        ("GRID", (2, 0), (3, 0), 0.5, colors.grey),
        ("FONTNAME", (2, 0), (3, 0), "Helvetica-Bold"),
        ("ALIGN", (2, 0), (3, 0), "RIGHT"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
    ]))
    story.append(check_tbl)

    doc.build(story)
    print("created", filename)


# -------------------------------------------------------------------
# MAIN
# -------------------------------------------------------------------

def main():
    df_raw, sheet_name = load_data(INPUT_EXCEL)
    fuel_map = extract_fuel_map(df_raw)
    owner_map = extract_owner_map(INPUT_EXCEL)
    df = normalize_week_sheet(df_raw)

    if "Week" in df.columns and pd.notna(df.iloc[0].get("Week")):
        start, end = parse_week_period(df.iloc[0]["Week"])
    else:
        txt = str(sheet_name).lower().replace("week", "").strip()
        start, end = parse_week_period(txt) if txt else parse_week_period("")
    trucks = get_trucks(df)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for t in trucks:
        truck = t["truck"]
        owner = owner_map.get(_norm_id(truck), t["owner"])
        if any(ch.isdigit() for ch in str(owner)) or ("," in str(owner)):
            owner = "Owner"
        rows = t["rows"]

        base_name = f"{owner.replace(' ', '_')}_{truck}_{start:%m_%d_%Y}_to_{end:%m_%d_%Y}"
        owner_pdf = os.path.join(OUTPUT_DIR, f"OWNER_{base_name}.pdf")
        driver_pdf = os.path.join(OUTPUT_DIR, f"DRIVER_{base_name}.pdf")

        key = _norm_id(truck)
        fuel_amt = fuel_map.get(key, 0.0)
        cfg = fetch_driver_config(key)
        driver_rpm = cfg.get("rate_per_mile") if cfg else None
        driver_name = cfg.get("driver_name") if cfg else owner
        owner_name = cfg.get("company") if cfg and cfg.get("company") else owner
        make_statement_pdf(owner_pdf, rows, owner_name, truck, start, end, for_owner=True, fuel_amount=fuel_amt, driver_rate_per_mile=driver_rpm)
        make_statement_pdf(driver_pdf, rows, driver_name, truck, start, end, for_owner=False, fuel_amount=fuel_amt, driver_rate_per_mile=driver_rpm)

def generate_statements_from_excel_bytes(excel_bytes: bytes, sheet_override: str | None = None, driver_configs: dict | None = None):
    df_raw, sheet_name = load_data_from_bytes(excel_bytes, sheet_override)
    fuel_map = extract_fuel_map(df_raw)
    owner_map = extract_owner_map_from_bytes(excel_bytes)
    df = normalize_week_sheet(df_raw)
    if "Week" in df.columns and pd.notna(df.iloc[0].get("Week")):
        start, end = parse_week_period(df.iloc[0]["Week"])
    else:
        txt = str(sheet_name).lower().replace("week", "").strip()
        start, end = parse_week_period(txt) if txt else parse_week_period("")
    trucks = get_trucks(df)
    files = []
    for t in trucks:
        truck = t["truck"]
        owner = owner_map.get(_norm_id(truck), t["owner"])
        if any(ch.isdigit() for ch in str(owner)) or ("," in str(owner)):
            owner = "Owner"
        rows = t["rows"]
        base_name_owner = f"{owner.replace(' ', '_')}_{truck}_{start:%m_%d_%Y}_to_{end:%m_%d_%Y}"
        key = _norm_id(truck)
        fuel_amt = fuel_map.get(key, 0.0)
        cfg = None
        if driver_configs and isinstance(driver_configs, dict):
            cfg = driver_configs.get(key) or driver_configs.get(int(key)) if key else None
        driver_rpm = (cfg.get("rate_per_mile") if cfg else None)
        driver_name = (cfg.get("driver_name") if cfg else owner)
        owner_name = (cfg.get("company") if cfg and cfg.get("company") else owner)
        owner_bytes = make_statement_pdf_bytes(rows, owner_name, truck, start, end, True, fuel_amt, driver_rate_per_mile=driver_rpm)
        driver_bytes = make_statement_pdf_bytes(rows, driver_name, truck, start, end, False, fuel_amt, driver_rate_per_mile=driver_rpm)
        files.append({"name": f"OWNER_{base_name_owner}.pdf", "bytes": owner_bytes})
        files.append({"name": f"DRIVER_{(driver_name or 'Driver').replace(' ', '_')}_{truck}_{start:%m_%d_%Y}_to_{end:%m_%d_%Y}.pdf", "bytes": driver_bytes})
    return files


if __name__ == "__main__":
    main()
