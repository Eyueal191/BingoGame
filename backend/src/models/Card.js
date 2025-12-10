import mongoose from "mongoose";

const bingoCardSchema = new mongoose.Schema({
  numbers: {
    type: Object,
    default: { B: [], I: [], N: [], G: [], O: [] }, // default empty columns
  },
  reserved: {
    type: Boolean,
    default: false, // initially not reserved
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  number: {
    type: Number,
    enum: Array.from({ length: 20 }, (_, i) => i + 1), // 1 to 20
    required: true,
  },
});

const Card = mongoose.model("Card", bingoCardSchema);
export default Card;
