import mongoose from 'mongoose'

const gameSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gameId: {
      type: String,
      required: true,
      enum: ['bubble-shot', 'piano', 'rain', 'quiz', 'mandala-art', 'zen-sand', 'flappy-focus'],
    },
    gameName: {
      type: String,
      trim: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    emotion: {
      type: String,
      default: 'Calm',
    },
    mood: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'normal', 'hard'],
      default: 'normal',
    },
    status: {
      type: String,
      enum: ['playing', 'completed', 'abandoned'],
      default: 'completed',
    },
  },
  { timestamps: true }
)

export default mongoose.model('GameSession', gameSessionSchema)
