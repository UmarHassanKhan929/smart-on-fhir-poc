import crypto from "crypto";
import type { Request, Response } from "express";
import { CLIENT } from "../config";
import * as smartService from "../services/smart.service";
import * as fhirService from "../services/fhir.service";

// Discovery: read the SMART config, then redirect to the authorize endpoint.
export async function connect(_req: Request, res: Response) {
  const conf = await smartService.discoverSmartConfiguration();
  console.log("Discovered SMART config:", conf);

  const state = crypto.randomBytes(8).toString("hex"); // CSRF protection
  const url = new URL(conf.authorization_endpoint);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", CLIENT.id);
  url.searchParams.set("redirect_uri", CLIENT.redirectUri);
  url.searchParams.set("scope", CLIENT.scopes);
  url.searchParams.set("state", state);

  res.redirect(url.toString());
}

// Callback: exchange ?code for a token, then fetch the patient's data.
export async function callback(req: Request, res: Response) {
  const { code } = req.query; // TODO: verify state echoes what we sent

  const tokenRes = await smartService.exchangeCodeForToken(String(code));
  if (!tokenRes.access_token) {
    return res.render("token-error", { tokenJson: JSON.stringify(tokenRes, null, 2) });
  }

  // The patient this token is scoped to:
  const patientId = tokenRes.patient;
  const patient = await fhirService.fetchPatient(patientId, tokenRes.access_token);
  const obsBundle = await fhirService.fetchObservations(patientId, tokenRes.access_token);

  const observations = (obsBundle.entry ?? []).map((e: any) => ({
    label: e.resource.code.coding[0].display,
    value: `${e.resource.valueQuantity.value} ${e.resource.valueQuantity.unit}`,
    time: e.resource.effectiveDateTime,
  }));

  res.render("dashboard", {
    patientName: `${patient.name?.[0]?.given?.[0]} ${patient.name?.[0]?.family}`,
    dob: patient.birthDate,
    gender: patient.gender,
    observations,
    tokenJson: JSON.stringify(tokenRes, null, 2),
  });
}
