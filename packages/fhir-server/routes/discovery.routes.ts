import { Router } from "express";
import { getSmartConfiguration } from "../controllers/discovery.controller";

// Public (no Bearer token): SMART discovery document
export const discoveryRouter: Router = Router();

discoveryRouter.get("/.well-known/smart-configuration", getSmartConfiguration);
