import User from '../models/User.js'
import CheckIn from '../models/CheckIn.js'

export const getAdminOverview = async (req, res) => {
  try {
    const [usersCount, checkInsCount, recentUsers, recentCheckIns] = await Promise.all([
      User.countDocuments(),
      CheckIn.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      CheckIn.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email role'),
    ])

    return res.json({
      success: true,
      data: {
        usersCount,
        checkInsCount,
        recentUsers,
        recentCheckIns,
      },
    })
  } catch (error) {
    console.error('getAdminOverview Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to load admin overview',
    })
  }
}