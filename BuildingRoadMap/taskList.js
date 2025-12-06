/*/**
 * BINGO GAME SYSTEM FLOW – TASK-BY-TASK (E2E BUILD CHECKLIST)
 *
 * STEP 0: Setup & Project Structure
 * ├─ Create frontend & backend file structure
 * ├─ Install dependencies (React, Tailwind, react-toastify, axios, socket.io-client)
 * └─ Setup backend (Express/Node, Socket.io, REST APIs)
 *
 * STEP 1: AUTH SYSTEM
 * ├─ Pages: LoginPage.jsx, RegisterPage.jsx
 * ├─ Components: Form, Submit Button, Loading
 * ├─ Hooks: useAuth.js
 * ├─ Store: authStore.js
 * └─ API: authApi.js → POST /login, /register
 *      ↓ On success → redirect to CardsPage.jsx (Dashboard default)
 *
 * STEP 2: DASHBOARD & CARD RESERVATION
 * ├─ Page: CardsPage.jsx (default dashboard)
 * ├─ Components:
 * │    ├─ BingoCard.jsx → show available cards
 * │    └─ GameControls.jsx → Reserve Card button
 * ├─ Hook: useCards.js
 * ├─ Store: cardsStore.js
 * └─ Socket Events:
 *      ├─ Emit: "reserve_card" → reserve selected card
 *      └─ Listen: "card_reserved" → update UI
 *      ↓ After reservation → wait for game start
 *
 * STEP 3: COUNTDOWN BEFORE GAME
 * ├─ Page: CountdownPage.jsx
 * ├─ Component: Countdown Timer
 * ├─ Hook: useGame.js
 * └─ Store: gameStore.js
 *      └─ Socket Event: "game_start" → redirect to GamePage.jsx
 *
 * STEP 4: ACTIVE GAME SESSION
 * ├─ Page: GamePage.jsx
 * ├─ Components:
 * │    ├─ GameBoard.jsx → live drawn numbers
 * │    ├─ BingoCard.jsx → player’s reserved card
 * │    └─ GameControls.jsx → Claim Bingo button
 * ├─ Hook: useGame.js
 * └─ Store: gameStore.js
 *      └─ Socket Events:
 *           ├─ Listen: "number_drawn" → update live board
 *           ├─ Emit: "claim_bingo" → player claims Bingo
 *           ├─ Listen: "claim_result" → accepted/rejected
 *           └─ Listen: "game_end" → show result, reset boards
 *
 * STEP 5: POST-GAME & RESET
 * ├─ Page: CardsPage.jsx
 * ├─ Reset Stores: cardsStore.js, gameStore.js
 * └─ Socket Event: "game_end" → UI reset & prepare next round
 *
 * OPTIONAL FEATURES / ENHANCEMENTS
 * ├─ Notifications: react-toastify (claim results, errors)
 * ├─ Voice Announcement: read drawn numbers
 * ├─ Leaderboard: top players
 * └─ History: past game results
 *
 * STEP 6: TESTING & DEPLOYMENT
 * ├─ Unit testing: Components & Hooks
 * ├─ Integration testing: Pages + Socket Events
 * └─ Deploy: Backend + Frontend (Vercel / Render / Heroku)
 */
*/