import { getPatient, type Patient } from "../db";

export function getPatientById(id: string): Patient | undefined {
  return getPatient(id);
}
