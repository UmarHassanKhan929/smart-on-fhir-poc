import { FHIR_BASE_URL } from "../config";

// FHIR data access with a Bearer access token.
export async function fetchPatient(patientId: string, accessToken: string): Promise<any> {
  const res = await fetch(`${FHIR_BASE_URL}/fhir/Patient/${patientId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json();
}

export async function fetchObservations(patientId: string, accessToken: string): Promise<any> {
  const res = await fetch(`${FHIR_BASE_URL}/fhir/Observation?patient=${patientId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json();
}
