import mongoose from 'mongoose'

const checkInSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    mood: {
      type: String,
      trim: true,
      required: true,
    },
    detectedEmotion: {
      type: String,
      trim: true,
      required: true,
    },
    confidence: {
      type: Number,
      default: 0.5,
      min: 0,
      max: 1,
    },
    note: {
      type: String,
      trim: true,
      required: true,
    },
    intensity: {
      type: Number,
      default: 3,
      min: 1,
      max: 5,
    },
    actionPlan: {
      type: [String],
      default: [],
    },
    supportSuggestion: {
      type: String,
      trim: true,
      default: '',
    },
    insightTags: {
      type: [String],
      default: [],
    },
    productivityCue: {
      type: String,
      trim: true,
      default: '',
    },
    gameRecommendations: {
      type: [Object],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

const CheckIn = mongoose.model('CheckIn', checkInSchema)

export default CheckIn
