import { getObservations, type Observation } from "../db";

// The token's patient claim wins over the ?patient= query string.
export function resolvePatientContext(token: any, queryPatient: unknown): string {
  return String(token.patient ?? queryPatient);
}

export function listForPatient(patientId: string): Observation[] {
  return getObservations(patientId);
}
