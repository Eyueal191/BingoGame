import mongoose from "mongoose";

const { Schema, model } = mongoose;

const gameSessionSchema = new Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  winner: {
    type: Schema.Types.ObjectId,
    ref: "User",   // change to "Player" if needed
    default: null  // null = draw
  }
});

export default model("GameSession", gameSessionSchema);
