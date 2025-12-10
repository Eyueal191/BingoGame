import Card from "../models/Card.js";

export default function cardSocket(io, socket) {
  console.log("[SERVER] User connected:", socket.id);

  const logAction = (action, cardId, userId) => {
    console.log(`[SERVER] ${action} attempt: user=${userId || "NOT SET"}, cardId=${cardId}`);
  };

  // 1️⃣ Send all cards
  socket.on("get_all_cards", async () => {
    try {
      const cards = await Card.find({}).lean();
      const cardsJSON = cards.map((card) => ({
        ...card,
        _id: card._id.toString(),
      }));
      socket.emit("all_cards", cardsJSON);
    } catch (error) {
      console.error("[SERVER] Error fetching cards:", error);
      socket.emit("error", { message: "Failed to load cards" });
    }
  });

  // 2️⃣ Reserve a card
  socket.on("reserve_card", async ({ cardId, userId }) => {
    logAction("Reservation", cardId, userId);

    try {
      if (!userId) return socket.emit("reservation_failed", { message: "User not authenticated", cardId });

      const alreadyReserved = await Card.findOne({ reservedBy: userId });
      if (alreadyReserved)
        return socket.emit("reservation_failed", { message: "You can only reserve one card", cardId });

      const card = await Card.findById(cardId);
      if (!card) return socket.emit("reservation_failed", { message: "Card not found", cardId });
      if (card.reserved) return socket.emit("reservation_failed", { message: "Card already reserved", cardId });

      card.reserved = true;
      card.reservedBy = userId;
      await card.save();

      const updatedCard = { ...card.toObject(), _id: card._id.toString() };

      console.log(`[SERVER] Card reserved successfully: cardId=${cardId} by user=${userId}`);
      io.emit("card_reserved", updatedCard);

      const reservedCount = await Card.countDocuments({ reserved: true });
      io.emit("reserved_count", { reservedCount });
    } catch (error) {
      console.error("[SERVER] Error reserving card:", error);
      socket.emit("error", { message: "Failed to reserve card" });
    }
  });

  // 3️⃣ Unreserve a card
  socket.on("unreserve_card", async ({ cardId, userId }) => {
    logAction("Unreservation", cardId, userId);

    try {
      if (!userId) return socket.emit("unreserve_failed", { message: "User not authenticated", cardId });

      const card = await Card.findById(cardId);
      if (!card) return socket.emit("unreserve_failed", { message: "Card not found", cardId });

      if (card.reservedBy?.toString() !== userId.toString())
        return socket.emit("unreserve_failed", { message: "You did not reserve this card", cardId });

      card.reserved = false;
      card.reservedBy = null;
      await card.save();

      const updatedCard = { ...card.toObject(), _id: card._id.toString() };
      console.log(`[SERVER] Card unreserved successfully: cardId=${cardId} by user=${userId}`);

      io.emit("card_reserved", updatedCard); // Same event so frontend auto-updates

      const reservedCount = await Card.countDocuments({ reserved: true });
      io.emit("reserved_count", { reservedCount });
    } catch (error) {
      console.error("[SERVER] Error unreserving card:", error);
      socket.emit("error", { message: "Failed to unreserve card" });
    }
  });

  // 4️⃣ Get reserved card count
  socket.on("get_reserved_count", async () => {
    try {
      const reservedCount = await Card.countDocuments({ reserved: true });
      socket.emit("reserved_count", { reservedCount });
    } catch (error) {
      console.error("[SERVER] Error getting reserved count:", error);
      socket.emit("error", { message: "Failed to get reserved card count" });
    }
  });

  // 5️⃣ Reset all reservations
  socket.on("reset_reservation", async () => {
    try {
      const result = await Card.updateMany({ reserved: true }, { $set: { reserved: false, reservedBy: null } });
      console.log(`[SERVER] Reset reservations: ${result.modifiedCount} cards unlocked`);

      const cards = await Card.find({}).lean();
      const cardsJSON = cards.map((card) => ({
        ...card,
        _id: card._id.toString(),
      }));

      io.emit("all_cards", cardsJSON);

      const reservedCount = await Card.countDocuments({ reserved: true });
      io.emit("reserved_count", { reservedCount });

      socket.emit("reseted"); // frontend store listens for this
    } catch (error) {
      console.error("[SERVER] Error resetting reservations:", error);
      socket.emit("error", { message: "Failed to reset reservations" });
    }
  });

  // 6️⃣ Disconnect
  socket.on("disconnect", () => {
    console.log("[SERVER] User disconnected:", socket.id);
  });
}
