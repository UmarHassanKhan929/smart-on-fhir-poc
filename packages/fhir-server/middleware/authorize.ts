import type { NextFunction, Request, Response } from "express";
import { operationOutcome } from "../utils/operationOutcome";

// Require that the token carries the given scope.
export function requireScope(scope: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const tok = (req as any).token; // claims: { sub, patient?, scope }
    if (!tok.scope.includes(scope)) {
      return res.status(403).json(operationOutcome("forbidden", `Missing ${scope} scope`));
    }
    next();
  };
}
