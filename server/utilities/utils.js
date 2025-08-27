const jwt = require("jsonwebtoken")
const env = require("../config/env")

const createToken = (payload) => jwt.sign(payload, env.JWT_SECRET)
const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET)

module.exports = { createToken, verifyToken }