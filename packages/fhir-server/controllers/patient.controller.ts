import type { Request, Response } from "express";
import { operationOutcome } from "../utils/operationOutcome";
import * as patientService from "../services/patient.service";

// Read one patient: GET /fhir/Patient/001
export function getPatient(req: Request, res: Response) {
  const tok = (req as any).token; // claims: { sub, patient?, scope }
  const patient = patientService.getPatientById(String(req.params.id));

  // Patient-context check: a patient-scoped token may only touch its own patient.
  if (tok.patient && patient && patient.id !== tok.patient) {
    return res.status(403).json(operationOutcome("forbidden", "Token is scoped to another patient"));
  }
  if (!patient) {
    return res.status(404).json(operationOutcome("not-found", "Patient not found"));
  }
  res.json(patient);
}
