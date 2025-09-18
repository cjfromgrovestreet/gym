import dynamoose from "../config/dbconfig.mjs";

const local = process.env.LOCAL;
const config = { create: Boolean(local), waitForActive: Boolean(local) };

const ExerciseSchema = new dynamoose.Schema({
  id: String,
  name: String,
  type: String, // "Snaga" | "Kardio"
  muscleGroup: String, // npr. "Noge"
  createdAt: { type: Date, default: Date.now },
});

const Exercise = dynamoose.model("Exercise", ExerciseSchema, config);
export default Exercise;
