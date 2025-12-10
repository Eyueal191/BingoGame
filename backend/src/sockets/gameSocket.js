import Number from "../models/Number.js";

const gameSocket = (io, socket) => {
  console.log("A new client connected to the game-socket-module:", socket.id);

  // Listen for game start
  socket.on("game_start", async () => {
    console.log("game_start received from the client:", socket.id);

    try {
      // Fetch all numbers from the database
      const numbers = await Number.find({}).lean();
      console.log("SERVER fetched numbers from DB:", numbers.length);

      // Send numbers back to this client
      socket.emit("numbers", numbers);

      // Shuffle an array
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      // Shuffle numbers and save to DB
      const shuffledNumbers = shuffleArray(numbers);
      await Number.deleteMany({}); // Clean up existing numbers in DB
      await Number.insertMany(shuffledNumbers); // Insert shuffled numbers

      console.log("SERVER shuffled numbers and saved to DB");
    } catch (err) {
      console.error("[SERVER] Error fetching numbers:", err);
    }
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("[SERVER] Client disconnected:", socket.id);
  });
};
export default gameSocket;
