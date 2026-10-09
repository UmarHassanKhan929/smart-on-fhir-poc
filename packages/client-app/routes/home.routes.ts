import { Router } from "express";
import { home } from "../controllers/home.controller";

export const homeRouter: Router = Router();

homeRouter.get("/", home);
