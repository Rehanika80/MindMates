import { analyzeChatMessage } from '../utils/mindmateEngine.js'
import CheckIn from '../models/CheckIn.js'

export const chatWithCoach = async (req, res) => {
  try {
    const { message } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      })
    }

    const latestCheckIn = await CheckIn.findOne({ user: req.user._id }).sort({ createdAt: -1 })
    const analysis = analyzeChatMessage({
      message: message.trim(),
      detectedEmotion: latestCheckIn?.detectedEmotion || latestCheckIn?.mood || 'Calm',
    })

    return res.json({
      success: true,
      data: {
        reply: analysis.reply,
        quickActions: analysis.quickActions,
      },
    })
  } catch (error) {
    console.error('coachChat Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Coach chat failed',
    })
  }
}
