const { LeaderboardService } = require("../services/leaderboardServices");

class LeaderboardController {
    static async getLeaderboard(req, res, next) {
        try {
            const leaderboard = await LeaderboardService.getLeaderboard();
            res.status(200).json(leaderboard);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { LeaderboardController };