# 🚀 Games Feature - Installation & Testing Guide

## Quick Start

### Prerequisites
- Node.js and npm installed
- MongoDB running locally or connection string configured
- Backend and frontend running

### Installation Steps

#### 1. Backend Setup
```bash
cd backend

# Install dependencies (if not already installed)
npm install

# The gameEngine.js, GameSession model, and gameRoutes are already created
# Just ensure MongoDB connection is configured in your .env

# Start the backend
npm run dev
# Should see: MindMates API running on port 5001
```

#### 2. Frontend Setup
```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
# Should see: Local: http://localhost:5173
```

### Testing the Games Feature

#### Test 1: Basic Game Recommendation
1. Open browser to `http://localhost:5173`
2. Login with your credentials
3. Fill out the check-in form:
   - Select mood: **Stressed**
   - Intensity: 4
   - Note: "I'm feeling anxious"
   - Click "Generate Action Plan"

**Expected**: 
- Smart Insights card should show "🎮 Play Games" button
- Button should appear because Stressed mood has game recommendations

#### Test 2: Open Games Modal
1. From Test 1, click the "🎮 Play Games" button

**Expected**:
- Modal opens showing 2 recommended games for "Stressed" mood
- Games shown: Piano Master and Rain Drops
- Each game card shows:
  - Emoji and name
  - Description
  - Duration
  - Benefit
  - "Play Now" button

#### Test 3: Play Bubble Shot
1. Change mood to "Calm"
2. Generate action plan
3. Click "🎮 Play Games"
4. Click on "Bubble Shot" card

**Expected**:
- Full-screen game canvas appears
- Blue bubbles bouncing around
- Score and time counter at top
- Click bubbles to score points
- Game ends after 60 seconds
- Final score screen shows
- "Back to Dashboard" button

#### Test 4: Play Piano
1. Change mood to "Tired"
2. Generate action plan
3. Click "🎮 Play Games"
4. Click on "Piano Master" card

**Expected**:
- Piano keyboard displayed with white keys
- Click keys to play notes
- "Play Demo Melody" button plays sample music
- Notes played are logged
- Click close to return

#### Test 5: Play Rain Game
1. Change mood to "Stressed"
2. Click "🎮 Play Games"
3. Click on "Rain Drops" card

**Expected**:
- Game canvas with falling blue raindrops
- Blue rectangle at bottom is player character
- Use Arrow Keys or A/D to move left/right
- Catch raindrops (+10 points each)
- Lose 1 life if raindrop falls
- Game ends at 0 lives
- Can also press Close button

#### Test 6: Play Quiz
1. Change mood to "Happy"
2. Click "🎮 Play Games"
3. Click on "Quick Quiz" card

**Expected**:
- Question displayed with 4 multiple choice options
- Click to select answer
- Feedback shows if correct (green) or incorrect (red)
- Progress bar shows questions completed
- Score displayed
- After 5 questions, final score screen
- Shows percentage correct

#### Test 7: Check Game Stats
1. Play 2-3 games
2. Check browser console or make API request:
```bash
curl http://localhost:5001/api/games/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**:
- Returns JSON with:
  - totalGamesPlayed
  - totalScore
  - averageScore
  - recentSessions array
  - gameStats breakdown

#### Test 8: Check Leaderboard
```bash
curl "http://localhost:5001/api/games/leaderboard?gameId=bubble-shot"
```

**Expected**:
- Returns top 10 scores for that game
- Shows user names and scores

### Database Verification

Check if game sessions are being saved:

```bash
# MongoDB shell
mongo

# Connect to your database
use mindmates

# Check game sessions
db.gamesessions.find().pretty()
```

Expected output:
```javascript
{
  "_id": ObjectId(...),
  "user": ObjectId(...),
  "gameId": "bubble-shot",
  "gameName": "Bubble Shot",
  "score": 150,
  "duration": 60,
  "emotion": "Calm",
  "status": "completed",
  "createdAt": ISODate(...),
  "updatedAt": ISODate(...)
}
```

## Troubleshooting

### Issue: "🎮 Play Games" button not appearing
**Solution**: 
- Make sure you've submitted a check-in with a valid mood
- Check that the mindmateEngine.js has the gameRecommendations added
- Refresh the page

### Issue: Games not loading/appearing black
**Solution**:
- Check browser console for errors (F12)
- Verify frontend is running on localhost:5173
- Clear browser cache and reload

### Issue: Audio not working in Piano
**Solution**:
- Check browser console for AudioContext errors
- Some browsers need user interaction first
- Try clicking a key and allowing audio permissions

### Issue: Game sessions not saving
**Solution**:
- Verify MongoDB is running
- Check backend logs for errors
- Ensure JWT token is valid (check browser localStorage)
- Verify gameRoutes.js is registered in app.js

### Issue: CORS errors
**Solution**:
- Frontend URL should be in backend CORS allowed origins
- Check .env FRONTEND_URL configuration
- Restart backend

## API Testing with Postman

### 1. Get Game Recommendations
```
GET http://localhost:5001/api/games/recommendations?emotion=Stressed
Headers: Content-Type: application/json
Response: Array of recommended games
```

### 2. Log Game Session
```
POST http://localhost:5001/api/games/session
Headers: 
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN
Body: {
  "gameId": "bubble-shot",
  "score": 250,
  "duration": 60,
  "emotion": "Calm"
}
```

### 3. Get User Stats
```
GET http://localhost:5001/api/games/stats
Headers: Authorization: Bearer YOUR_JWT_TOKEN
```

### 4. Get Leaderboard
```
GET http://localhost:5001/api/games/leaderboard?gameId=quiz
```

## Performance Notes

- Canvas games use requestAnimationFrame for smooth 60fps
- Piano uses Web Audio API for real-time sound synthesis
- Game sessions logged asynchronously to not block gameplay
- Quiz pre-loads all questions for instant access

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Best performance |
| Firefox | ✅ Full | Full support |
| Safari | ⚠️ Partial | Audio may need user interaction |
| Edge | ✅ Full | Chromium-based, full support |
| Mobile | ⚠️ Limited | Touch events not fully implemented |

## Next Steps / Future Features

- [ ] Add touch controls for mobile games
- [ ] Implement difficulty levels
- [ ] Add achievements/badges
- [ ] Create daily challenges
- [ ] Add power-ups and bonuses
- [ ] Implement multiplayer challenges
- [ ] Add game tutorials
- [ ] Create seasonal events

---

**Tested On**: Node.js 18+, MongoDB 5+, Chrome/Firefox Latest  
**Last Updated**: 2026-05-02
