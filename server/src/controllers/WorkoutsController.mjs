import Workout from "../models/Workout.mjs";
import { v4 as uuid } from "uuid";

class WorkoutsController {
  // GET /workouts/all
  list = async (_req, res) => {
    try {
      const workouts = await Workout.scan().exec();
      // Opcionalno: sort po datumu opadajuće, pa po createdAt
      const sorted = [...workouts].sort((a, b) => {
        if (a.date === b.date) {
          return (new Date(b.createdAt || 0)) - (new Date(a.createdAt || 0));
        }
        return a.date < b.date ? 1 : -1; // noviji datum prvi
      });
      res.json({ workouts: sorted });
    } catch (e) {
      console.error("Workouts list error:", e);
      res.status(500).json({ error: "Greška pri čitanju treninga." });
    }
  };

  // POST /workouts/create
  create = async (req, res) => {
    try {
      const { date, title, notes = "", items = [] } = req.body;

      if (!date || !title) {
        return res.status(400).json({ error: "Nedostaju obavezna polja: date, title." });
      }

      const workout = new Workout({
        id: uuid(),
        // userId je opciono – čuvamo ga samo ako stigne, ali nije neophodan
        userId: req.body.userId || null,
        date,
        title,
        notes,
        items,
      });

      await workout.save();
      res.status(201).json({ message: "Trening sačuvan.", workout });
    } catch (e) {
      console.error("Workouts create error:", e);
      res.status(500).json({ error: "Greška pri kreiranju treninga." });
    }
  };

  // POST /workouts/delete
  delete = async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "Nedostaje id." });

      await Workout.delete(id);
      res.json({ ok: true });
    } catch (e) {
      console.error("Workouts delete error:", e);
      res.status(500).json({ error: "Greška pri brisanju treninga." });
    }
  };
}

export default WorkoutsController;