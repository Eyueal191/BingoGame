/*
frontend/
│
├── public/
│   └── BingoLogo.png
│
├── src/
│   ├── assets/
│   │   └── BingoLogo.png
│   │
│   ├── api/
│   │   ├── axiosInstance.js
│   │   ├── authApi.js
│   │   ├── cardApi.js
│   │   └── gameApi.js
│   │
│   ├── stores/
│   │   ├── authStore.js
│   │   ├── cardsStore.js        # Track user cards & reservations
│   │   └── gameStore.js         # Track live game numbers & claims
│   │
│   ├── services/
│   │   └── socket.js            # Socket.io events & emitters
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCards.js
│   │   └── useGame.js           # For listening/updating live game state
│   │
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── CardsPage.jsx        # Default dashboard page
│   │   ├── CardPreviewPage.jsx
│   │   ├── CountdownPage.jsx
│   │   └── GamePage.jsx         # Active game session
│   │
│   ├── components/
│   │   ├── NavBar.jsx
│   │   ├── Loading.jsx
│   │   ├── GameBoard.jsx        # Shows live numbers
│   │   ├── BingoCard.jsx        # Individual card UI
│   │   └── GameControls.jsx     # Claim Bingo button etc.
│   │
│   ├── router/
│   │   ├── AppRouter.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   │
│   ├── utils/
│   │   ├── validators.js
│   │   └── helpers.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
└── package.json
*/