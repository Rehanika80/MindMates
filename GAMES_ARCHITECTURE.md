# 🎮 Games Feature - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MIND MATES APPLICATION                             │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         FRONTEND (React)                               │ │
│  │                                                                        │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │ │
│  │  │ DashboardPage.jsx                                               │  │ │
│  │  │ - Check-in Form                                                 │  │ │
│  │  │ - Smart Insights Card + "🎮 Play Games" Button                 │  │ │
│  │  └──────────────────────────┬──────────────────────────────────────┘  │ │
│  │                             │                                          │ │
│  │                             ↓                                          │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │ │
│  │  │ GamesModal.jsx                                                  │  │ │
│  │  │ - Shows Recommended Games                                       │  │ │
│  │  │ - Game Selection Grid                                           │  │ │
│  │  └──┬────────┬────────┬──────────┐                                 │  │ │
│  │     │        │        │          │                                 │  │ │
│  │     ↓        ↓        ↓          ↓                                 │  │ │
│  │  ┌────┐  ┌────┐  ┌────┐  ┌─────────┐                             │  │ │
│  │  │🫧  │  │🎹  │  │🌧️  │  │❓       │                             │  │ │
│  │  │Bubble│Piano│Rain  │Quiz      │                             │  │ │
│  │  │Shot  │     │Drops  │        │                             │  │ │
│  │  └──┬──┘  └──┬─┘  └──┬─┘  └─────┬───┘                             │  │ │
│  │     │       │       │          │                                 │  │ │
│  │     └───────┼───────┼──────────┘                                 │  │ │
│  │             ↓       ↓                                             │  │ │
│  │     ┌──────────────────────────┐                                 │  │ │
│  │     │ Game Components          │                                 │  │ │
│  │     │ - Canvas rendering       │                                 │  │ │
│  │     │ - Score calculation      │                                 │  │ │
│  │     │ - Audio synthesis        │                                 │  │ │
│  │     └──────────┬───────────────┘                                 │  │ │
│  │                │                                                  │  │ │
│  │                ↓                                                  │  │ │
│  │     ┌──────────────────────────┐                                 │  │ │
│  │     │ API Request              │                                 │  │ │
│  │     │ /api/games/session       │                                 │  │ │
│  │     │ (POST - Log Game)        │                                 │  │ │
│  │     └──────────┬───────────────┘                                 │  │ │
│  │                │                                                  │  │ │
│  └────────────────┼──────────────────────────────────────────────────┘  │ │
│                   │                                                      │ │
│                   │ HTTP/JSON                                            │ │
│                   ↓                                                      │ │
│  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │                    BACKEND (Express.js)                             │ │ │
│  │                                                                     │ │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │ │
│  │  │ game Routes                                                  │  │ │ │
│  │  │ GET  /games/recommendations?emotion=Calm                    │  │ │ │
│  │  │ POST /games/session (Protected)                            │  │ │ │
│  │  │ GET  /games/stats (Protected)                              │  │ │ │
│  │  │ GET  /games/leaderboard?gameId=bubble-shot                 │  │ │ │
│  │  └──────────────────┬───────────────────────────────────────────┘  │ │ │
│  │                     │                                              │ │ │
│  │                     ↓                                              │ │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │ │
│  │  │ gameController.js                                            │  │ │ │
│  │  │ - getGameRecommendations()                                   │  │ │ │
│  │  │ - logGameSession()                                           │  │ │ │
│  │  │ - getUserGameStats()                                         │  │ │ │
│  │  │ - getGameLeaderboard()                                       │  │ │ │
│  │  └──────────┬───────────────────────────────────────────────────┘  │ │ │
│  │             │                                                      │ │ │
│  │             ↓                                                      │ │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │ │
│  │  │ gameEngine.js & mindmateEngine.js                            │  │ │ │
│  │  │ - GAME_LIBRARY (mood → games mapping)                        │  │ │ │
│  │  │ - createGameRecommendation(mood, intensity)                  │  │ │ │
│  │  │ - generateQuizSession()                                      │  │ │ │
│  │  │ - detectEmotion() + gameRecommendations                      │  │ │ │
│  │  └──────────┬───────────────────────────────────────────────────┘  │ │ │
│  │             │                                                      │ │ │
│  │             ↓                                                      │ │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │ │
│  │  │ MongoDB Collections                                          │  │ │ │
│  │  │ ┌────────────────────────────────────────────────────────┐  │  │ │ │
│  │  │ │ GameSession Collection                                │  │  │ │ │
│  │  │ │ {                                                      │  │  │ │ │
│  │  │ │   _id: ObjectId,                                       │  │  │ │ │
│  │  │ │   user: ObjectId (ref User),                           │  │  │ │ │
│  │  │ │   gameId: "bubble-shot",                               │  │  │ │ │
│  │  │ │   gameName: "Bubble Shot",                             │  │  │ │ │
│  │  │ │   score: 250,                                          │  │  │ │ │
│  │  │ │   duration: 60 (seconds),                              │  │  │ │ │
│  │  │ │   emotion: "Calm",                                     │  │  │ │ │
│  │  │ │   status: "completed",                                 │  │  │ │ │
│  │  │ │   createdAt: Date,                                     │  │  │ │ │
│  │  │ │   updatedAt: Date                                      │  │  │ │ │
│  │  │ │ }                                                      │  │  │ │ │
│  │  │ └────────────────────────────────────────────────────────┘  │  │ │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │ │
│  │                                                                     │ │ │
│  └─────────────────────────────────────────────────────────────────────┘ │ │
│                                                                            │ │
└────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            COMPLETE USER FLOW                               │
│                                                                              │
│  USER INPUT PHASE                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Check-in Form Submission                                         │  │
│  │    - Mood: "Stressed"                                               │  │
│  │    - Intensity: 4                                                   │  │
│  │    - Note: "Overwhelmed with deadlines"                             │  │
│  │    - Button: "Generate Action Plan"                                 │  │
│  └────────────────────┬────────────────────────────────────────────────┘  │
│                       │                                                     │
│  ANALYSIS PHASE                                                             │
│                       ↓                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 2. Backend Analysis (mindmateEngine.js)                             │  │
│  │    ├─ detectEmotionFromText("Stressed", "Overwhelmed...")          │  │
│  │    │  └─ Returns: emotion="Stressed", confidence=0.88              │  │
│  │    │                                                                │  │
│  │    ├─ createActionPlan("Stressed", 4)                              │  │
│  │    │  └─ Returns: ["Take 3-min breathing...", ...]                │  │
│  │    │                                                                │  │
│  │    └─ createGameRecommendation("Stressed", 4)                      │  │
│  │       └─ gameEngine.getGamesForMood("Stressed")                    │  │
│  │          └─ Returns: [Piano, Rain Drops]                           │  │
│  │                                                                      │  │
│  │ 3. Save Analysis to Database                                        │  │
│  │    └─ CheckIn Document + gameRecommendations                       │  │
│  └────────────────────┬────────────────────────────────────────────────┘  │
│                       │                                                     │
│  DISPLAY PHASE                                                              │
│                       ↓                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 4. Dashboard Update                                                 │  │
│  │    ├─ Show "Detected Emotion: Stressed"                             │  │
│  │    ├─ Show "Productivity Cue: Recovery mode..."                     │  │
│  │    ├─ Show "Action Plan: ..."                                       │  │
│  │    └─ Show "🎮 PLAY GAMES" Button ← NEW!                            │  │
│  └────────────────────┬────────────────────────────────────────────────┘  │
│                       │                                                     │
│  GAME SELECTION PHASE                                                       │
│                       ↓                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 5. User Clicks "🎮 PLAY GAMES"                                      │  │
│  │    └─ GamesModal Opens                                              │  │
│  │       ├─ Title: "Recommended Games for Stressed mood"               │  │
│  │       └─ Shows: [Piano Card] [Rain Drops Card]                      │  │
│  └────────────────────┬────────────────────────────────────────────────┘  │
│                       │                                                     │
│  GAMEPLAY PHASE                                                             │
│                       ↓                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 6. User Selects "Piano Master"                                      │  │
│  │    └─ Piano Component Loads                                         │  │
│  │       ├─ Audio Context Initialized                                  │  │
│  │       ├─ Keyboard Rendered                                          │  │
│  │       └─ Game Starts                                                │  │
│  └────────────────────┬────────────────────────────────────────────────┘  │
│                       │                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 7. User Plays Piano                                                 │  │
│  │    ├─ Clicks Keys                                                   │  │
│  │    ├─ Audio Synthesized & Played                                    │  │
│  │    ├─ Notes Tracked (frequency, timestamp)                          │  │
│  │    ├─ Score Calculated (notes × 5)                                  │  │
│  │    └─ Time Elapsed Measured                                         │  │
│  └────────────────────┬────────────────────────────────────────────────┘  │
│                       │                                                     │
│  COMPLETION PHASE                                                           │
│                       ↓                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 8. User Closes Game                                                 │  │
│  │    └─ Auto-Logging Triggered                                        │  │
│  │       ├─ Prepare Data:                                              │  │
│  │       │  {                                                           │  │
│  │       │    gameId: "piano",                                          │  │
│  │       │    score: 65,          (13 notes × 5)                       │  │
│  │       │    duration: 285,      (in seconds)                         │  │
│  │       │    emotion: "Stressed",                                     │  │
│  │       │  }                                                           │  │
│  │       │                                                              │  │
│  │       ├─ POST to /api/games/session                                │  │
│  │       └─ Response: { success: true, data: GameSession }            │  │
│  └────────────────────┬────────────────────────────────────────────────┘  │
│                       │                                                     │
│  DATABASE UPDATE PHASE                                                      │
│                       ↓                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 9. Database Saves GameSession                                       │  │
│  │    └─ MongoDB Collection: gamesessions                              │  │
│  │       └─ Document Created with all details                          │  │
│  └────────────────────┬────────────────────────────────────────────────┘  │
│                       │                                                     │
│  RETURN & STATS PHASE                                                       │
│                       ↓                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 10. User Returns to Dashboard                                       │  │
│  │     ├─ Stats Updated                                                │  │
│  │     ├─ Total Games: 48                                              │  │
│  │     ├─ Total Score: 8,405                                           │  │
│  │     └─ Leaderboards Updated                                         │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Component Relationship Tree

