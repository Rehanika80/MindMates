import CheckIn from '../models/CheckIn.js'
import { analyzeCheckIn } from '../utils/mindmateEngine.js'

export const getCheckIns = async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ user: null }).sort({ createdAt: -1 }).limit(5)

    return res.json({
      success: true,
      message: 'Check-ins loaded',
      data: checkIns,
    })
  } catch (error) {
    console.error('getCheckIns Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to load check-ins',
    })
  }
}

export const createCheckIn = async (req, res) => {
  try {
    const { name = '', mood, note, intensity = 3 } = req.body

    if (!mood || !note) {
      return res.status(400).json({
        success: false,
        message: 'Mood and note are required',
      })
    }

    const analysis = analyzeCheckIn({
      mood,
      note,
      intensity: Number(intensity) || 3,
    })

    const checkIn = await CheckIn.create({
      user: req.user?._id || null,
      name,
      mood,
      detectedEmotion: analysis.detectedEmotion,
      confidence: analysis.confidence,
      note,
      intensity: Number(intensity) || 3,
      actionPlan: analysis.actionPlan,
      supportSuggestion: analysis.supportSuggestion,
      insightTags: analysis.insightTags,
      productivityCue: analysis.productivityCue,
    })

    return res.status(201).json({
      success: true,
      message: 'Check-in saved',
      data: checkIn,
    })
  } catch (error) {
    console.error('createCheckIn Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to save check-in',
    })
  }
}

export const getMyCheckIns = async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10)

    return res.json({
      success: true,
      message: 'Personal check-ins loaded',
      data: checkIns,
    })
  } catch (error) {
    console.error('getMyCheckIns Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to load personal check-ins',
    })
  }
}