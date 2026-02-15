/**
 * Script pour créer les comptes membres depuis le CSV.
 * Les comptes sont créés avec un mot de passe temporaire.
 * Les membres doivent aller sur la page de login → "Mot de passe oublié" pour définir leur mot de passe.
 *
 * Prérequis :
 * - NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local
 * - SUPABASE_SERVICE_ROLE_KEY = clé "service_role" (Supabase → Settings → API)
 *
 * Usage : node scripts/create-members-from-csv.mjs <chemin-vers-fichier.csv>
 * Exemple : node scripts/create-members-from-csv.mjs "C:\Users\Admin\Downloads\membres.csv"
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Charger .env.local si présent
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const env = readFileSync(envPath, "utf-8");
  env.split("\n").forEach((line) => {
    const eq = line.indexOf("=");
    if (eq > 0 && !line.trim().startsWith("#")) {
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key]) process.env[key] = val;
    }
  });
} catch (_) {}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Variables manquantes : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY");
  console.error("   Ajoutez SUPABASE_SERVICE_ROLE_KEY dans .env.local (clé service_role, pas anon)");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

/** Parse une ligne CSV avec champs entre guillemets */
function parseCSVLine(line) {
  const matches = line.match(/("([^"]*)"|([^,]*))/g);
  if (!matches) return [];
  return matches.map((m) => m.replace(/^"|"$/g, "").trim());
}

/** Lit et parse le CSV */
function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || "";
    });
    rows.push(row);
  }
  return rows;
}

async function main() {
  const csvPath = process.argv[2] || join(__dirname, "..", "membres.csv");
  let content;
  try {
    content = readFileSync(csvPath, "utf-8");
  } catch (e) {
    console.error("❌ Fichier introuvable :", csvPath);
    console.error("   Usage : node scripts/create-members-from-csv.mjs <chemin.csv>");
    process.exit(1);
  }

  const rows = parseCSV(content);
  const members = rows
    .filter((r) => r.Email && r.Email.includes("@"))
    .map((r) => ({
      email: r.Email.trim().toLowerCase(),
      full_name: [r["Prénom"], r["Nom de famille"]].filter(Boolean).join(" ").trim() || null,
    }));

  console.log(`📋 ${members.length} membres à traiter\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  const TEMP_PASSWORD = "ThumbnailPro2024!ChgMdp";

  for (const m of members) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: m.email,
        password: TEMP_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: m.full_name || undefined },
      });

      if (error) {
        if (error.message?.includes("already been registered") || error.message?.includes("already exists")) {
          console.log(`⏭️  ${m.email} — déjà inscrit`);
          skipped++;
        } else {
          console.error(`❌ ${m.email} — ${error.message}`);
          errors++;
        }
      } else {
        console.log(`✅ ${m.email} (${m.full_name || "-"}) — créé`);
        created++;
      }
    } catch (e) {
      console.error(`❌ ${m.email} — ${e.message}`);
      errors++;
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n📊 Résumé : ${created} créés, ${skipped} déjà inscrits, ${errors} erreurs`);
  console.log("\n💡 Les membres doivent aller sur la page de connexion → « Mot de passe oublié » pour définir leur mot de passe.");
}

main().catch(console.error);
