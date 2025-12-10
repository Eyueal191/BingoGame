/*marked = {
  B: [
    { value: 5, row: 0, col: 0, marked: false },
    { value: 10, row: 1, col: 0, marked: true },
    ...
  ],
  I: [...],
  N: [
    { value: 31, row: 0, col: 2, marked: false },
    { value: 40, row: 1, col: 2, marked: false },
    { value: "FREE", row: 2, col: 2, marked: true }, // center FREE
    ...
  ],
  G: [...],
  O: [...],
};
calledNumbers = [
  { letter: "B", number: 5 },
  { letter: "I", number: 16 },
  { letter: "G", number: 45 },
   {letter:"B", number:6}
]; ---> 
const groupCalledNumbers = (calledNumbers)=>{
const calledBs = calledNumbers
    .filter(c => c.letter === "B")  // keep only B
    .map(c => c.number);
const calledIs = calledNumbers
    .filter(c => c.letter === "I")  // keep only B
    .map(c => c.number);
    }
 const calledGs = calledNumbers
    .filter(c => c.letter === "G")  // keep only B
    .map(c => c.number);   

  const calledNs = calledNumbers
    .filter(c => c.letter === "N")  // keep only B
    .map(c => c.number);                   
    const calledOs = calledNumbers
    .filter(c => c.letter === "O")  // keep only B
    .map(c => c.number);
    return {B:calledBS, I:calledIs, N:calledNs, G:calledGs, O:calledOs}
    }
*/