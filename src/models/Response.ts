import { Schema, model, models } from "mongoose";

const ResponseSchema = new Schema({
  surveyId: { type: String, required: true },
  answers: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default models.Response || model("Response", ResponseSchema);
