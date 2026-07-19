# Orthopädie-Tiefenaudit der 24 Gelenk-Module — für das Advisory Board

Stand: 19.07.2026 · Regelwerk v2026.07.19-4 · Auditor: automatisierte Inventur + Sofort-Härtung; **fachliche Endabnahme durch das Advisory Board ausstehend.**

## 1. Was heute bereits behoben wurde (Safety First)

**7 neue Sicherheits-Red-Flags** in 5 Modulen, die zuvor KEINEN einzigen Alarm hatten (alle im Browser verifiziert, Golden Cases GC-15/16):

| Modul | Neuer Alarm | Regelbasis |
|---|---|---|
| KNIE | Heiß + gerötet + Fieber → **septische Arthritis** (Notfall) | klinischer Standard |
| KNIE | Trauma + nicht belastbar → Röntgen | **Ottawa Knee Rule** (Stiell 1995) |
| OSG | Trauma + nicht belastbar → Röntgen | **Ottawa Ankle Rules** (Stiell 1992) |
| OSG | Peitschenhieb-Ereignis Wade/Ferse → **Achillessehnenruptur** (Thompson-Test) | klinischer Standard |
| HANDGELENK | Sturz + Tabatière-Druckschmerz → **Skaphoidfraktur** (im Erst-Röntgen oft unsichtbar) | klinischer Standard |
| HAND_FINGER | Geschwollen/gerötet/pochend nach Verletzung → **Beugesehnenphlegmone** (Kanavel; handchirurgischer Notfall) | klinischer Standard |
| ELLBOGEN | Heiße pralle Olekranon-Schwellung → **septische Bursitis** | klinischer Standard |

Zuvor in dieser Session: KIEFER_TMJ-Vertiefung (DC/TMD-orientiert, Schiffman 2014; 22 Fragen, 2 Flags) und Frauengesundheit (GYNAEKOLOGIE; Molinari-Ausrichtung).

## 2. Inventur aller 24 Module (nach Härtung)

Reihenfolge nach Ausbautiefe; „Fragen" = Screening+Zweige.

| Modul | Fragen | Red Flags | Einschätzung |
|---|---|---|---|
| KIEFER_TMJ | 22 | 2 | ✅ tief (DC/TMD) |
| SCHULTER_GH | 18 | 1 | ✅ tief |
| LWS | 15 | 2 | ✅ tief (Cauda, Sattel) |
| HWS | 15 | 1 | ✅ tief (+CAD/Alar via Risikoprofil) |
| KNIE | 14+ | **2 neu** | ✅ gut |
| HUEFTE | 12 | 1 | ✅ gut |
| BWS | 11 | 1 | ✅ gut |
| HANDGELENK | 9+ | **1 neu** | ✅ ok |
| HAND_FINGER | 9+ | **1 neu** | ✅ ok |
| ELLBOGEN | 9+ | **1 neu** | ✅ ok |
| OSG | 8+ | **2 neu** | ✅ ok |
| RIPPEN_THORAX | 6 | 1 | 🟡 dünn |
| KLAVIKULA | 6 | 1 | 🟡 dünn |
| AC_GELENK, ISG, MITTELFUSS, FUSS_ZEHEN | je 6 | 0 | 🟡 dünn |
| SKAPULA, CTU, SYMPHYSE | je 5 | 0 | 🟡 dünn |
| TLU, LSU_SAKRUM | je 4 | 0 | 🟡 dünn |
| UNTERARM, USG | je 3 | 0 | 🟡 dünn |

## 3. Empfehlungen an das Advisory Board (offene Punkte)

**A. Dünne Module vertiefen** (Vorschlag je Modul 2–4 Zweige):
- **ISG**: Schwangerschafts-Kopplung ausbauen (Verbindung zu GYN-SS vorhanden), entzündliche Sakroiliitis (nächtlicher Schmerz, Besserung bei Bewegung → axSpA-Screen analog LWS-C), Fraktur bei Osteoporose/Sturz.
- **FUSS_ZEHEN/MITTELFUSS**: Morton-Neurom, Hallux rigidus/valgus-Differenzierung, Stressfraktur (Läufer, plötzliche Belastungssteigerung), Charcot-Fuß bei Diabetes (🚩 Kandidat für Red Flag: warmer geschwollener Fuß + Diabetes).
- **RIPPEN_THORAX**: Atemnot/atemabhängiger Schmerz nach Trauma (🚩 Pneumothorax-Kandidat), Stressfraktur bei Husten/Osteoporose.
- **SYMPHYSE**: peripartale Symphysenlockerung vertiefen (Kopplung zu GYN-SS-002 vorhanden).
- **UNTERARM/USG/TLU/LSU/CTU/SKAPULA/AC/KLAVIKULA**: bewusst schlank halten oder je 1–2 gezielte Zweige (Board entscheidet Priorität nach Praxis-Häufigkeit).

**B. Leitlinien-Gegenlesen** der bestehenden tiefen Module: Schulter (Instabilität/RC/Frozen — ggü. DVSE-Konsens), Knie (Ottawa umgesetzt; Pivot-Shift-Anamnese?), Hüfte (FAI/Coxarthrose ggü. S2k), HWS (Canadian C-Spine-Elemente ggü. bestehendem Trauma-Zweig).

**C. Engine-Designentscheidung prüfen (Entwickler + Board):** `cdss_gewicht` wird bei mehrfacher Zuweisung **überschrieben (letzter gewinnt), nicht summiert** (Beispiel GC-16: Red Flag setzt skaphoidfraktur +5, Trauma-Zweig überschreibt mit +4). Deterministisch und stabil — aber klären, ob Summierung klinisch gewünscht ist. Änderung wäre ein bewusster Regelwerk-Versionssprung mit Golden-Neueinfrierung.

**D. Arbeitsweise für Board-Änderungen:** Fragen/Zweige/Flags sind reine Daten (`data/A06_gelenke_baum.js` + Ableitungen in `app/cdss-context.js`). Jede Änderung: Toter-Ast-Audit → Golden-Suite (16 Fälle, 10x-Regel) → Regelwerk-Versionssprung mit Hash → Supabase-Publish. Nichts davon erfordert App-Code-Änderungen.
