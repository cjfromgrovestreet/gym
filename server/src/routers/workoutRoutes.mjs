import { Router } from "express";
import WorkoutsController from "../controllers/WorkoutsController.mjs";

const router = Router();
const c = new WorkoutsController();

router.get("/all", c.list.bind(c));            
router.post("/create", c.create.bind(c));
router.post("/delete", c.delete.bind(c));

export default router;