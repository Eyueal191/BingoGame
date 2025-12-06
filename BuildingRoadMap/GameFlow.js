/**
BINGO GAME USER FLOW – HORIZONTAL STEP-BY-STEP (STAIR STRUCTURE)

[Step 1: Auth] ─────► [Step 2: Card Reservation] ─────► [Step 3: Countdown] ─────► [Step 4: Active Game] ─────► [Step 5: Post-Game Reset]

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Step 1: Auth (Login / Register)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Pages: LoginPage.jsx / RegisterPage.jsx
Components: Form, Submit Button, Loading Spinner
Hook: useAuth.js
Store: authStore.js
API: authApi.js → POST /login, /register
Flow:
 └─ User submits credentials → Auth validated → authStore updated → Redirect to CardsPage.jsx (Dashboard)

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Step 2: Dashboard / Card Reservation
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Page: CardsPage.jsx (Default Dashboard)
Components: BingoCard.jsx (list of available cards), GameControls.jsx (Reserve Card button)
Hook: useCards.js
Store: cardsStore.js
Socket Events:
 ├─ Emit: "reserve_card" → server reserves card for player
 └─ Listen: "card_reserved" → update UI with reserved status
Flow:
 └─ Player selects & reserves a card → Wait for game_start event

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Step 3: Countdown Before Game Start
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Page: CountdownPage.jsx
Components: Countdown Timer
Hook: useGame.js
Store: gameStore.js
Socket Events:
 └─ Listen: "game_start" → redirect to GamePage.jsx
Flow:
 └─ Timer counts down → When timer ends → game_start event triggers → GamePage.jsx opens

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Step 4: Active Game Session
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Page: GamePage.jsx
Components: GameBoard.jsx (live drawn numbers), BingoCard.jsx (player card), GameControls.jsx (Claim Bingo)
Hook: useGame.js
Store: gameStore.js
Socket Events:
 ├─ Listen: "number_drawn" → update live numbers on GameBoard.jsx
 ├─ Emit: "claim_bingo" → player clicks claim
 ├─ Listen: "claim_result" → accepted/rejected → show notification
 └─ Listen: "game_end" → show result, reset board, update history
Flow:
 └─ Numbers drawn → Player marks card → Player claims Bingo → Server validates → Notify player → Continue until game ends

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Step 5: Post-Game / Reset
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Page: CardsPage.jsx
Store Reset: cardsStore.js, gameStore.js
Socket Events:
 └─ Listen: "game_end" → reset UI, prepare for next round
Flow:
 └─ After game ends → clear marked numbers → reset reserved cards → player ready for next game

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Optional / Enhancements
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 ├─ Notifications: react-toastify (show claim result, game start, errors)
 ├─ Voice Announcement: read drawn numbers aloud
 ├─ Leaderboard: display top winners
 └─ Game History: track past games and winners.
 
*/
