import path from "path";

// FHIR server configuration
export const PORT = 3000;

// SQLite database location (env override for Docker: /data/fhir.db on a volume)
export const DATABASE_PATH = process.env.FHIR_DB_PATH ?? path.join(__dirname, "fhir.db");

// Shared secret between auth server and FHIR server (HS256).
export const JWT_SECRET = "poc-secret-change-me";

export const AUTH_BASE_URL = "http://localhost:4000";

export const SCOPES = {
  patientRead: "patient/Patient.read",
  observationRead: "patient/Observation.read",
} as const;
