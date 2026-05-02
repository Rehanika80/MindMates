# 🎮 Games Feature - Mind Mates

## Overview
The Games feature provides mood-based interactive games designed to help users relax, focus, and improve their mental well-being. Games are recommended based on the user's current emotional state.

## Games Available

### 1. **🫧 Bubble Shot** (Relaxation/Light Play)
- **Duration**: 3-5 minutes per game
- **Mechanics**: Click/tap bubbles as they bounce around the screen
- **Score System**: +10 points per bubble popped
- **Time Limit**: 60 seconds
- **Best For**: Calm, Happy, Tired moods
- **Benefits**: 
  - Stress relief through interactive play
  - Improves hand-eye coordination
  - Light, meditative gameplay

### 2. **🎹 Piano Master** (Creative Expression)
- **Duration**: 5-10 minutes per session
- **Mechanics**: 
  - Click piano keys to play notes
  - Play demo melodies
  - Track notes played
- **Audio**: Real synthesized piano sounds
- **Features**:
  - 8-note keyboard (C4 to C5)
  - Pre-recorded melodies
  - Notes log with frequency tracking
- **Best For**: Stressed, Tired, Sad moods
- **Benefits**:
  - Emotional expression through music
  - Creative outlet for stress relief
  - Meditative and calming

### 3. **🌧️ Rain Drops** (Action/Reflexes)
- **Duration**: 3-5 minutes per game
- **Mechanics**: Move character left/right to catch falling raindrops
- **Controls**:
  - Arrow Keys or A/D to move
  - Catch blue raindrops to score points
- **Lives System**: Start with 3 lives
- **Score**: +10 points per raindrop caught
- **Best For**: Stressed, Overwhelmed moods
- **Benefits**:
  - Release tension through gameplay
  - Improve reflexes
  - Active engagement to shift mood

### 4. **❓ Quick Quiz** (Mental Challenge)
- **Duration**: 5-10 minutes per session
- **Format**: 5 random trivia questions from pool of 10
- **Scoring**: +20 points per correct answer
- **Instant Feedback**: Shows if answer is correct/incorrect
- **Leaderboard**: Track high scores
- **Best For**: Happy, Focused, Sad moods
- **Benefits**:
  - Mental engagement and focus
  - Learn interesting facts
  - Positive reinforcement with correct answers

## Mood Recommendations

Games are automatically recommended based on detected emotion:

```
Calm       → Piano, Bubble Shot
Happy      → Bubble Shot, Quiz
Focused    → Quiz
Stressed   → Rain, Piano
Tired      → Piano, Bubble Shot
Sad        → Quiz, Piano
```

## User Experience Flow

1. **Check-In**: User logs their mood
2. **Analysis**: Backend detects emotion using AI
3. **Recommendations**: Games recommended based on mood
4. **Play**: User selects and plays a game
5. **Logging**: Game score/duration automatically saved
6. **Stats**: User can view game history and leaderboards

## API Endpoints

### Get Game Recommendations
```
GET /api/games/recommendations?emotion=Calm
Response: [{ id, name, description, duration, benefit, emoji }]
```

### Log Game Session
```
POST /api/games/session
Body: { gameId, score, duration, emotion, difficulty }
Response: { success, data: gameSession }
```

### Get User Game Stats
```
GET /api/games/stats (Protected)
Response: {
  totalGamesPlayed,
  totalScore,
  averageScore,
  averageDuration,
  recentSessions: [],
  gameStats: [{gameId, timesPlayed, totalScore, highScore, averageScore}]
}
```

### Get Game Leaderboard
```
GET /api/games/leaderboard?gameId=bubble-shot
Response: [{ user, score, date }] // Top 10 scores
```

## Database Schema

### GameSession Model
```javascript
{
  user: ObjectId (ref: User),
  gameId: String (bubble-shot|piano|rain|quiz),
  gameName: String,
  score: Number,
  duration: Number (seconds),
  emotion: String,
  mood: String,
  difficulty: String (easy|normal|hard),
  status: String (playing|completed|abandoned),
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Components

### GamesModal.jsx
Main modal showing game recommendations grid. Users can click any game card to start playing.

### Individual Game Components
- BubbleShot.jsx
- Piano.jsx
- RainGame.jsx
- Quiz.jsx

Each component:
- Runs independently
- Auto-logs session on completion
- Shows score/stats
- Has close button to return to dashboard

## Technical Implementation

### Canvas Games
- **BubbleShot**: Uses HTML5 Canvas for rendering and physics
- **RainGame**: Canvas-based 2D game loop with collision detection

### Web Audio API
- **Piano**: Uses AudioContext for synthesized piano sounds
- Frequency-based note generation

### State Management
- React hooks for game state
- Local refs for performance-critical operations
- Automatic session logging on game end

## Features To Implement (Future)
- [ ] Different difficulty levels
- [ ] Power-ups and bonuses
- [ ] Multiplayer leaderboards
- [ ] Game achievements/badges
- [ ] Sound effects toggle
- [ ] Mobile touch support
- [ ] Game statistics dashboard
- [ ] Daily challenges
- [ ] Seasonal events

## Files Modified/Created

### Backend
- `backend/src/utils/gameEngine.js` (NEW)
- `backend/src/models/GameSession.js` (NEW)
- `backend/src/controllers/gameController.js` (NEW)
- `backend/src/routes/gameRoutes.js` (NEW)
- `backend/src/utils/mindmateEngine.js` (UPDATED - added game recommendations)
- `backend/src/app.js` (UPDATED - added game routes)

### Frontend
- `frontend/src/components/games/BubbleShot.jsx` (NEW)
- `frontend/src/components/games/Piano.jsx` (NEW)
- `frontend/src/components/games/RainGame.jsx` (NEW)
- `frontend/src/components/games/Quiz.jsx` (NEW)
- `frontend/src/components/games/GamesModal.jsx` (NEW)
- `frontend/src/pages/DashboardPage.jsx` (UPDATED - added games button and modal)

## Usage

### For Users
1. Log a mood check-in on the dashboard
2. AI analyzes emotion
3. Click "🎮 Play Games" button in Smart Insights
4. Select a game from recommendations
5. Play the game
6. Score automatically saved

### For Developers
```javascript
// Get recommendations
import { getGamesForMood } from './backend/src/utils/gameEngine.js'
const games = getGamesForMood('Stressed') // Returns array of games

// Log a game session
await apiRequest('/games/session', {
  method: 'POST',
  body: JSON.stringify({
    gameId: 'bubble-shot',
    score: 150,
    duration: 60,
    emotion: 'Calm'
  })
})
```

---

**Version**: 1.0  
**Status**: Complete and Ready for Testing
