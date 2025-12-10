import Number from "../models/Number.js";
import GameSession from "../models/GameSession.js";
import Card from "../models/Card.js";
import getPlayerIds from "../utils/game/game.js";

const gameSocket = (io, socket) => {
  console.log("[SOCKET] Client connected:", socket.id);

  /** ---------------------------
   * Handle game start
   * --------------------------- */
  socket.on("game_start", async () => {
    console.log("[SOCKET] game_start received:", socket.id);

    try {
      // Fetch all numbers from DB
      const numbers = await Number.find({}).lean();
      console.log("[SERVER] Fetched numbers from DB:", numbers.length);

      // Emit numbers to this client
      socket.emit("numbers", numbers);

      // Get all player IDs who reserved cards
      const playerIds = await getPlayerIds();

      // Create a new game session
      const gameSession = new GameSession({
        startTime: new Date(),
        players: playerIds
      });

      // Emit gameSession to current user if they are in playerIds
      if (playerIds.includes(socket.auth.userId)) {
        socket.emit("gameSession", gameSession);
      }

      // Shuffle numbers
      
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      const shuffledNumbers = shuffleArray(numbers);

      // Save shuffled numbers to DB

      await Number.deleteMany({});
      await Number.insertMany(shuffledNumbers);
      console.log("[SERVER] Shuffled numbers saved to DB");

    } catch (err) {
      console.error("[SERVER] Error in game_start:", err);
    }
  });

  /** ---------------------------
   * Handle game reset / winner update
   * --------------------------- **/

  socket.on("game_reset", async (gameSessionData) => {
    try {
      // Find and update the game session
      const updatedGameSession = await GameSession.findByIdAndUpdate(
        gameSessionData._id,
        gameSessionData,
        { new: true } // return the updated document
      ).populate("winner", "name"); // populate winner's name

      if (!updatedGameSession) return;

      // Emit winner to the current user if they are a player
      if (updatedGameSession.players.includes(socket.auth.userId)) {
        socket.emit("winner", updatedGameSession.winner);
      }

    } catch (error) {
      console.error("[SERVER] Error in game_reset:", error.message);
    }
  });

  /** ---------------------------
   * Handle client disconnect
   * --------------------------- */
  socket.on("disconnect", () => {
    console.log("[SERVER] Client disconnected:", socket.id);
  });
};

export default gameSocket;
