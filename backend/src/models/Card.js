import mongoose from "mongoose";

const bingoCardSchema = new mongoose.Schema({
  numbers: {
    type: [[Number]], // 2D array (5x5 bingo numbers)
    required: true,
  },
  reserved: {
    type: Boolean,
    default: false, // initially not reserved
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // references the User who reserved
    default: null,
  },
});
let Card =  mongoose.model("Card", bingoCardSchema);
export default Card;