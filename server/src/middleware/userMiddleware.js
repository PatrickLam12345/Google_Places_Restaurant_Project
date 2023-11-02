require('dotenv').config()

const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).send({ message: "Unauthorized" })
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = user
        next()
    } catch (error) {
        return res.status(403).send({ message: "Invalid token" })
    }
}

module.exports = {
    authenticateToken
}