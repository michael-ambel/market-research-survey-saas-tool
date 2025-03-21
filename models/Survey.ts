import { Schema, model, models } from "mongoose";

const SurveySchema = new Schema({
  title: { type: String, required: true },
  questions: [{ type: String }],
  responses: [{ type: Schema.Types.ObjectId, ref: "Response" }],
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Survey || model("Survey", SurveySchema);
