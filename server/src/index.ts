import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/* ROUTE IMPORTS */
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";


import moleculesBankRoutes from "./routes/moleculesBankRoutes";
import moleculeRoutes from "./routes/moleculeRoutes";
import generatedMoleculesRoutes from  "./routes/generatedMoleculesRoutes";


import drugRoutes from "./routes/drugRoutes";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());

/* MIDDLEWARES */
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search",searchRoutes);
app.use("/users" , userRoutes);
app.use("/teams", teamRoutes);

/* MOLECULE  ROUTES */
app.use("/moleculesbank", moleculesBankRoutes);
app.use("/molecules", moleculeRoutes);
app.use("/api/molecules", generatedMoleculesRoutes);

/* SMILES DRUG GENERATION */
app.use("/api/drugs", drugRoutes)


/* SERVER */
const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on part ${port}`);
});