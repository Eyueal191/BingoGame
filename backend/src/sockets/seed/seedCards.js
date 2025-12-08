import connectDB from "../config/db.js";
import dotenv from "dotenv";
import Card from "../models/Card.js"; // adjust path if needed

dotenv.config();
connectDB()

// Helper to generate a single 5x5 Bingo card
function generateBingoCard() {
  const card = [];

  for (let row = 0; row < 5; row++) {
    const newRow = [];
    while (newRow.length < 5) {
      const num = Math.floor(Math.random() * 75) + 1; // numbers 1-75
      if (!newRow.includes(num)) newRow.push(num);
    }
    card.push(newRow);
  }

  // Optional: center free space
  card[2][2] = 0;

  return card;
}

// Seed 20 Bingo cards
async function seedCards() {
  try {
    await Card.deleteMany(); // clear existing cards
    console.log("🗑️ Existing cards cleared");

    const cards = [];
    for (let i = 0; i < 20; i++) {
      cards.push({
        numbers: generateBingoCard(),
        reserved: false,
        reservedBy: null,
      });
    }

    await Card.insertMany(cards);
    console.log("✅ 20 Bingo cards inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding cards:", error);
    process.exit(1);
  }
}

seedCards();
