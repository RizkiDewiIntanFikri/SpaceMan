const { verifyToken } = require("../utilities/utils");
const { User } = require("../models")

async function auth(req, res, next) {
    try {
        const { authorization } = req.headers
        if (!authorization) throw new Error("UNAUTHORIZED")

        const token = authorization.split(" ")[1]
        if (!token) throw new Error("UNAUTHORIZED")

        const payload = verifyToken(token)
        const user = await User.findOne({ where: { id: payload.id } })
        if (!user) throw new Error("UNAUTHORIZED")
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = auth