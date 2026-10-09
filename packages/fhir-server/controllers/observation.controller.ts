import type { Request, Response } from "express";
import * as observationService from "../services/observation.service";

// Search observations: GET /fhir/Observation?patient=001
export function searchObservations(req: Request, res: Response) {
  const tok = (req as any).token;
  const patientId = observationService.resolvePatientContext(tok, req.query.patient);
  const observations = observationService.listForPatient(patientId);

  res.json({
    resourceType: "Bundle", type: "searchset", total: observations.length,
    entry: observations.map(o => ({ fullUrl: `urn:uuid:${o.id}`, resource: o })),
  });
}
