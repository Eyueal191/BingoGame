import mongoose from "mongoose";
import Number from "../models/Number.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();
// Base URL for GitHub Pages or local testing
const BASE_URL = "https://eyueal191.github.io/BingoGame/backend/src/public/dVoice/";
// const BASE_URL = "http://localhost:5000/public/dVoice/"; // for local testing

// Helper function to generate number ranges for each letter
const generateNumbers = (letter, start, end, prefix) => {
  const arr = [];
  for (let i = start; i <= end; i++) {
    const fileName = `${prefix}${i}.mp3`;
    arr.push({
      letter,
      number: i,
      voiceUrl: `${BASE_URL}${fileName}`,
    });
  }
  return arr;
};

// Seed array combining B, I, N, G, O
const numbersSeed = [
  ...generateNumbers("B", 1, 15, "db"),
  ...generateNumbers("I", 16, 30, "di"),
  ...generateNumbers("N", 31, 45, "dn"),
  ...generateNumbers("G", 46, 60, "dg"),
  ...generateNumbers("O", 61, 75, "do"),
];

const seedDB = async () => {
  try {
    // Connect to MongoDB using your modular connectDB
    await connectDB();

    console.log("Connected to MongoDB");

    // Clear old Number data
    await Number.deleteMany({});
    console.log("Old Number collection cleared");

    // Insert new seed data
    await Number.insertMany(numbersSeed);
    console.log("Number collection seeded successfully!");

    // Disconnect
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (err) {
    console.error("Error seeding Number collection:", err);
  }
};

// Run the seed script
seedDB();
