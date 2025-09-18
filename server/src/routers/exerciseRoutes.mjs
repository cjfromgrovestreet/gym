import { Router } from "express";
import ExercisesController from "../controllers/ExercisesController.mjs";

const router = Router();
const c = new ExercisesController();

router.get("/all", c.all.bind(c));
router.post("/create", c.create.bind(c));
router.post("/delete", c.delete.bind(c));

export default router;