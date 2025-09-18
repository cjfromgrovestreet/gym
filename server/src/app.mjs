import "dotenv/config";
import express from "express";
import cors from "cors";


import { bodyParser } from "./middlewares/middlewares.mjs";
import ExerciseRouter from "./routers/exerciseRoutes.mjs";
import WorkoutRouter from "./routers/workoutRoutes.mjs";
import UserRouter from "./routers/userRoutes.mjs";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser);

app.use("/exercises", ExerciseRouter);
app.use("/workouts", WorkoutRouter);
app.use("/users", UserRouter);  

// health
app.get("/health", (_req, res) => res.send({ message: "ok" }));

export default app;