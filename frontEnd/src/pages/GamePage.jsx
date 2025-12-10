// src/pages/GamePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "../stores/gameStore.js";
import useCardsStore from "../hooks/useCards.js";
import useAuthStore from "../stores/authStore.js";
import Loading from "../components/Loading.jsx";
import { Volume, VolumeOff } from "lucide-react";
import voiceList from "../assets/voiceList.js";
import PlayCard from "../components/PlayCard.jsx";

function GamePage() {
  const navigate = useNavigate();
  const { numbers, attachListeners, detachListeners, startGame } = useGameStore();
  const { cards, attachListeners: attachCardListeners, cleanup, reservedcardCount } = useCardsStore();
  const { user } = useAuthStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [drawnNumber, setDrawnNumber] = useState(null);
  const [userCard, setUserCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [voiceUrl, setVoiceUrl] = useState("");
  const [userMarked, setUserMarked] = useState([]);

  // NAVIGATE TO LOSER PAGE IF RESERVED CARD COUNT IS ZERO
  useEffect(() => {
    if (reservedcardCount === 0) {
      navigate("/loser");
    }
  }, [reservedcardCount, navigate]);

  // INIT GAME
  useEffect(() => {
    attachListeners();
    startGame();
    setGameStarted(true);
    return () => detachListeners();
  }, [attachListeners, detachListeners, startGame]);

  // ATTACH CARD LISTENERS
  useEffect(() => {
    attachCardListeners();
    return () => cleanup();
  }, [attachCardListeners, cleanup]);

  // FIND USER CARD
  useEffect(() => {
    if (cards.length > 0 && user) {
      const found = cards.find(
        (c) => c.reserved && c.reservedBy?.toString() === user._id.toString()
      );
      setUserCard(found);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [cards, user]);

  const handleMark = ({ number, row, col }) => {
    setUserMarked((prev) => {
      const exists = prev.some((n) => n.number === number && n.row === row && n.col === col);
      if (exists) {
        return prev.filter((n) => !(n.number === number && n.row === row && n.col === col));
      } else {
        return [...prev, { number, row, col }];
      }
    });
  };

  const drawNumber = () => {
    if (currentIndex >= numbers.length) return;

    const nextNumber = numbers[currentIndex];
    setDrawnNumber(nextNumber);
    setCalledNumbers((prev) => [...prev, nextNumber]);
    setCurrentIndex((prev) => prev + 1);

    if (soundOn && nextNumber?.number) {
      const audioSrc = voiceList[nextNumber.number];
      if (audioSrc) setVoiceUrl(audioSrc);
    }

    if (userCard?.numbers) {
      Object.values(userCard.numbers).forEach((col, colIdx) => {
        col.forEach((num, rowIdx) => {
          if (num === nextNumber.number) handleMark({ number: num, row: rowIdx, col: colIdx });
        });
      });
    }
  };

  useEffect(() => {
    if (numbers.length > 0) {
      setCurrentIndex(0);
      setCalledNumbers([]);
      setDrawnNumber(null);
      setUserMarked([]);
    }
  }, [numbers]);

  useEffect(() => {
    if (!gameStarted || numbers.length === 0) return;
    const intervalId = setInterval(drawNumber, 5000);
    return () => clearInterval(intervalId);
  }, [numbers, currentIndex, gameStarted, soundOn]);

  if (loading || numbers.length === 0) return <Loading />;

  const groupedCalledNumbers = { B: [], I: [], N: [], G: [], O: [] };
  calledNumbers.forEach(({ letter, number }) => groupedCalledNumbers[letter].push(number));

  const handleToggleSound = () => setSoundOn((prev) => !prev);

  return (
    <div className="px-4 sm:px-6 md:px-10 max-w-7xl mx-auto mt-10 mb-20 mt-30">

      {voiceUrl && soundOn && <audio src={voiceUrl} autoPlay />}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-bold text-2xl text-gray-800">Game Session</h2>

        <div className="flex items-center gap-4">
          <p className="text-gray-600 text-sm flex items-center gap-1">
            <span className="font-medium">⏺ Started:</span>
            {new Date().toLocaleTimeString()}
          </p>

          {/* PLAYER COUNT */}
          <p className="text-gray-600 text-sm flex items-center gap-1">
            <span className="font-medium">Players:</span> {reservedcardCount || 0}
          </p>

          <button
            onClick={handleToggleSound}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm"
          >
            {soundOn ? (
              <Volume className="w-5 h-5 text-blue-600" />
            ) : (
              <VolumeOff className="w-5 h-5 text-red-600" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-8">
          {/* Last Called */}
          <div className="bg-blue-600 text-white rounded-2xl shadow-xl p-8 text-center">
            <h3 className="text-lg font-semibold opacity-80">Last Called</h3>

            <div className={`text-5xl font-extrabold mt-3 ${drawnNumber ? "animate-pulse text-yellow-300 drop-shadow-md" : ""}`}>
              {drawnNumber ? `${drawnNumber.letter}-${drawnNumber.number}` : "—"}
            </div>

            {drawnNumber && (
              <p className="text-sm mt-2 opacity-90">
                Number <span className="font-semibold">{drawnNumber.number}</span> was just called
              </p>
            )}
          </div>

          {/* USER CARD */}
          {userCard ? (
            <PlayCard card={userCard} calledNumbers={calledNumbers} />
          ) : (
            <div className="bg-white border rounded-2xl shadow-xl p-6 text-center">
              <h2 className="text-lg font-semibold mb-4">Your Card</h2>
              <p className="text-gray-500">No card reserved.</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE — CALLED NUMBERS */}
        <div className="bg-white border rounded-2xl shadow-xl p-6 max-h-[700px] overflow-y-auto">
          {/* Header aligned left */}
          <h3 className="text-xl font-semibold mb-6 text-left text-gray-800 tracking-wide">
            Called Numbers
          </h3>

          {/* Letter headers with border */}
          <div className="grid grid-cols-5 text-center font-bold text-gray-700 mb-4 tracking-wider text-lg">
            {["B", "I", "N", "G", "O"].map((l) => (
              <div
                key={l}
                className="uppercase select-none border border-gray-300 rounded-lg py-1 bg-gray-50"
              >
                {l}
              </div>
            ))}
          </div>

          {/* Number tiles */}
          <div className="grid grid-cols-5 gap-3 text-center">
            {["B", "I", "N", "G", "O"].map((l) => (
              <div key={l} className="flex flex-col gap-3">
                {groupedCalledNumbers[l].length === 0 ? (
                  <div className="text-gray-300 italic tracking-wide select-none">-</div>
                ) : (
                  groupedCalledNumbers[l].map((num, idx) => {
                    const isLast = drawnNumber?.letter === l && drawnNumber?.number === num;

                    return (
                      <div
                        key={idx}
                        className={`
                          p-3 border rounded-lg bg-gray-50 shadow-sm text-base font-semibold
                          transition-colors duration-300 cursor-default select-none
                          ${isLast ? "ring-2 ring-blue-500 bg-blue-100" : "hover:bg-blue-50"}
                        `}
                      >
                        {num}
                      </div>
                    );
                  })
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
