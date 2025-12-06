/*

backend/
│
├── server.js               # Entry point (can stay in root or in src/)
├── .env
├── package.json
│
└── src/
    │
    ├── app.js              # Express app setup
    │
    ├── config/
    │   └── db.js           # MongoDB connection
    │
    ├── models/
    │   ├── User.js
    │   ├── BingoCard.js
    │   └── GameSession.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── cardRoutes.js
    │   └── gameRoutes.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── cardController.js
    │   └── gameController.js
    │
    ├── sockets/
    │   ├── index.js
    │   ├── cardSocket.js
    │   └── gameSocket.js
    │
    ├── utils/
    │   ├── auth/
    │   │   ├── jwt.js
    │   │   └── hash.js
    │   └── game/
    │       ├── patterns.js
    │       └── random.js
    │
    ├── middleware/
    │   └── authMiddleware.js
    │
    └── seed/
        └── seedCards.js
*/