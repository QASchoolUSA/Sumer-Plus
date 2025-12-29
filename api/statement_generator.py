from http.server import BaseHTTPRequestHandler
import json
import os
import traceback
import base64

import statement_generator as sg


class handler(BaseHTTPRequestHandler):
    def _respond(self, status: int, payload: dict):
        body = json.dumps(payload)
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(body.encode("utf-8"))

    def do_GET(self):
        try:
            sg.main()
            generated = []
            out_dir = sg.OUTPUT_DIR
            if os.path.isdir(out_dir):
                for name in os.listdir(out_dir):
                    if name.endswith(".pdf"):
                        generated.append(name)
            self._respond(200, {"ok": True, "generated": generated})
        except Exception as e:
            self._respond(500, {"ok": False, "error": str(e), "trace": traceback.format_exc()})

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length) if length > 0 else b"{}"
            payload = json.loads(raw.decode("utf-8"))
            action = payload.get("action") or ""
            excel_b64 = payload.get("excel_base64") or ""
            sheet = payload.get("sheet") or None
            driver_configs = payload.get("driver_configs") or None
            loads_b64 = payload.get("loads_excel_base64") or ""
            loads_sheet = payload.get("loads_sheet") or None
            terms_b64 = payload.get("terms_excel_base64") or ""
            drivers_sheet = payload.get("drivers_sheet") or None
            owners_sheet = payload.get("owners_sheet") or None
            if not excel_b64:
                    loads_bytes = base64.b64decode(loads_b64)
                    terms_bytes = base64.b64decode(terms_b64)
                    files, period_str = sg.generate_statements_from_two_excels(
                        loads_bytes, loads_sheet, terms_bytes, drivers_sheet, owners_sheet
                    )
                else:
                    self._respond(400, {"ok": False, "error": "excel_base64 required"})
                    return
            else:
                excel_bytes = base64.b64decode(excel_b64)
                if action == "sheets":
                    names = sg.get_sheet_names_from_bytes(excel_bytes)
                    self._respond(200, {"ok": True, "sheets": names})
                    return
                # Standard generator might just return files, need check if it was updated too? 
                # Assuming standard generator still returns just list for now or we handle it.
                # If standard generator wasn't updated, let's assume just list.
                # But actually, users request was specifically about the two-excel flow.
                res = sg.generate_statements_from_excel_bytes(excel_bytes, sheet, driver_configs=driver_configs)
                if isinstance(res, tuple):
                    files, period_str = res
                else:
                    files = res
                    period_str = ""
            out = []
            for f in files:
                out.append({
                    "name": f["name"],
                    "pdf_base64": base64.b64encode(f["bytes"]).decode("utf-8"),
                    "stats": f.get("stats")
                })
            
            # Match new frontend expectation: { output: stringified_json } or { files: ..., period: ... }
            # The root statement_generator.py do_POST was returning { output: json.dumps({ files: ..., period: ... }) }
            # But here we are in api/statement_generator.py which seems to return { ok: True, files: ... }
            # We need to bridge this. Frontend updated to handle { files: ..., period: ... } inside `data.output`.
            # OR logic in `StatementGeneratorClient.js` usually handles `data.files` directly if `data.output` is not present?
            # Let's see frontend logic:
            # if (!data.files && data.output ...) -> parse data.output
            # else if (data.files) -> use data.files
            
            # If we return { ok: True, files: ..., period: ... }, frontend might use `data.files` and ignore period?
            # Frontend code:
            # if (!data.files && data.output...)
            # else { parsedData = data.files; }
            # And `setStatementPeriod` is ONLY called inside the `data.output` parsing block in my recent edit.
            
            # So to support period display, we MUST return `output` as a stringified JSON containing files and period.
            # OR update frontend to read period from `data.period`.
            
            # Easier to stick to the pattern I established in `statement_generator.py` (which I thought I was editing correctly but wasn't running).
            # The running file returns `ok, files`. I should change it to return `output`.
            
            result_obj = {
                "files": out,
                "period": period_str
            }
            self._respond(200, {"ok": True, "output": json.dumps(result_obj)})
        except Exception as e:
            self._respond(500, {"ok": False, "error": str(e), "trace": traceback.format_exc()})
