import { Schema, model, models } from "mongoose";

const SurvaySchema = new Schema({
  title: { type: String, required: true },
  questions: [{ type: String }],
  response: [{ type: Schema.Types.ObjectId, ref: "Response" }],
  createdAt: { type: Date, default: Date.now },
});

export default models.Survey || model("Survay", SurvaySchema);
