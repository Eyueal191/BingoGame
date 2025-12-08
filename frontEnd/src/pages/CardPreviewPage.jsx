import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore.js";
import useCardsStore from "../hooks/useCards.js";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

function CardPreviewPage() {
    const { user } = useAuthStore();
    const { cards, attachListeners, cleanup } = useCardsStore();

    const [loading, setLoading] = useState(true);
    const [userCard, setUserCard] = useState(null);

    // Attach listeners
    useEffect(() => {
        attachListeners();
        return () => cleanup();
    }, [attachListeners, cleanup]);

    // Find user's card
    useEffect(() => {
        if (cards.length > 0 && user) {
            const found = cards.find(
                (c) =>
                    c.reserved === true &&
                    c.reservedBy?.toString() === user._id.toString()
            );
            setUserCard(found || null);
            setLoading(false);
        } else if (!user || cards.length === 0) {
            setLoading(false);
        }
    }, [cards, user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
                Loading card...
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen p-6 md:p-10 text-gray-800 py-20">

            {/* Header */}
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-200 shadow-sm py-12 px-4 mt-10 boder">
                <Home className="w-6 h-6 text-gray-500" />
                <h1 className="text-2xl font-semibold text-green-800">
                    Your Playing Card Preview
                </h1>
            </div>

            {/* If card exists */}
            {userCard ? (
                <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 max-w-xl mx-auto shadow-lg hover:border-green-800">

                    {/* Green Title */}
                 <h2 className="flex items-center text-xl font-bold text-gray-700 mb-6">
    <span>Card's Detail</span>
    <span className="w-25 h-1 bg-green-500 mt-3 ml-2"></span>
</h2>

                    {/* BINGO Header */}
                    <div className="grid grid-cols-5 text-center font-bold text-gray-700 mb-4">
                        {["B", "I", "N", "G", "O"].map((h) => (
                            <div key={h}>{h}</div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-rows-5 gap-2 p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-inner">
                        {userCard.numbers.map((row, rIdx) => (
                            <div key={rIdx} className="grid grid-cols-5 gap-2">
                                {row.map((cell, cIdx) => (
    <div
        key={cIdx}
        className={`
            flex items-center justify-center h-12 rounded-md border 
            text-sm font-medium transition-all duration-200
            hover:shadow-md hover:-translate-y-0.5
            hover:bg-green-100 hover:border-green-400
            active:bg-green-200 active:border-green-500
            ${
                cell === "FREE"
                    ? "bg-green-50 border-green-300 text-green-700 shadow-sm"
                    : "bg-white border-gray-300 text-gray-700 shadow-sm"
            }
        `}
    >
        {cell}
    </div>
))}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between">

                       <Link
    to="/countdown"
    className="mt-7 self-center inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg active:bg-green-800 transition-all duration-200"
>
    Start the Game
</Link><Link
    to="/"
    className="mt-7 self-center inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 transition-all duration-200"
>
    Back
</Link>         </div>
                   

                </div>
            ) : (
                // No card reserved UI
                <div className="max-w-md mx-auto bg-white p-8 border border-red-300 rounded-xl text-center shadow-md shadow-red-100">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">
                        No Card Reserved
                    </h2>
                    <p className="text-gray-600">
                        You do not currently have a reserved card.
                        Please return to the main page to select one.
                    </p>
                </div>
            )}
        </div>
    );
}
export default CardPreviewPage;
