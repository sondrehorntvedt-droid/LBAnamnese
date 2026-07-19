#!/usr/bin/env python3
"""Struktur-Validator für Regelwerk-Snapshots (reines Python, ohne Abhängigkeiten).

Aufruf:
    python3 tools/validate_regelwerk.py regelwerk/regelwerk-<version>.json

Prüft die Invarianten, auf denen die deterministische Engine beruht:
  - Schema-Kennung und Versionsfeld vorhanden
  - Pflichtblöcke: fragenkatalog, gelenke_baum, systemische_baum,
    testbatterie, red_flags, umfang
  - jede Region hat Screening-Fragen
  - jede Verzweigung hat eine bedingung {feld, op, wert}
  - jeder Red Flag hat einen hinweis-Text
Exit-Code 0 = grün, 1 = Fehler (CI-tauglich).
"""
import hashlib
import json
import sys


def main(pfad: str) -> int:
    with open(pfad, encoding="utf-8") as f:
        rohbytes = f.read().encode("utf-8")
    d = json.loads(rohbytes)

    fehler = []
    if d.get("schema") != "lindebergs-regelwerk@1":
        fehler.append("schema-Kennung fehlt/falsch")
    if not d.get("version"):
        fehler.append("version fehlt")
    for pflicht in ["fragenkatalog", "gelenke_baum", "systemische_baum", "testbatterie", "red_flags", "umfang"]:
        if pflicht not in d:
            fehler.append(f"Pflichtblock fehlt: {pflicht}")

    for baum in ["gelenke_baum", "systemische_baum"]:
        for key, e in d.get(baum, {}).items():
            if not e.get("screening"):
                fehler.append(f"{baum}.{key}: screening leer")
            for r in e.get("verzweigung", []) or []:
                b = r.get("bedingung")
                if not b or not all(k in b for k in ("feld", "op", "wert")):
                    fehler.append(f"{baum}.{key}: Verzweigung ohne vollständige bedingung")
            for rf in e.get("red_flags", []) or []:
                if not rf.get("hinweis"):
                    fehler.append(f"{baum}.{key}: Red Flag ohne hinweis")

    print(f"Datei:    {pfad}")
    print(f"Version:  {d.get('version')}")
    print(f"SHA-256:  {hashlib.sha256(rohbytes).hexdigest()}")
    print(f"Regionen: {len(d.get('gelenke_baum', {}))} Gelenke + {len(d.get('systemische_baum', {}))} Systeme")
    print(f"Fragen:   {len(d.get('fragenkatalog', {}))}")
    if fehler:
        print("VALIDIERUNG: FEHLER")
        for f_ in fehler[:20]:
            print("  -", f_)
        return 1
    print("VALIDIERUNG: ALLE PRÜFUNGEN GRÜN")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
