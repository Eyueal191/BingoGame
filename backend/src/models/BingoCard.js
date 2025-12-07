import mongoose from "mongoose";
const bingoCardSchema = new mongoose.Schema({
  numbers: {
    type: [[Number]], // 2D array (5x5)
    required: true,
  },
  reserved: {
    type: Boolean,
    default: false,
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

export default mongoose.model("BingoCard", bingoCardSchema);
