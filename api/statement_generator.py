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
            if not excel_b64:
                self._respond(400, {"ok": False, "error": "excel_base64 required"})
                return
            excel_bytes = base64.b64decode(excel_b64)
            if action == "sheets":
                names = sg.get_sheet_names_from_bytes(excel_bytes)
                self._respond(200, {"ok": True, "sheets": names})
                return
            files = sg.generate_statements_from_excel_bytes(excel_bytes, sheet, driver_configs=driver_configs)
            out = []
            for f in files:
                out.append({
                    "name": f["name"],
                    "pdf_base64": base64.b64encode(f["bytes"]).decode("utf-8"),
                })
            self._respond(200, {"ok": True, "files": out})
        except Exception as e:
            self._respond(500, {"ok": False, "error": str(e), "trace": traceback.format_exc()})
