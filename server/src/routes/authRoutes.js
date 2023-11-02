const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/authControllers')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', authControllers.register)
router.post('/login', authControllers.login)
router.get('/me', authMiddleware.authenticateToken, authControllers.getUserProfile)

module.exports = router