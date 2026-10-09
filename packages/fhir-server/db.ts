import { DatabaseSync } from "node:sqlite";
import seed from "./seed.json";
import { DATABASE_PATH } from "./config";

export interface Patient {
  resourceType: "Patient";
  id: string;
  name: { family: string; given: string[] }[];
  gender: "male" | "female";
  birthDate: string;
}

export interface Observation {
  resourceType: "Observation";
  id: string;
  status: "final";
  code: { coding: { system: string; code: string; display: string }[] };
  subject: { reference: `Patient/${string}` };
  valueQuantity?: { value: number; unit: string };
  effectiveDateTime: string;
}

// SQLite database file. FHIR resources are stored as JSON documents,
// with indexed columns for the search parameters we need.
const db = new DatabaseSync(DATABASE_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id       TEXT PRIMARY KEY,
    resource TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS observations (
    id         TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    resource   TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_observations_patient ON observations (patient_id);
`);

// Seed from seed.json — idempotent, only fills what's missing.
const insertPatient = db.prepare(
  "INSERT OR IGNORE INTO patients (id, resource) VALUES (?, ?)"
);
const insertObservation = db.prepare(
  "INSERT OR IGNORE INTO observations (id, patient_id, resource) VALUES (?, ?, ?)"
);

for (const p of seed.patients as Patient[]) {
  insertPatient.run(p.id, JSON.stringify(p));
}
for (const o of seed.observations as Observation[]) {
  const patientId = o.subject.reference.replace("Patient/", "");
  insertObservation.run(o.id, patientId, JSON.stringify(o));
}

export function getPatient(id: string): Patient | undefined {
  const row = db.prepare("SELECT resource FROM patients WHERE id = ?").get(id) as
    | { resource: string }
    | undefined;
  return row ? (JSON.parse(row.resource) as Patient) : undefined;
}

export function getObservations(patientId: string): Observation[] {
  const rows = db
    .prepare("SELECT resource FROM observations WHERE patient_id = ? ORDER BY id")
    .all(patientId) as { resource: string }[];
  return rows.map((r) => JSON.parse(r.resource) as Observation);
}
