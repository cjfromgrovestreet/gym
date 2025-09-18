import { Router } from "express";
import UsersController from "../controllers/UsersController.mjs";

const router = Router();
const c = new UsersController();

router.get("/me", c.me.bind(c));
router.patch("/me", c.updateMe.bind(c));

export default router;