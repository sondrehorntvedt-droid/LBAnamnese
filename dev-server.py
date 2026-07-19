#!/usr/bin/env python3
"""Lokaler Entwicklungsserver mit No-Cache-Headern.

ES-Module werden vom Browser aggressiv gecacht, was das Testen frischer
Änderungen verhindert. Dieser Server setzt Cache-Control: no-store auf jede
Antwort, sodass ein Reload immer die aktuelle Datei lädt. Nur für die
lokale Entwicklung — nicht für Produktion.

Ausgeliefert wird immer der Ordner, in dem diese Datei liegt — unabhängig vom
Arbeitsverzeichnis des Aufrufers. Das ist nötig, weil manche Starter
(z.B. Preview-Runner) ohne gültiges cwd starten.
"""
import functools
import http.server
import os
import socketserver

# Verzeichnis dieser Datei = Web-Root (absolut, damit cwd egal ist).
ROOT = os.path.dirname(os.path.abspath(__file__))

# PORT-Umgebungsvariable hat Vorrang (Preview-Runner vergeben Ports dynamisch),
# sonst der feste Entwicklungs-Port.
PORT = int(os.environ.get("PORT") or 8750)


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_POST(self):
        # Nur-Entwicklung: Werkzeugseiten (z.B. tools/export-regelwerk.html)
        # dürfen erzeugte JSON-Artefakte unter generated/ ablegen.
        # Strikt begrenzt auf /__save/<einfacher-name>.json — kein Pfad-Escape.
        import re

        m = re.fullmatch(r"/__save/([A-Za-z0-9._-]+\.json)", self.path)
        if not m:
            self.send_error(404)
            return
        laenge = int(self.headers.get("Content-Length", 0))
        if laenge <= 0 or laenge > 20_000_000:
            self.send_error(400)
            return
        daten = self.rfile.read(laenge)
        ziel_dir = os.path.join(ROOT, "generated")
        os.makedirs(ziel_dir, exist_ok=True)
        ziel = os.path.join(ziel_dir, m.group(1))
        with open(ziel, "wb") as f:
            f.write(daten)
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"ok":true}')


class ReusableTCPServer(socketserver.TCPServer):
    # Verhindert 'Address already in use' direkt nach einem Neustart.
    allow_reuse_address = True


handler = functools.partial(NoCacheHandler, directory=ROOT)

with ReusableTCPServer(("", PORT), handler) as httpd:
    print(f"No-cache dev server on http://localhost:{PORT}")
    print(f"Serving: {ROOT}")
    httpd.serve_forever()
