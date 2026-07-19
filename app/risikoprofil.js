/**
 * LINDEBERGS OS — Therapeuten-Risikoprofil (deterministisch)
 *
 * ⚠️ NUR THERAPEUTEN-SICHT. Erscheint niemals in der Patientenansicht.
 *
 * Berechnet aus den bereits erhobenen Anamnese-Antworten ein Risikoprofil
 * als Vorbereitung für Diagnostik und Technikwahl — angelehnt an das
 * Regelmodul data/cdss/06_risikoprofil.js (Fossum GOA: HWS-
 * Manipulationssicherheit/CAD, Frakturrisiko, kardiovaskuläres Profil,
 * Konstitutionstyp) sowie an die obere-HWS-Instabilität (Ligg. alaria &
 * transversum) bei RA, Bindegewebeschwäche und Trauma.
 *
 * Gleiche Eingabe → identisches Ergebnis (kein LLM, reine Regellogik). Die
 * Ausgabe ordnet NICHT diagnostisch ein, sondern liefert dem Therapeuten
 * Vorsichtsstufen, empfohlene klinische Tests und Technik-Hinweise. Die
 * klinische Entscheidung bleibt beim Behandler.
 */

import { computeAlter, computeBMI } from "../data/A00_stammdaten.js";

function has(arr, val) {
  return Array.isArray(arr) && arr.includes(val);
}

function stufeAmpel(stufe) {
  return stufe === "hoch" || stufe === "sehr_hoch" ? "rot" : stufe === "moderat" ? "gelb" : "gruen";
}

