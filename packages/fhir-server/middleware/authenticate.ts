import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { operationOutcome } from "../utils/operationOutcome";

// Protects every /fhir route with a Bearer token. Verifies the JWT signature
// and attaches the decoded claims (sub, patient, scope) to the request.
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json(operationOutcome("login", "Missing token"));
  }
  try {
    (req as any).token = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json(operationOutcome("security", "Invalid token"));
  }
}
