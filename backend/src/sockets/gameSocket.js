import Number from "../models/Number.js";
import GameSession from "../models/GameSession.js";
import Card from "../models/Card.js";
import User from "../models/User.js";
import { shuffleArray } from "../utils/game/game.js";

const gameSocket = (io, socket) => {
  console.log("[SOCKET] Client connected:", socket.id);

  /** ---------------------------
   * Handle game start
   * --------------------------- */
  socket.on("game_start", async ({ userId }) => {
    if (!userId) return console.error("[SERVER] No userId provided for game_start");

    try {
      // Fetch all numbers
      let numbers = await Number.find({}).lean();
      console.log("[SERVER] Numbers fetched:", numbers.length);

      // Create default numbers if none exist
      if (numbers.length === 0) {
        const letters = ["B", "I", "N", "G", "O"];
        numbers = Array.from({ length: 75 }, (_, i) => {
          const number = i + 1;
          const letter = letters[Math.floor((number - 1) / 15)]; // B=1-15, I=16-30, ...
          const voice = `voice${number}.mp3`; // placeholder voice path
          return { number, letter, voice };
        });
        await Number.insertMany(numbers);
        console.log("[SERVER] Default numbers created");
      }

      // Shuffle numbers
      const shuffledNumbers = shuffleArray(numbers);

      // Save shuffled numbers
      await Number.deleteMany({});
      await Number.insertMany(shuffledNumbers);
      console.log("[SERVER] Numbers shuffled and saved");

      // Get list of unique players who reserved cards
      const playerIds = await Card.distinct("reservedBy", { reserved: true });

      // Create new game session
      const gameSession = new GameSession({
        startTime: new Date(),
        players: playerIds,
      });
      await gameSession.save();
      console.log("[SERVER] Game session created with ID:", gameSession._id);

      // Broadcast to all clients
      io.emit("numbers", shuffledNumbers);
      io.emit("gameSession", gameSession);

      console.log("[SERVER] Numbers and gameSession broadcasted");
    } catch (err) {
      console.error("[SERVER] Error in game_start:", err);
    }
  });

  /** ---------------------------
   * Handle game reset
   * --------------------------- */
  socket.on("game_reset", async ({ userId, gameSessionData }) => {
    if (!userId || !gameSessionData?._id)
      return console.error("[SERVER] Missing reset info");

    try {
      // Reset game session
      const updatedGameSession = await GameSession.findByIdAndUpdate(
        gameSessionData._id,
        { ...gameSessionData, winner: null, endTime: new Date() },
        { new: true }
      );
      if (!updatedGameSession) return;

      // Clear reserved cards
      await Card.updateMany(
        { reserved: true },
        { $set: { reserved: false, reservedBy: null } }
      );

      // Get the winner name safely
      const winnerUser = await User.findById(userId).select("name").lean();
      const winnerName = winnerUser?.name || null;

      // Broadcast reset events
      io.emit("winner", winnerName);
      io.emit("game_reset_done");
      console.log("[SERVER] Game reset done and broadcasted");
    } catch (err) {
      console.error("[SERVER] Error in game_reset:", err.message);
    }
  });

  /** ---------------------------
   * Handle game session updates
   * --------------------------- */
  socket.on("update_gameSession", async ({ userId, gameSessionData }) => {
    if (!userId || !gameSessionData?._id) return;

    try {
      const updatedGameSession = await GameSession.findByIdAndUpdate(
        gameSessionData._id,
        gameSessionData,
        { new: true }
      );
      if (!updatedGameSession) return;

      io.emit("gameSession", updatedGameSession);
      console.log("[SERVER] Game session updated and broadcasted");
    } catch (err) {
      console.error("[SERVER] Error in update_gameSession:", err.message);
    }
  });

  /** ---------------------------
   * Handle disconnect
   * --------------------------- */
  socket.on("disconnect", () => {
    console.log("[SERVER] Client disconnected:", socket.id);
  });
};

export default gameSocket;