```
DashboardPage
    ├── AuthContext (user info)
    ├── CheckIn Form
    │   ├── Mood selector
    │   ├── Intensity slider  
    │   └── Note textarea
    │
    ├── Smart Insights Card
    │   ├── Top Emotion display
    │   ├── Productivity Cue
    │   ├── Action Plan list
    │   └── [🎮 Play Games Button] ← Entry point
    │
    ├── GamesModal (Conditional Render)
    │   ├── Modal Header + Close
    │   ├── Game Recommendations Grid
    │   │   └── Game Cards (from gameRecommendations)
    │   │       ├── Bubble Shot Card
    │   │       │   └── Click → BubbleShot.jsx
    │   │       │
    │   │       ├── Piano Card
    │   │       │   └── Click → Piano.jsx
    │   │       │
    │   │       ├── Rain Drops Card
    │   │       │   └── Click → RainGame.jsx
    │   │       │
    │   │       └── Quiz Card
    │   │           └── Click → Quiz.jsx
    │   │
    │   ├── BubbleShot Game Component
    │   │   ├── Canvas element
    │   │   ├── Game loop (requestAnimationFrame)
    │   │   ├── Score display
    │   │   ├── Timer display
    │   │   └── Auto-log session on close
    │   │
    │   ├── Piano Game Component
    │   │   ├── Audio Context
    │   │   ├── Piano keyboard (8 keys)
    │   │   ├── Note tracking
    │   │   ├── Demo melody button
    │   │   └── Auto-log session on close
    │   │
    │   ├── RainGame Component
    │   │   ├── Canvas element
    │   │   ├── Game loop
    │   │   ├── Player movement
    │   │   ├── Raindrop collision detection
    │   │   ├── Lives display
    │   │   └── Auto-log session on close
    │   │
    │   └── Quiz Component
    │       ├── Question display
    │       ├── Multiple choice buttons
    │       ├── Score calculation
    │       ├── Progress bar
    │       ├── Feedback display
    │       └── Auto-log session on complete
    │
    └── [More Dashboard sections...]
```