export function computeRisikoprofil(answers) {
  const a = answers || {};
  const alter = computeAlter(a["SD-003"]);
  const sex = a["SD-004"]; // "m" | "f"
  const bmi = computeBMI(a["SD-007"], a["SD-008"]);
  const dx = a["PMH-001"] || [];

  // ── Einzel-Fakten (aus vorhandenen Antworten) ──────────────
  const osteoporose = has(dx, "osteoporose");
  const rheuma = has(dx, "rheuma");
  const diabetes = has(dx, "diabetes");
  // Hypertonie: bekannte Diagnose ODER gemessener Blutdruck (Vitalparameter).
  const bpSys = Number(a["VP-001"]);
  const bpDia = Number(a["VP-002"]);
  const bpHoch = (Number.isFinite(bpSys) && bpSys >= 140) || (Number.isFinite(bpDia) && bpDia >= 90);
  const hypertonie = has(dx, "bluthochdruck") || bpHoch;
  const herz = has(dx, "herzerkrankung") || a["KAR-005"] === true;
  const gefaess = has(dx, "gefaesserkrankung");
  const krebs = has(dx, "krebs");
  const kortison = a["PMH-010"] === true;
  const blutverduenner = a["PMH-009"] === true;
  const bindegewebe = a["PMH-010b"] === "bindegewebe";
  const hypermobil = a["PMH-010b"] === "hypermobil";
  const rauchtAktiv = a["PMH-015"] === "regelmaessig" || a["PMH-015"] === "gelegentlich";
  const alkoholViel = a["PMH-016"] === "viel";
  const famHerzFrueh = has(a["PMH-014"], "herzerkrankung_fam");
  const famSchlaganfall = has(a["PMH-014"], "schlaganfall_fam");
  const famOsteoporose = has(a["PMH-014"], "osteoporose_fam");

  // Zervikale Warnzeichen (über alle Beschwerden hinweg, namespaced ODER global)
  const anyTrue = (suffix) => Object.entries(a).some(([k, v]) => k.endsWith(suffix) && v === true);
  const hwsTrauma = anyTrue("HWS-004");
  const schwindelKopfdrehung = anyTrue("HWS-005");
  const doppelbilderSchluck = anyTrue("HWS-D-002");
  const donnerschlag = anyTrue("NEU-006");
  const fokalesDefizit = anyTrue("NEU-007");

  // ── RP-002 Kardiovaskulär ──────────────────────────────────
  let cv = 0;
  const cvF = [];
  if (alter != null) {
    if (alter >= 75) { cv += 4; cvF.push("Alter ≥ 75"); }
    else if (alter >= 65) { cv += 3; cvF.push("Alter 65–74"); }
    else if (alter >= 55) { cv += 2; cvF.push("Alter 55–64"); }
    else if (alter >= 45) { cv += 1; cvF.push("Alter 45–54"); }
  }
  if (sex === "m") { cv += 1; cvF.push("männlich"); }
  if (hypertonie) { cv += 2; cvF.push("Hypertonie"); }
  if (rauchtAktiv) { cv += 2; cvF.push("Raucher"); }
  if (diabetes) { cv += 2; cvF.push("Diabetes"); }
  if (herz || gefaess) { cv += 4; cvF.push("bekannte Herz-/Gefäßerkrankung"); }
  if (famHerzFrueh || famSchlaganfall) { cv += 1; cvF.push("familiäre kardiovaskuläre Belastung"); }
  if (bmi && bmi >= 30) { cv += 1; cvF.push("Adipositas (BMI ≥ 30)"); }
  const cvStufe = cv >= 10 ? "sehr_hoch" : cv >= 7 ? "hoch" : cv >= 4 ? "moderat" : "niedrig";
  const kardiovaskulaer = {
    score: cv, stufe: cvStufe, ampel: stufeAmpel(cvStufe), faktoren: cvF,
    label: { niedrig: "Niedriges kardiovaskuläres Risiko", moderat: "Moderates kardiovaskuläres Risiko",
      hoch: "Hohes kardiovaskuläres Risiko", sehr_hoch: "Sehr hohes kardiovaskuläres Risiko" }[cvStufe],
  };

  // ── RP-003 Frakturrisiko ───────────────────────────────────
  let fx = 0;
  const fxF = [];
  if (alter != null && alter >= 75) { fx += 4; fxF.push("Alter ≥ 75"); }
  else if (alter != null && alter >= 65) { fx += 3; fxF.push("Alter ≥ 65"); }
  if (sex === "f") { fx += 1; fxF.push("weiblich"); }
  if (osteoporose) { fx += 4; fxF.push("bekannte Osteoporose"); }
  if (kortison) { fx += 3; fxF.push("Langzeit-Kortison/Steroide"); }
  if (famOsteoporose) { fx += 1; fxF.push("familiäre Osteoporose"); }
  if (bmi && bmi < 19) { fx += 2; fxF.push("Untergewicht (BMI < 19)"); }
  if (rauchtAktiv) { fx += 1; fxF.push("Raucher"); }
  if (alkoholViel) { fx += 1; fxF.push("hoher Alkoholkonsum"); }
  if (rheuma) { fx += 1; fxF.push("rheumatische Erkrankung"); }
  const fxStufe = fx >= 7 ? "hoch" : fx >= 4 ? "moderat" : "niedrig";
  const fraktur = {
    score: fx, stufe: fxStufe, ampel: stufeAmpel(fxStufe), faktoren: fxF,
    label: { niedrig: "Niedriges Frakturrisiko", moderat: "Moderates Frakturrisiko",
      hoch: "Hohes Frakturrisiko — HVLA/Thrust kontraindiziert" }[fxStufe],
    hvla_kontraindiziert: fxStufe === "hoch",
  };

  // ── RP-001 HWS-Manipulationssicherheit (CAD) ───────────────
  const cadAbsolut = [];
  const cadHoch = [];
  const cadModerat = [];
  if (bindegewebe) cadAbsolut.push("Bindegewebserkrankung (Marfan/EDS) — Dissektions- & Instabilitätsrisiko");
  if (fokalesDefizit) cadAbsolut.push("akutes fokales neurologisches Defizit");
  if (donnerschlag) cadAbsolut.push("Donnerschlag-/Vernichtungskopfschmerz");
  if (doppelbilderSchluck) cadAbsolut.push("5D-Zeichen (Doppelbilder/Schluck-/Sprachstörung)");
  if (gefaess) cadHoch.push("bekannte Gefäßerkrankung (Arteriosklerose/Dissektion in Anamnese möglich)");
  if (schwindelKopfdrehung) cadHoch.push("Schwindel bei Kopfdrehung");
  if (hwsTrauma) cadModerat.push("HWS-Trauma in der Vorgeschichte");
  if (hypertonie) cadModerat.push("Hypertonie (Einstellung prüfen)");
  const cadKlasse = cadAbsolut.length ? "absolut" : cadHoch.length ? "hoch" : cadModerat.length ? "moderat" : "niedrig";
  const hws_manipulation = {
    klasse: cadKlasse,
    ampel: cadKlasse === "absolut" || cadKlasse === "hoch" ? "rot" : cadKlasse === "moderat" ? "gelb" : "gruen",
    faktoren: [...cadAbsolut, ...cadHoch, ...cadModerat],
    hvla_erlaubt: cadKlasse === "absolut" || cadKlasse === "hoch" ? false : cadKlasse === "moderat" ? "mit_vorsicht" : true,
    label: {
      absolut: "⛔ HWS-HVLA absolut kontraindiziert",
      hoch: "🔴 HWS-HVLA nicht empfohlen",
      moderat: "🟡 HWS-HVLA nur nach eingehender Beurteilung",
      niedrig: "🟢 keine spezifischen CAD-Warnzeichen aus der Anamnese",
    }[cadKlasse],
  };

  // ── Obere-HWS-Instabilität (Ligg. alaria & transversum) ────
  const instabTrigger = [];
  if (rheuma) instabTrigger.push("rheumatoide Arthritis (atlantoaxiale Instabilität möglich)");
  if (bindegewebe || hypermobil) instabTrigger.push("Bindegewebeschwäche / Hypermobilität");
  if (hwsTrauma) instabTrigger.push("relevantes HWS-Trauma");
  const obere_hws_instabilitaet = {
    verdacht: instabTrigger.length > 0,
    trigger: instabTrigger,
  };

  // ── RP-004 Konstitutionstyp ────────────────────────────────
  let typ = null;
  if (bmi != null) typ = bmi < 20 ? "ektomorph" : bmi >= 30 ? "endomorph" : "mesomorph";
  const konstitution = {
    typ,
    hypermobil: hypermobil || bindegewebe,
    label: { ektomorph: "Ektomorph (schlank, eher hypermobil, niedrigere Knochendichte)",
      mesomorph: "Mesomorph (muskulär, normale Gewebestabilität)",
      endomorph: "Endomorph (kräftig, erhöhtes metabolisches/kardiovaskuläres Risiko)" }[typ] || "nicht bestimmbar (BMI fehlt)",
  };

  // Radikuläre Zeichen (Arm-/Beinausstrahlung) über alle Beschwerden hinweg.
  const radikulaer_arm = anyTrue("HWS-002");
  const radikulaer_bein = anyTrue("LWS-002");

  // ── Empfohlene Tests (nach Disziplin) & Technik-Hinweise ───
  // Jeder Test trägt eine Kategorie: Orthopädisch / Neurologisch /
  // Osteopathisch / Bildgebung / Internistisch.
  const empfohlene_tests = [];
  const technik_hinweise = [];

  if (fraktur.hvla_kontraindiziert || osteoporose || kortison) {
    empfohlene_tests.push({
      anlass: "Erhöhtes Frakturrisiko / Osteoporose",
      tests: [
        { kat: "Bildgebung", text: "Knochendichtemessung (DXA) über Hausarzt veranlassen/prüfen" },
        { kat: "Bildgebung", text: "Vor Wirbelsäulen-Thrust: aktuelle Bildgebung sichten" },
        { kat: "Osteopathisch", text: "Palpatorische Gewebe-/Barrierebeurteilung vor jeder Technik; nur dosierte Kraft" },
      ],
    });
    technik_hinweise.push("Keine HVLA/Thrust an der Wirbelsäule — artikuläre/sanfte Mobilisation, Muskelenergie-Techniken, myofasziale Techniken, dosierte Traktion.");
  }
  if (obere_hws_instabilitaet.verdacht) {
    empfohlene_tests.push({
      anlass: "Verdacht auf obere HWS-Instabilität (Ligg. alaria/transversum)",
      tests: [
        { kat: "Orthopädisch", text: "Sharp-Purser-Test" },
        { kat: "Orthopädisch", text: "Alar-Ligament-Stresstest" },
        { kat: "Orthopädisch", text: "Transversal-Ligament-Test (Aspinall)" },
        { kat: "Neurologisch", text: "Myelopathie-Zeichen prüfen (Hoffmann, Babinski, Gangbild)" },
        { kat: "Bildgebung", text: "ggf. Flexions-/Extensions-Röntgen oder MRT der oberen HWS" },
        { kat: "Osteopathisch", text: "Keine obere-HWS-HVLA; endgradige Rotation meiden" },
      ],
    });
    technik_hinweise.push("Keine obere-HWS-HVLA bis Instabilität ausgeschlossen ist; sanfte Mobilisation nach Befund, Rotation endgradig meiden.");
  }
  if (hws_manipulation.klasse === "absolut" || hws_manipulation.klasse === "hoch") {
    empfohlene_tests.push({
      anlass: "CAD-/vaskuläre Warnzeichen (HWS)",
      tests: [
        { kat: "Neurologisch", text: "Hirnnervenstatus" },
        { kat: "Neurologisch", text: "5D-3N-Screening (Diplopie, Dizziness, Drop attacks, Dysarthrie, Dysphagie …)" },
        { kat: "Internistisch", text: "Blutdruckmessung; bei Positivität umgehende ärztliche/neurologische Abklärung" },
        { kat: "Osteopathisch", text: "Keine zervikale HVLA; sanfte Mobilisation nur nach klinischer Beurteilung" },
      ],
    });
    technik_hinweise.push("Keine zervikale HVLA; sanfte Mobilisation nur nach klinischer Beurteilung.");
  } else if (hws_manipulation.klasse === "moderat") {
    empfohlene_tests.push({
      anlass: "Erhöhte HWS-Vorsicht",
      tests: [
        { kat: "Internistisch", text: "Blutdruck prüfen" },
        { kat: "Neurologisch", text: "5D-Screening" },
        { kat: "Osteopathisch", text: "Prä-manipulatives Positions-/Haltetest (gehaltene Rotation/Extension) vor jeder HWS-Technik" },
      ],
    });
  }
  if (radikulaer_arm || radikulaer_bein) {
    const tests = [
      { kat: "Neurologisch", text: "Dermatom-, Myotom- und Reflexstatus der betroffenen Etage" },
    ];
    if (radikulaer_bein) tests.push({ kat: "Orthopädisch", text: "Lasègue / SLR, ggf. umgekehrter Lasègue (Femoralis-Dehnung)" });
    if (radikulaer_arm) tests.push({ kat: "Orthopädisch", text: "Spurling-Test, ULTT (neurodynamische Tests obere Extremität)" });
    tests.push({ kat: "Osteopathisch", text: "Segmentale Mobilitäts-/Gewebebefundung der zugehörigen Etage" });
    empfohlene_tests.push({ anlass: "Radikuläre/ausstrahlende Symptomatik", tests });
  }
  if (kardiovaskulaer.stufe === "hoch" || kardiovaskulaer.stufe === "sehr_hoch") {
    empfohlene_tests.push({
      anlass: "Hohes kardiovaskuläres Risiko",
      tests: [
        { kat: "Internistisch", text: "Blutdruckmessung" },
        { kat: "Internistisch", text: "Kardiologische Mitbeurteilung empfehlen" },
        { kat: "Osteopathisch", text: "Belastungsintensität anpassen, bei Symptomen sofort stoppen" },
      ],
    });
  }
  if (blutverduenner) {
    technik_hinweise.push("Blutverdünner: keine kräftigen/aggressiven Manipulationen oder tiefen Techniken (Hämatomrisiko); Injektionen nur mit Vorsicht.");
  }
  if (konstitution.typ === "ektomorph" || konstitution.hypermobil) {
    technik_hinweise.push("Hypermobiler/ektomorpher Typ: Stabilisation und Propriozeption vor Mobilisation; hypermobile Segmente nicht manipulieren.");
  }
  if (konstitution.typ === "endomorph") {
    technik_hinweise.push("Endomorpher Typ: Kraftdosierung anpassen, metabolische Faktoren mitbehandeln.");
  }

  // ── Gesamt-Ampel & Kontraindikationen ──────────────────────
  const kontraindikationen = [];
  const modifikationen = [];
  if (hws_manipulation.klasse === "absolut" || hws_manipulation.klasse === "hoch") kontraindikationen.push("HWS-HVLA (CAD-Warnzeichen)");
  if (fraktur.hvla_kontraindiziert) kontraindikationen.push("Wirbelsäulen-HVLA (Frakturrisiko)");
  if (obere_hws_instabilitaet.verdacht) kontraindikationen.push("Obere-HWS-HVLA (Instabilitätsverdacht) bis Abklärung");
  if (kardiovaskulaer.stufe === "hoch" || kardiovaskulaer.stufe === "sehr_hoch") modifikationen.push("Ärztliche Mitbehandlung (kardiovaskulär)");
  if (blutverduenner) modifikationen.push("Vorsicht kräftige Techniken (Blutverdünner)");
  if (konstitution.hypermobil) modifikationen.push("Stabilisation statt Mobilisation (Hypermobilität)");
  const ampel = kontraindikationen.length ? "rot" : modifikationen.length > 1 ? "gelb" : "gruen";

  return {
    kardiovaskulaer,
    fraktur,
    hws_manipulation,
    obere_hws_instabilitaet,
    konstitution,
    empfohlene_tests,
    technik_hinweise,
    gesamt: { ampel, kontraindikationen, modifikationen },
  };
}
