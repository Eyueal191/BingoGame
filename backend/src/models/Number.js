import mongoose from "mongoose";

const { Schema, model } = mongoose;

const numberSchema = new Schema({
  letter: { type: String, required: true },
  number: { type: Number, required: true },
  voiceUrl: { type: String, required: true }
});

export default model("Number", numberSchema);
