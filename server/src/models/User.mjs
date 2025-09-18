import dynamoose from "../config/dbconfig.mjs";

const local = process.env.LOCAL;
const config = { create: Boolean(local), waitForActive: Boolean(local) };

const UserSchema = new dynamoose.Schema({
  id: String,
  name: String,
  dateOfBirth: String,        // "YYYY-MM-DD"
  heightCm: Number,
  weightKg: Number,
  bloodType: String,          // npr. "O+"
  membershipPaidAt: String,   // "YYYY-MM-DD"
  membershipValidDays: Number,
  createdAt: { type: Date, default: Date.now }
});

const User = dynamoose.model("User", UserSchema, config);
export default User;