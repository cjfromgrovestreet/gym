import Exercise from "../models/Exercise.mjs";
import { v4 as uuid } from "uuid";

class ExercisesController {
  // GET /exercises/all
  all = async (_req, res) => {
    try {
      const exercises = await Exercise.scan().exec();
      res.json({ exercises });
    } catch (e) {
      console.error("Exercises.all err:", e);
      res.status(500).json({ error: "Greška pri čitanju vežbi." });
    }
  };

  // POST /exercises/create
  create = async (req, res) => {
    try {
      const { name, type, muscleGroup } = req.body || {};
      if (!name?.trim()) return res.status(400).json({ error: "Naziv je obavezan." });

      const ex = new Exercise({
        id: uuid(),
        name: name.trim(),
        type: type || "Snaga",
        muscleGroup: muscleGroup || ""
      });
      await ex.save();
      res.status(201).json(ex);
    } catch (e) {
      console.error("Exercises.create err:", e);
      res.status(500).json({ error: "Greška pri kreiranju vežbe." });
    }
  };

  // POST /exercises/delete
  delete = async (req, res) => {
    try {
      const id = req.body?.id;
      if (!id) return res.status(400).json({ error: "id je obavezan." });
      await Exercise.delete(id);
      res.json({ ok: true });
    } catch (e) {
      console.error("Exercises.delete err:", e);
      res.status(500).json({ error: "Greška pri brisanju vežbe." });
    }
  };
}
export default ExercisesController;