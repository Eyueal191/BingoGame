// src/hooks/useCardsStore.js
import cardStore from "../stores/cardsStore.js";

// Custom hook to use the cardsStore
const useCardsStore = () => {
  return cardStore();
};

export default useCardsStore;
