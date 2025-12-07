/*
backend/
│
├── server.js               # Entry point
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
    │   ├── GameSession.js
    │   └── Number.js        # <-- new model
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── cardRoutes.js
    │   ├── gameRoutes.js
    │   └── numberRoutes.js  # <-- new route for Number model
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── cardController.js
    │   ├── gameController.js
    │   └── numberController.js  # <-- controller for Number model
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
    ├── seed/
    │   ├── seedCards.js
    │   └── seedNumbers.js     # <-- seed file for Number model
    │
    └── public/
        └── dVoice/            # <-- place all your mp3 voice files here

*/