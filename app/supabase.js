/**
 * LINDEBERGS OS — Supabase-Client
 *
 * Verbindung zur Cloud (Projekt "Lindebergs Anamnese Database", EU-Region
 * eu-west-1). Der Publishable Key ist bewusst öffentlich — Sicherheit
 * entsteht serverseitig durch Row Level Security (jeder Benutzer sieht
 * ausschließlich seine eigenen Zeilen; siehe Supabase-Migrationen).
 *
 * Die Bibliothek wird als ES-Modul vom CDN geladen (die App hat bewusst
 * keinen Build-Schritt). Bei einer späteren Next.js-Migration wird daraus
 * ein normaler npm-Import.
 */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

export const SUPABASE_URL = "https://fexkmpamofjmiysivzzy.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_cAgmd30YCOTnkZcBVi9CKQ_fng4cAmf";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // nötig für Passwort-Zurücksetzen-Links
  },
});

/** Aktuelle Session (oder null). */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session || null;
}
