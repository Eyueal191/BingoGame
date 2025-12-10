import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define all possible winning patterns as arrays of indices
export const WIN_PATTERNS = [
  // Rows
  [[0,0],[0,1],[0,2],[0,3],[0,4]],
  [[1,0],[1,1],[1,2],[1,3],[1,4]],
  [[2,0],[2,1],[2,2],[2,3],[2,4]],
  [[3,0],[3,1],[3,2],[3,3],[3,4]],
  [[4,0],[4,1],[4,2],[4,3],[4,4]],

  // Columns
  [[0,0],[1,0],[2,0],[3,0],[4,0]],
  [[0,1],[1,1],[2,1],[3,1],[4,1]],
  [[0,2],[1,2],[2,2],[3,2],[4,2]],
  [[0,3],[1,3],[2,3],[3,3],[4,3]],
  [[0,4],[1,4],[2,4],[3,4],[4,4]],

  // Diagonals
  [[0,0],[1,1],[2,2],[3,3],[4,4]], // TL to BR
  [[0,4],[1,3],[2,2],[3,1],[4,0]]  // TR to BL
];

const gameSessionSchema = new Schema({
  startTime: { type: Date, required: true }, // required at creation
  endTime: { type: Date, default: null },   // optional, set when game ends

  winner: {
    type: Schema.Types.ObjectId,
    ref: "User",   // or "Player"
    default: null  // null until someone wins
  },

  winnerCard: {
    type: [[Number]], // 2D array representing the winning card
    default: null     // optional until someone wins
  },

  winnerPattern: {
    type: [[Number]],  // optional, set when there is a winning pattern
    default: null
  },

  players: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: true    // must have players at creation
  }
});

export default model("GameSession", gameSessionSchema);
