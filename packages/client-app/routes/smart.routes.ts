import { Router } from "express";
import { connect, callback } from "../controllers/smart.controller";

export const smartRouter: Router = Router();

smartRouter.get("/connect", connect);
smartRouter.get("/callback", callback);
