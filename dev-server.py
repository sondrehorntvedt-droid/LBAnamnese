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


class ReusableTCPServer(socketserver.TCPServer):
    # Verhindert 'Address already in use' direkt nach einem Neustart.
    allow_reuse_address = True


handler = functools.partial(NoCacheHandler, directory=ROOT)

with ReusableTCPServer(("", PORT), handler) as httpd:
    print(f"No-cache dev server on http://localhost:{PORT}")
    print(f"Serving: {ROOT}")
    httpd.serve_forever()
