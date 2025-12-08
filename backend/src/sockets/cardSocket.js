import Card from "../models/Card.js";

export default function cardSocket(io, socket) {
  console.log("[SERVER] User connected:", socket.id);

  // Helper: log reservation attempts
  const logReservationAttempt = (action, cardId, userId) => {
    console.log(`[SERVER] ${action} attempt: user=${userId || "NOT SET"}, cardId=${cardId}`);
  };

  // 1) Send all cards to a single user
  socket.on("get_all_cards", async () => {
    try {
      const cards = await Card.find({}).lean();
      const cardsJSON = cards.map((card) => ({ ...card, _id: card._id.toString() }));
      socket.emit("all_cards", cardsJSON);
    } catch (error) {
      console.error("[SERVER] Error fetching cards:", error);
      socket.emit("error", { message: "Failed to load cards" });
    }
  });

  // 2) Reserve a card (one per user)
  socket.on("reserve_card", async ({ cardId, userId }) => {
    logReservationAttempt("Reservation", cardId, userId);

    try {
      if (!userId) {
        return socket.emit("reservation_failed", { message: "User not authenticated", cardId });
      }

      // Check if user already has a reserved card
      const alreadyReserved = await Card.findOne({ reservedBy: userId });
      if (alreadyReserved) {
        return socket.emit("reservation_failed", { message: "You can only reserve one card", cardId });
      }

      // Fetch the card to reserve
      const card = await Card.findById(cardId);
      if (!card) return socket.emit("reservation_failed", { message: "Card not found", cardId });
      if (card.reserved) return socket.emit("reservation_failed", { message: "Card already reserved", cardId });

      // Reserve the card
      card.reserved = true;
      card.reservedBy = userId;
      await card.save();

      const updatedCard = { ...card.toObject(), _id: card._id.toString() };

      console.log(`[SERVER] Card reserved successfully: cardId=${cardId} by user=${userId}`);

      // Broadcast updated card to all clients
      io.emit("card_reserved", updatedCard);

      // Broadcast updated counts to all clients
      const totalCards = await Card.countDocuments();
      const reservedCount = await Card.countDocuments({ reserved: true });
      io.emit("reserved_count", { totalCards, reservedCount });

    } catch (error) {
      console.error("[SERVER] Error reserving card:", error);
      socket.emit("error", { message: "Failed to reserve card" });
    }
  });

  // 3) Get reserved card count
  socket.on("get_reserved_count", async () => {
    try {
      const totalCards = await Card.countDocuments();
      const reservedCount = await Card.countDocuments({ reserved: true });
      socket.emit("reserved_count", { totalCards, reservedCount });
    } catch (error) {
      console.error("[SERVER] Error getting reserved card count:", error);
      socket.emit("error", { message: "Failed to get reserved card count" });
    }
  });

  // 4) Disconnect
  socket.on("disconnect", () => {
    console.log("[SERVER] User disconnected:", socket.id);
  });
}
