const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/userControllers')
const userMiddleware = require('../middleware/userMiddleware')

router.post('/addRestaurant', userMiddleware.authenticateToken, userControllers.addRestaurant)
router.get('/getRestaurants', userMiddleware.authenticateToken, userControllers.getRestaurants)
router.get('/getRestaurant/:restaurantId', userMiddleware.authenticateToken, userControllers.getRestaurant)
router.patch('/setVisited/:restaurantId', userMiddleware.authenticateToken, userControllers.setVisited)
router.patch('/setNotVisited/:restaurantId', userMiddleware.authenticateToken, userControllers.setNotVisited)
router.delete('/removeRestaurant/:restaurantId', userMiddleware.authenticateToken, userControllers.removeRestaurant)

router.post('/addRating', userMiddleware.authenticateToken, userControllers.addRating)
router.get('/getRestaurantReviews/:restaurantId', userMiddleware.authenticateToken, userControllers.getRestaurantReviews)

module.exports = router