## API Call Sequence

```
SEQUENCE: Game Session Logging

Frontend                                    Backend
│                                           │
├── User closes game                        │
│                                           │
├── Calculate final score & duration        │
│                                           │
├── POST /api/games/session ──────────────→ │
│   {                                       │
│     gameId: "bubble-shot",                │
│     score: 250,                           │
│     duration: 60,                         │
│     emotion: "Calm"                       │
│   }                                       │
│                                           │ ← gameController.logGameSession()
│                                           │
│                                           ├─ Validate inputs
│                                           │
│                                           ├─ Get game config from gameEngine
│                                           │
│                                           ├─ Create GameSession document
│                                           │   {
│                                           │     user: req.user._id,
│                                           │     gameId: "bubble-shot",
│                                           │     gameName: "Bubble Shot",
│                                           │     score: 250,
│                                           │     duration: 60,
│                                           │     emotion: "Calm",
│                                           │     status: "completed"
│                                           │   }
│                                           │
│                                           ├─ Save to MongoDB
│                                           │
│                                           ├─ Return success response
│   ←────────────────────── Response {      │
│                               success: true,
│                               data: savedSession
│                             }
│
├─ Parse response
│
└─ Show confirmation / Return to dashboard
```

---

**This architecture provides a robust, scalable system for mood-based gaming! 🎮✨**
