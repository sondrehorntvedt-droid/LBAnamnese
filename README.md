# LindebergsOS — Online-Anamnese (Prototyp)

Patienten-Anamnese im Lindebergs-Design („Nordic Health Luxury"), gespeist aus
den bestehenden CDSS-/Fragebaum-Datenbanken. Vanilla HTML/CSS/JS (ES-Module),
kein Build-Schritt, kein Backend — vorbereitet für spätere Next.js/Supabase-
Migration.

## Starten

Da ES-Module über `file://` nicht laden, wird ein lokaler Server gebraucht:

```bash
cd "Anamnese Datenbanken/LindebergsOS-Anamnese-App"
python3 dev-server.py      # No-Cache-Server auf http://localhost:8750
```

Dann im Browser öffnen: **http://localhost:8750/index.html**

(`dev-server.py` setzt No-Cache-Header, damit Änderungen sofort sichtbar sind.)

## Aufbau des Patienten-Flusses

1. **Willkommen**
2. **Befunde hochladen** (Pre-Flight) — erspart spätere Fragen
3. **Ziele & Anamnese-Tiefe** — Fokus / Ganzheitlich / Tiefenanalyse
4. **Ihre Daten** (Stammdaten)
5. **Beschwerde-Loop** — pro Beschwerde eigene Akte: Region → Body-Map →
   W-Fragen → CDSS-Deep-Dive → Therapie-Historie; beliebig wiederholbar
6. **Sicherheitsfragen** (Red-Flag-Screening)
7. **Vorgeschichte** (strukturierte Einträge: Jahr/Was, Medikamente…)
8. **Systemanamnese** (Gatekeeper: eine Frage pro System)  — ab Ganzheitlich
9. **Energie & Vitalität** (Vitalmedizin)                   — ab Ganzheitlich
10. **Sport & Bewegung**                                     — ab Ganzheitlich
11. **Wohlbefinden** (PHQ-4, Yellow Flags)                   — ab Ganzheitlich
12. **Vitalitätsprofil** (7-Faktoren-Spinnennetz, abgeleitet)— ab Ganzheitlich
13. **Zusammenfassung** — Patienten-Ansicht + Therapeuten-Vorschau + Druck/PDF

## Kernprinzipien (im Code umgesetzt)

- **Minimaler Aufwand, volle Tiefe:** Tiefe-Stufen blenden Schritte aus;
  systemische Module fragen erst per Gate „ist das ein Thema?"; Uploads
  markieren abgedeckte Felder.
- **7 Faktoren eingewoben:** kein separater 7-Slider-Block — die Faktoren
  werden aus dem natürlichen Fluss abgeleitet (`app/faktoren-mapping.js`),
  Spinnennetz bleibt.
- **Deterministisch:** gleiche Antworten → identisches Ergebnis (CDSS-Gewichte,
  7-Faktoren, DDx-Ranking sind reine Funktionen der Antworten).
- **DSGVO-Trennung:** `app/privacy.js` hält therapist_only-Inhalte (PHQ-4,
  Yellow Flags, Risikoprofil) strikt aus der Patienten-Ansicht heraus.

## Datenbasis

`data/` enthält 1:1-ES-Modul-Kopien der kanonischen Quellen
(`Anamnese/A00–A09`, `CDSS_Regelkatalog/00–11 + S01–S04 + Risikoprofil +
behandlung_osteopathie`). Die kanonischen CommonJS-Dateien bleiben unberührt.

## Offen / Roadmap

- Daniels erweiterte Vitalmedizin-Module (Nährstoffe, Hormone,
  Stoffwechsel-Typisierung, Blutzucker) als optionale Tiefenanalyse-Blöcke —
  Kategorie→Nährstoff/Hormon-Zuordnung teils unbestätigt (mit Daniel klären).
- Echtes KI-/OCR-Auslesen der Uploads (aktuell nur Feld-Mapping hinterlegt).
- 3D-Body-Map (BioDigital) statt 2D-Canvas.
- Next.js/Supabase-Migration mit echter Row-Level-Security.
