// utils/bingoUtils.js

// Groups called numbers by Bingo letter
const groupCalledNumbers = (calledNumbers) => {
  const letters = ["B", "I", "N", "G", "O"];
  const grouped = {};

  letters.forEach((letter) => {
    grouped[letter] = calledNumbers
      .filter((c) => c.letter === letter)
      .map((c) => c.number);
  });

  return grouped;
};

// Extracts ONLY the marked values (and the FREE space)
const extractMarkedValues = (markedCard) => {
  const letters = ["B", "I", "N", "G", "O"];
  const grouped = {};

  letters.forEach((letter) => {
    grouped[letter] = markedCard[letter]
      .filter((cell) => cell.marked || cell.isFree) // include FREE
      .map((cell) => (cell.isFree ? "FREE" : cell.value));
  });

  return grouped;
};

// Checks for winning patterns: rows, columns, diagonals
const validateBingoCard = (markedCard) => {
  const letters = ["B", "I", "N", "G", "O"];
  const size = 5;

  // Build true/false grid
  const grid = Array.from({ length: size }, (_, row) =>
    letters.map((letter) => {
      const cell = markedCard[letter][row];
      return cell ? cell.marked || cell.isFree : false;
    })
  );

  // Row match
  for (let r = 0; r < size; r++) {
    if (grid[r].every(Boolean)) return true;
  }

  // Column match
  for (let c = 0; c < size; c++) {
    if (grid.every((row) => row[c])) return true;
  }

  // Main diagonal
  if (grid.every((row, idx) => row[idx])) return true;

  // Anti-diagonal
  if (grid.every((row, idx) => row[size - 1 - idx])) return true;

  return false;
};

// Checks if all MARKED numbers (not the whole card!) are in called numbers
const areMarkedNumbersCalled = (markedValues, calledNumbersGrouped) => {
  const letters = ["B", "I", "N", "G", "O"];

  return letters.every((letter) =>
    markedValues[letter].every((num) => {
      if (num === "FREE") return true; // Free is always valid
      return calledNumbersGrouped[letter].includes(num);
    })
  );
};

// Export all functions
export {
  groupCalledNumbers,
  extractMarkedValues,
  validateBingoCard,
  areMarkedNumbersCalled
};
