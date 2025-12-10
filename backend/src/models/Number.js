import mongoose from "mongoose";

const { Schema, model } = mongoose;

const numberSchema = new Schema({
  letter: { type: String, required: true },
  number: { type: Number, required: true },
  voice: { type: String, required: true }
});

// Prevent duplicate Bingo numbers
numberSchema.index({ letter: 1, number: 1 }, { unique: true });

export default model("Number", numberSchema);
