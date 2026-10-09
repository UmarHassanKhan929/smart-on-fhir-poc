import express from "express";
import { PORT } from "./config";
import { discoveryRouter } from "./routes/discovery.routes";
import { fhirRouter } from "./routes/fhir.routes";

const app = express();
app.use(express.json());

app.use(discoveryRouter);
app.use("/fhir", fhirRouter);

app.listen(PORT, () => console.log("🏥 FHIR server on http://localhost:3000"));
