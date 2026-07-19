# Lindebergs OS — Datenbank & Architektur (Entwickler-Handbuch)

**Status:** kanonische Quelle · **Determinismus-Validator:** grün (`app/validate.js`)
**Für:** Sven, Ali, Julian — Übergabe-Dokument der deterministischen Anamnese-/CDSS-Datenbank.

---

## 0. Grundprinzip (bitte zuerst lesen)

Die medizinische Logik ist **deterministisch und regelbasiert**, nicht LLM-getrieben.
Gleiche Eingabe → **immer identisches Ergebnis** (Ziel: „10 von 10 Patienten mit gleichem
Muster → gleiches Ergebnis"). KI/LLM ist ausschließlich eine **Lese-/Zusammenfass-Schicht**
(Uploads auslesen, Texte strukturieren) — sie trifft **keine** Verzweigungs-, Red-Flag- oder
Diagnose-Entscheidung. Diese Trennung ist die Kern-Sicherheitsgarantie und muss erhalten bleiben.

- **Diese Datenbank (`LindebergsOS-Anamnese-App/`) ist die einzige Wahrheit.**
- Die alten Ordner `../Anamnese/` und `../CDSS_Regelkatalog/` sind **Legacy** (früherer
  CommonJS-Stand, unvollständig). Nicht mehr verwenden; als Referenz archivieren.
- Kein Build-Schritt, keine externen CDN-Abhängigkeiten. Reine ES-Module + `localStorage`
  (v1). Migration nach Next.js + Supabase ist vorgesehen (Datenmodell unten).

---

## 1. Ordnerstruktur

```
LindebergsOS-Anamnese-App/
  index.html, main.js         App-Shell (type="module")
  dev-server.py               No-Cache-Devserver (Port 8750) — Pflicht beim Testen (ES-Modul-Cache)
  styles/                     tokens.css, components.css, layout.css, print.css
  data/                       ►►► DIE DATENBANK ◄◄◄  (siehe §2)
    cdss/                     Diagnosekataloge pro Region (Namen, ICD-10, clinical_tests, Bildgebung)
  app/                        Logik & Rendering
    state.js                  Antworten-Store + localStorage
    router.js                 Schrittnavigation, Tier-Filter (getVisibleSteps)
    conditions.js             evalBedingung() / evaluateCondition() — Bedingungs-Grammatik
    cdss-context.js           Screening-Antwort → semantischer Fact (Brücke zur Verzweigung)
    cdss-engine.js            computeRegionPfad(): Screening + gefeuerte Verzweigung + Red Flags
    redflags.js               globaler Red-Flag-Wächter (registerRedFlagSource)
    privacy.js                therapist_only-Trennung (DSGVO)
    beschwerde-store.js       Namensraum pro Beschwerde (bid::id), getNamespacedView()
    summary.js                computeSummary() — aggregiert alles zum Ergebnis
    klinik.js                 Differentialdiagnose-Labels/ICD-10 + Region-Testbatterie + gesicherte Dx
    risikoprofil.js           Fossum-Risikoprofil (therapist_only)
    anamnese-index.js         ZENTRALER FRAGE-INDEX (id → label/typ/optionen/gruppe)
    manifest.js               ►► buildManifest(): maschinenlesbares Gesamtabbild (§6)
    validate.js               ►► runValidation(): Integrität + Determinismus (§6)
    render/, steps/           UI (nicht Teil der Datenbank)
  DATABASE.md                 dieses Dokument
```

---

## 2. Datenbank-Module (`data/`)

| Datei | Inhalt |
|---|---|
| `A00_stammdaten.js` | Stammdaten (SD-*), BMI-Berechnung |
| `A00b_ziele.js` | PROM-Ziele (PSFS/NRS/WHO-5), **ANAMNESE_TIEFE_OPTIONEN** (fokus/ganzheitlich/tiefenanalyse) |
| `A00c_uploads.js` | Upload-Kategorien nach Fachbereich, `deckt_felder` (Vorbefüllung) |
| `A01_hauptbeschwerde.js` | W-Fragen (HB-*), **HB-002 Regionen**, region­spezifische besser/schlechter-Optionen (`getWOptionen`) |
| `A01b_therapie_historie.js` | Vorbehandlungen + interventionelle Ortho-Maßnahmen |
| `A01c_begleitsymptome.js` | B-Symptomatik (BS-*) |
| `A02_vorgeschichte_pmh.js` | Vorgeschichte (PMH-*): Diagnosen, OPs/Traumen (repeatable, mit „heute noch aktiv"), Meds, Krebs-Detail, Noxen, Familie |
| `A02b_systemanamnese.js` | Gate-Optionen + **ENDOKRIN_DEEP_FRAGEN** (KPNI-Deep-Dive). *Hinweis:* die Systemanamnese läuft jetzt baumbasiert über A07. |
| `A03_daniel_vitalmedizin.js` | Schlaf/Energie + Darm (Stoffwechsel/Hormon entdoppelt → jetzt in A07/A02b) |
| `A04_sieben_faktoren.js` | 7-Faktoren-Definitionen (abgeleitet, siehe `faktoren-mapping.js`) |
| `A05_psychosozial_mental.js` | PHQ-4 (therapist_only), Yellow Flags, Perceived Stress |
| `A06_gelenke_baum.js` | **GELENKE_BAUM** (24 Gelenke) + `GELENKE_INDEX`. Fragebaum §3 |
| `A07_systemisch_baum.js` | **SYSTEMISCHE_BAUM** (16 Organsysteme). Fragebaum §3 |
| `A08_longevity_baum.js` | **LONGEVITY_BAUM** (10 Module) — gerettet, noch nicht UI-verkabelt |
| `A10_sport_bewegung.js` | Sport/Bewegung (Kern + Performance) |
| `A11_ernaehrung.js` | Ernährung & Trinkverhalten (Kern + KPNI-Tiefe) |
| `A12_funktionelle_marker.js` | funktionelle Labor-Referenzbereiche (therapist_only) |
| `A14_testbatterie.js` | **Lindebergs-Testbatterie**: SAFETY_TESTS (indikationsgeleitet), BASISTESTS (gelenkspezifisch), OSTEO_ROUTINE |
| `A15_vitalparameter.js` | Vitalparameter (VP-*): Blutdruck, Puls, Temp, SpO₂, HRV, Nüchtern-BZ — Geräte-Schnittstelle-ready |
| `cdss/*.js` | Diagnosekataloge pro Region: `name`, `icd10`, `clinical_tests` (Sens/Spez), `imaging_recommendation` |

**Bekannte Lücken / nächste Schritte:**
- `A08_longevity_baum.js` ist als ES-Modul **in `data/` gerettet** (LONGEVITY_BAUM, 10 Module),
  aber **noch nicht in die App-UI verkabelt** (kein eigener Longevity-Schritt).
- `A09_frage_baum_master` (Orchestrierungs-Logik) bleibt im `_Archiv` — durch `cdss-engine.js`
  + `router.js` ersetzt, nicht mehr benötigt.
- Die Diagnose-Labels/ICD-10 für die Baum-Gewichtsschlüssel sind erst teilweise gemappt
  (`klinik.js`, ~40 von 186) — Rest fällt auf generische Namen zurück. Sauberе Namen + ICD-10
  liegen in den `cdss/`-Katalogen und müssen mit den Gewichtsschlüsseln verknüpft werden (§5).

---

## 3. Fragebaum-Grammatik (GELENKE_BAUM / SYSTEMISCHE_BAUM)

Jeder Regions-/System-Eintrag:

```js
KEY: {
  id: "KEY", name: "…", gruppe: "…", icd10: ["M75.1", …], cdss_modul: "01_schulter",
  screening: [ { id, frage, type, options } … ],          // 1. Ebene: immer bei offenem Gate
  verzweigung: [                                            // 2. Ebene: nur wenn bedingung erfüllt
    { bedingung: { feld, op, wert }, cdss_gewicht: { diagnose_key: +n }, fragen: [ … ] }
  ],
  red_flags: [ { bedingung, cdss_gewicht, hinweis } ]       // Sicherheits-Stopp
}
```

- **`type`**: `yes_no` · `single_choice` · `multiple_choice` · `vas_scale` · `textarea` ·
  `number` · `text` · `repeatable_entry` (Felder: `text|number|date|select`) · `likert_4` (mit `items`).
- **`bedingung.op`**: `>= <= > <` (nur bei vorhandenem Zahlenwert — sonst `false`, verhindert
  Fehlöffnen), `== in includes any`.
- **`bedingung.feld`** ist ein **semantischer Fact**, KEINE Frage-ID. Er wird in
  `cdss-context.js` aus den Screening-Antworten abgeleitet
  (`REGION_CONTEXT_BUILDERS[KEY]`). Globale Facts: `alter, geschlecht, onset_dauer, trauma`.
  **Regel:** jeder in einem Baum referenzierte `feld` MUSS von einem Builder oder als globaler
  Fact produziert werden — sonst „toter Ast". Der Validator (§6) erzwingt das.
- **`cdss_gewicht`** akkumuliert pro Diagnose-Schlüssel → Differentialdiagnose-Ranking
  (`summary.js` → `s.beschwerden[].verdacht`).
- **`red_flags[].hinweis`** ist Pflicht; feuert über `redflags.js` (Vollbild-Stopp) und ist in
  Systemanamnese wie Beschwerde-Loop aktiv.

**ID-Konventionen:** Region-Screening `KAR-001`, Verzweigung `KAR-B-001` (Buchstabe = Zweig),
Red-Flag-Facts sprechend (`akuter_brustschmerz_ruhend`). Beschwerde-Loop speichert
**namespaced**: `${beschwerdeId}::${id}` (z.B. `b1::SCH-004`). Die Systemanamnese speichert
**global** (`KAR-001`, Gate `SYSG-HERZ_KARDIO`, Freitext `SYSFREI-HERZ_KARDIO`).

---

## 4. Tiefe-Stufen & Privacy

- **Tiefe** (`state.meta.anamneseTiefe`): `fokus` (nur Beschwerde) · `ganzheitlich` (empfohlen)
  · `tiefenanalyse` (+ funktionelle Medizin). Schritte tragen `tiers: [...]`; ohne `tiers` =
  immer sichtbar. Tier-Filter in `router.js/getVisibleSteps`.
- **Privacy (`privacy.js`)**: `THERAPIST_ONLY_IDS` (PHQ-4-Items) + alle Therapeuten-Reiter
  (Klinik, Risikoprofil, Differential, funktionelle Referenzbereiche). Patienten-Ansicht ruft
  `getPatientSafeView()`. **Muss** bei Supabase über RLS erzwungen werden (v1 nur clientseitig).

---

## 5. Ergebnis-Aggregation (`summary.js`)

`computeSummary()` liefert deterministisch u.a.: `grunddaten`, `ziele`, `beschwerden[]`
(Region + Priorität P1–P4 + Schmerz + Charakter + **verdacht[]** (ICD-10 via `klinik.js`)),
`vorgeschichte` (OPs/Meds/Unfälle), `warnzeichen` (B-Symptomatik), `labor`, `timeline`
(Ereignisse + Anamnese-Marker mit Region+Diagnose), `therapist` (PHQ-4, Yellow/Red Flags,
**risikoprofil**). 5 Zusammenfassungs-Reiter + Klinik-Reiter (therapist_only) in
`steps/step-abschluss.js`.

---

## 6. Manifest & Validator (das Handoff-Werkzeug)

```js
import { buildManifest, manifestAlsJson } from "./app/manifest.js";
import { runValidation } from "./app/validate.js";
```

- **`buildManifest()`** → maschinenlesbares Gesamtabbild (aktuell **550 Fragen, 27 Regionen,
  24 Gelenk- + 16 Organ-Module, 186 Diagnosen**). Für KI-Agenten & Team die eine Abfrage-Quelle.
  Bewusst **nicht** als statisches JSON eingecheckt (würde gegenüber dem Code veralten) —
  bei Bedarf regenerieren:
  Browser-Konsole → `import('/app/manifest.js').then(m=>copy(m.manifestAlsJson()))`.
- **`runValidation()`** → prüft Integrität + Determinismus. Aktuell **grün**:
  1. keine toten Verzweigungsäste (jeder `bedingung.feld` hat eine Quelle)
  2. alle Regionen verweisen auf existierende Bäume
  3. jede Red-Flag-Regel hat einen Hinweis
  4. therapist_only-Felder im Index bekannt
  5. **Determinismus**: identische Eingabe → bit-identisches Ergebnis (Schulter & Herz doppelt)
  6. jede Frage hat ein Label

  → In CI einbinden: `runValidation().passed === true` als Gate für jeden Merge.

---

## 7. Eingabe-Kanäle: Spracheingabe & Wearables

- **Spracheingabe (`app/voice.js`)**: optionaler Diktier-Knopf **nur an Freitextfeldern**
  (Web Speech API, `de-DE`, Chrome/Edge; sonst kein Knopf). Die strukturierten, deterministischen
  Felder (Klick/Slider) bleiben bewusst unberührt → Datenbank-Kern eindeutig. Für robuste
  Mehrsprachigkeit später Cloud-STT (Whisper) über das Backend andockbar.
- **Wearables (Vitalparameter, `A15`)**: die VP-Felder sind so angelegt, dass Geräte sie
  automatisch befüllen. **Datenfluss:** Oura / WHOOP / Garmin / Fitbit / Withings bieten
  offizielle **OAuth2-REST-APIs** (HRV, Ruhepuls, Schlaf) — benötigen aber einen **Backend-Dienst**
  (OAuth-Token-Austausch + Speicherung), gehört also in die Supabase-Phase, nicht in v1.
  **Apple Health / Health Connect** sind nur über eine native App lesbar (kein direkter
  Web-Zugriff). In der App ist ein „Geräte verbinden"-Scaffold sichtbar (noch ohne Funktion).

## 8. Supabase-Zielmodell (Migration, Roadmap)

Tabellen (aus `cdss/index.js` DB_SCHEMA): `cdss_diagnoses`, `cdss_questions`, `cdss_rules`,
`risk_profiles` (**therapist_only = TRUE Pflicht, RLS**), `patient_assessments`. Die ES-Module
sind so strukturiert, dass sie sich 1:1 in diese Tabellen serialisieren lassen (via `buildManifest`).

---

## Update 19.07.2026 — Supabase, Golden Cases, Regelwerk-Versionierung

### Cloud-Architektur (Supabase, Projekt „Lindebergs Anamnese Database", eu-west-1, ID fexkmpamofjmiysivzzy)
- **profiles** — je Auth-Benutzer (Trigger legt Zeile bei Registrierung an); rolle: patient|therapeut|admin (Therapeuten-Lesezugriff kommt als spätere, eigene RLS-Policy).
- **anamnese_stand** — EIN JSONB-Datensatz je Benutzer = kompletter App-Zustand (die localStorage-Schlüssel `lindebergs_anamnese_v1`, `lindebergs_patientenakte`). RLS: nur eigene Zeile. Stempel: `app_version`, `regelwerk_version`, `aktualisiert_am` (Last-Write-Wins).
- **regelwerk_versionen** — veröffentlichte Regelwerk-Stände (Version, SHA-256, Umfang). Volldaten liegen kanonisch in Git (`regelwerk/`), die Cloud-Zeile macht sie verifizierbar. Schreiben nur via Service-Role/Publish-Werkzeug.

### Auth & Sync (app/)
`main.js` (Gate) → `auth.js` (Anmelden/Registrieren/Reset, deutsch) → `cloud-sync.js` (`initialSync`: Cloud gewinnt; Autosave entprellt 2 s; Flush bei Verlassen; Logout sichert + räumt lokal) → `boot.js` (frühere main.js). Konto-Schritt: `steps/step-konto.js`. Client: `supabase.js` (Publishable Key ist öffentlich by design; Sicherheit = RLS).

### Determinismus-Beweis (tests/)
`tests/golden.html` führt die 11 Fälle aus `tests/golden/cases.js` je **10×** aus (bit-identisch, stabile Schlüsselsortierung) und vergleicht gegen den eingefrorenen Snapshot `tests/golden/expected.json`. Regeländerung ⇒ Fall wird rot ⇒ bewusstes Neu-Einfrieren per Commit. Das ist die technische Form von „10 gleiche Antwortmuster → 10 gleiche Ergebnisse".

### Regelwerk-Versionierung (regelwerk/, tools/)
`tools/export-regelwerk.html?version=…` exportiert die komplette Entscheidungsbasis (Fragenkatalog 594, Bäume 24+16, Testbatterie, Red-/Yellow-Flags) als `regelwerk/regelwerk-<version>.json` — ohne Zeitstempel im Inhalt (hash-stabil). Prüfung: `python3 tools/validate_regelwerk.py regelwerk/<datei>`. Aktuell: **v2026.07.19-1**, SHA-256 `f846f78c60eeafcca28a1b9a74918d516a127785231062b94fabc238aa07fc5a`, in Supabase veröffentlicht.

### KI-Leitplanken (verbindlich)
KI niemals im Entscheidungspfad (Verzweigung/Score/Red Flag/Diagnose = nur Engine). KI später ausschließlich: Freitext strukturieren, Befunde auslesen (mit Quellenpflicht), Ergebnisse formulieren — Ausgaben nur als IDs aus dem Regelwerk-Katalog, sonst verwerfen; Felder markiert als engine|ai_suggested|human_confirmed.
