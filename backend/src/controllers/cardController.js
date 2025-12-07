import BingoCard from "../models/BingoCard.js";
// getCards.
export const getCards = async (req, res) => {
  try {
    const cards = await BingoCard.find({});
    return res.json({ success: true, cards });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// reserveCard.
export const reserveCard = async (req, res) => {
  try {
    const cardId = req.params.id;
    const userId = req.user._id;

    const card = await BingoCard.findById(cardId);
    if (!card) return res.status(404).json({ success: false, message: "Card not found" });

    if (card.reserved)
      return res.status(400).json({ success: false, message: "Card already reserved" });

    // Reserve card
    card.reserved = true;
    card.reservedBy = userId;
    await card.save();
    // Emit socket event
    req.io.emit("card_reserved", { cardId, reservedBy: userId });
    return res.json({ success: true, card });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
