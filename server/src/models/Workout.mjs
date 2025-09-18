import dynamoose from "../config/dbconfig.mjs";

const local = process.env.LOCAL;
const config = { create: Boolean(local), waitForActive: Boolean(local) };

const WorkoutSchema = new dynamoose.Schema({
  id: String,
  date: String, // "YYYY-MM-DD"
  title: String,
  notes: String,
  items: {
    type: Array,
    schema: [{
      type: Object,
      schema: {
        exerciseId: String,
        notes: String,
        sets: {
          type: Array,
          schema: [{
            type: Object,
            schema: {
              reps: Number,
              weight: Number,
              timeSec: Number,
              distanceM: Number
            }
          }]
        }
      }
    }]
  },
  createdAt: { type: Date, default: Date.now }
});

const Workout = dynamoose.model("Workout", WorkoutSchema, config);
export default Workout;