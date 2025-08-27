const { User, Portfolio, sequelize } = require('../models');
const { createToken, verifyToken } = require('../utilities/utils');


class UserController {
    static async register(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { username } = req.body
            if (!username) throw new Error("VALIDATION_ERROR")

            const foundUser = await User.findOne({ where: { username } })
            if (foundUser) throw new Error("USER_ALREADY_EXISTS")

            const newUser = await User.create({ username }, { transaction: t })

            await Portfolio.create({ userId: newUser.id }, { transaction: t })

            await t.commit()
            const token = createToken({ id: newUser.id, username: newUser.username })
            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    cashBalance: newUser.cashBalance
                },
                token: token
            })

        } catch (error) {
            // console.log(error);
            // If any error occurred, the transaction would have been rolled back automatically.
            // We still need to ensure any manually started transaction is rolled back here.
            if (!t.finished) {
                await t.rollback();
            }
            next(error)
        }
    }
}

module.exports = { UserController }