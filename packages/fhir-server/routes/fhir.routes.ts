import { Router } from "express";
import { authenticateToken } from "../middleware/authenticate";
import { requireScope } from "../middleware/authorize";
import { SCOPES } from "../config";
import { getPatient } from "../controllers/patient.controller";
import { searchObservations } from "../controllers/observation.controller";

// Every /fhir route requires a valid Bearer token + the right scope.
export const fhirRouter: Router = Router();

fhirRouter.use(authenticateToken);

fhirRouter.get("/Patient/:id", requireScope(SCOPES.patientRead), getPatient);
fhirRouter.get("/Observation", requireScope(SCOPES.observationRead), searchObservations);
