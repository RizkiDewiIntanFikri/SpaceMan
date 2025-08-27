const { User } = require("../models")

class LeaderboardService {
    static async getLeaderboard() {
        const topUsers = await User.findAll({
            attibutes: ['username', 'portfolioValue'],
            order: [['portfolioValue', 'DESC']],
            limit: 10
        })

        return topUsers
    }
}