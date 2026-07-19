# Testbericht — Live-Abnahme 19.07.2026

**Live-URL:** https://lb-anamnese.vercel.app (Vercel `lb-anamnese` ← GitHub `sondrehorntvedt-droid/LBAnamnese`, main `d65aa0d`)

## Funktionstests auf der Live-Seite (Browser, Produktion)

| # | Test | Ergebnis |
|---|---|---|
| 1 | Login mit falschen Zugangsdaten | ✅ „E-Mail oder Passwort ist nicht korrekt." — Supabase-Roundtrip vom Vercel-Origin funktioniert (CORS, Keys) |
| 2 | Registrierungs-Maske + Validierung (Passwort < 8 Zeichen) | ✅ „Bitte mindestens 8 Zeichen." — clientseitig abgefangen, kein Konto erzeugt |
| 3 | Passwort vergessen (nicht existierende Testadresse) | ✅ „E-Mail unterwegs"-Bildschirm; keine Konto-Ausspähung möglich (immer gleiche Antwort) |
| 4 | Golden-Case-Suite in Produktion (`/tests/golden.html`) | ✅ 11 Fälle × 10 Wiederholungen: **Determinismus BESTANDEN, Snapshot ALLE IDENTISCH** |
| 5 | Konsole (Startseite + Golden-Seite) | ✅ 0 Fehler |
| 6 | Auslieferung aller Schichten (index, app/, data/, styles/, tests/, regelwerk/) | ✅ 10/10 Stichproben HTTP 200 |

## Supabase (Projekt fexkmpamofjmiysivzzy, eu-west-1)

| Prüfung | Ergebnis |
|---|---|
| Tabellen profiles / anamnese_stand / regelwerk_versionen | ✅ vorhanden, RLS aktiv, 5 Policies |
| Profil-Trigger `on_auth_user_created` | ✅ vorhanden |
| Regelwerk v2026.07.19-1 veröffentlicht (Hash f846f78c…) | ✅ 1 Zeile |
| Security-Advisor | ✅ Härtung eingespielt: EXECUTE auf `handle_new_user()` für anon/authenticated/public entzogen |
| Benutzer | 0 (Erst-Registrierung durch Sondre steht aus — bewusst: Claude legt keine Konten an) |

## Git

Lokal `main` = `origin/main` (`d65aa0d`), Arbeitsverzeichnis sauber. Deploy-Key (nur Repo LBAnamnese, read/write) aktiv; Update-Weg: Commit → Doppelklick „Lindebergs Code hochladen.command" → Vercel baut automatisch.

## Bewusst NICHT getestet

- **Echte Registrierung / echter Login:** Claude erstellt grundsätzlich keine Konten und handhabt keine Passwörter. Der End-zu-End-Beweis (Signup → Bestätigungs-Mail → Login → Cloud-Sync-Zeile in `anamnese_stand`) erfolgt durch Sondres eigene Erst-Registrierung.

## Offene Punkte (klein, dokumentiert)

1. Supabase-Dashboard → Authentication → **URL Configuration → Site URL** auf `https://lb-anamnese.vercel.app` setzen (sonst zeigt der Redirect nach Mail-Bestätigung auf localhost; die Bestätigung selbst funktioniert trotzdem).
2. Supabase-Dashboard → Authentication → Passwords → **Leaked-Password-Protection aktivieren** (HaveIBeenPwned-Abgleich; letzter Advisor-Hinweis).
3. Therapeuten-Lesezugriff (rolle `therapeut`) ist als Policy bewusst noch nicht freigeschaltet — kommt als eigener, geprüfter Schritt.
