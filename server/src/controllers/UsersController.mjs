// controllers/UsersController.mjs
import User from "../models/User.mjs";

class UsersController {
  me = async (_req, res) => {
    try {
      const users = await User.scan().exec();
      if (!users?.length) {
        const seeded = await new User({
          id: "1",
          name: "Pera Perić",
          dateOfBirth: "1998-06-15",
          heightCm: 182,
          weightKg: 82,
          bloodType: "O+",
          membershipPaidAt: "2025-09-01",
          membershipValidDays: 30,
        }).save();
        return res.json(seeded);
      }
      res.json(users[0]);
    } catch (e) {
      console.error("Users.me err:", e);
      res.status(500).json({ error: "Greška pri čitanju korisnika." });
    }
  };

  updateMe = async (req, res) => {
    try {
      const users = await User.scan().exec();
      if (!users?.length) {
        return res.status(404).json({ error: "Korisnik ne postoji." });
      }

      const first = users[0];
      const patch = req.body || {};

      // id izdvoji i ne prosleđuj u update
      const { id, ...rest } = patch;

      const updated = await User.update({ id: first.id }, rest);

      return res.json({
        message: `Korisnik je ažuriran: ${updated.name}`,
        user: updated,
      });
    } catch (e) {
      console.error("Users.updateMe err:", e);
      res.status(500).json({ error: "Greška pri čuvanju profila." });
    }
  };
}

export default UsersController;
