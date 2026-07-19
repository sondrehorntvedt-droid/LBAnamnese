/**
 * LINDEBERGS OS — Registriert alle Anamnese-Schritte in Reihenfolge.
 *
 * Reihenfolge nach Praxis-Feedback:
 *  Willkommen → Stammdaten (ganz früh) → Anamnese-Tiefe (eigener Schritt) →
 *  Ziele (PROM) → Befunde-Upload → Beschwerde-Loop → Sicherheitsfragen →
 *  Begleitsymptome → Vorgeschichte → Systemanamnese → Vitalmedizin →
 *  Sport → Wohlbefinden → Vitalitätsprofil → Zusammenfassung.
 */
import { registerWelcomeStep } from "./step-welcome.js";
import { registerStammdatenStep } from "./step-stammdaten.js";
import { registerTiefeStep } from "./step-tiefe.js";
import { registerZieleStep } from "./step-ziele.js";
import { registerUploadStep } from "./step-uploads.js";
import { registerBeschwerdeLoopStep } from "./step-beschwerde-loop.js";
import { registerSicherheitsfragenStep } from "./step-sicherheitsfragen.js";
import { registerBegleitsymptomeStep } from "./step-begleitsymptome.js";
import { registerVorgeschichteStep } from "./step-vorgeschichte.js";
import { registerVitalparameterStep } from "./step-vitalparameter.js";
import { registerSystemanamneseStep } from "./step-systemanamnese.js";
import { registerVitalmedizinStep } from "./step-vitalmedizin.js";
import { registerErnaehrungStep } from "./step-ernaehrung.js";
import { registerSportStep } from "./step-sport.js";
import { registerPsychosozialStep } from "./step-psychosozial.js";
import { registerSiebenFaktorenStep } from "./step-sieben-faktoren.js";
import { registerAbschlussStep } from "./step-abschluss.js";
import { registerKontoStep } from "./step-konto.js";

registerWelcomeStep();
registerStammdatenStep();
registerTiefeStep();
registerZieleStep();
registerUploadStep();
registerBeschwerdeLoopStep();
registerSicherheitsfragenStep();
registerBegleitsymptomeStep();
registerVorgeschichteStep();
registerVitalparameterStep();
registerSystemanamneseStep();
registerVitalmedizinStep();
registerErnaehrungStep();
registerSportStep();
registerPsychosozialStep();
// Vitalitätsprofil — leitet sich aus allen vorherigen Antworten ab.
registerSiebenFaktorenStep();
registerAbschlussStep();
// Konto & Cloud-Speicherung — bewusst ganz am Ende der Sidebar.
registerKontoStep();
