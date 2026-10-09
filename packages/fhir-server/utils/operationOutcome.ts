// FHIR error responses are always OperationOutcome resources.
export function operationOutcome(code: string, diagnostics: string) {
  return {
    resourceType: "OperationOutcome",
    issue: [{ severity: "error", code, diagnostics }],
  };
}
