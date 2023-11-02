const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const addRestaurant = async (req, res, next) => {
    const { name, address, imageUrl, rating, googleUrl, visited } = req.body
    const user = req.user

    try {
        const exists = await prisma.restaurant.findFirst({
            where: {
                name,
                userId: user.id
            }
        })

        if (exists) {
            res.status(400).json({ message: 'Restaurant is already added' })
        } else {
            const newRestaurant = await prisma.restaurant.create({
                data: {
                    name,
                    address,
                    imageUrl,
                    googleUrl,
                    rating: String(rating),
                    visited,
                    user: {
                        connect: { id: user.id }
                    }
                }
            })
            res.status(201).json({ message: 'Restaurant added to wishlist', restaurant: newRestaurant });
        }
    } catch (error) {
        console.error('Error adding restaurant to wishlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await prisma.$disconnect()
    }
}

const getRestaurants = async (req, res, next) => {
    const user = req.user

    try {
        const restaurants = await prisma.restaurant.findMany({
            where: {
                userId: user.id
            },
            include: {
                userRating: {
                    where: {
                        userId: user.id
                    },
                    select: {
                        rating: true,
                    }
                }
            }
        })
        res.send(restaurants)
    } catch (error) {
        console.error("Error fetching wishlist:", error)
        res.status(500).send("Internal server error")
    } finally {
        await prisma.$disconnect()
    }
}

const getRestaurant = async (req, res, next) => {
    const user = req.user
    const { restaurantId } = req.params

    try {
        const restaurants = await prisma.restaurant.findFirst({
            where: {
                id: Number(restaurantId)
            },
            include: {
                userRating: {
                    where: {
                        userId: user.id
                    },
                    select: {
                        rating: true,
                    }
                }
            }
        })
        res.send(restaurants)
    } catch (error) {
        console.error("Error fetching wishlist:", error)
        res.status(500).send("Internal server error")
    } finally {
        await prisma.$disconnect()
    }
}

const setVisited = async (req, res, next) => {
    const user = req.user
    const { restaurantId } = req.params

    try {
        const updatedRestaurant = await prisma.restaurant.update({
            where: {
                id: Number(restaurantId),
                userId: user.id
            },
            data: {
                visited: true
            }
        })
        res.status(200).json({ message: 'Restaurant updated', restaurant: updatedRestaurant });
    } catch (error) {
        console.error('Error adding restaurant to visited:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await prisma.$disconnect()
    }
}

const setNotVisited = async (req, res, next) => {
    const user = req.user
    const { restaurantId } = req.params

    try {
        const updatedRestaurant = await prisma.restaurant.update({
            where: {
                id: Number(restaurantId),
                userId: user.id
            },
            data: {
                visited: false
            }
        })
        res.status(200).json({ message: 'Restaurant updated', restaurant: updatedRestaurant });
    } catch (error) {
        console.error('Error removing restaurant from visited:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await prisma.$disconnect()
    }
}

const removeRestaurant = async (req, res, next) => {
    const user = req.user
    const { restaurantId } = req.params

    try {
        const removedRestaurant = await prisma.restaurant.delete({
            where: {
                id: Number(restaurantId),
                userId: user.id
            },
        });

        res.status(200).json({ message: 'Restaurant removed from wishlist', restaurant: removedRestaurant })
    } catch (error) {
        console.log(error)
    }
}

const addRating = async (req, res, next) => {
    const { restaurantId, rating, reviewId } = req.body
    const user = req.user

    try {
        const exists = await prisma.UserRating.findFirst({
            where: {
                userId: user.id,
                restaurantId: restaurantId
            }
        })

        if (exists) {
            const updatedRestaurant = await prisma.UserRating.update({
                where: {
                    id: reviewId,
                    restaurantId: restaurantId,
                    userId: user.id
                },
                data: {
                    rating: Number(rating)
                }
            })
            res.status(200).json({ message: 'Rating updated', restaurant: updatedRestaurant })
        } else {
            const newRestaurant = await prisma.UserRating.create({
                data: {
                    user: {
                        connect: { id: user.id }
                    },
                    restaurant: {
                        connect: { id: restaurantId }
                    },
                    rating: Number(rating)
                }
            })
            res.status(201).json({ message: 'Rating Added', restaurant: newRestaurant });
        }
    } catch (error) {
        console.error('Error adding rating', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await prisma.$disconnect()
    }
}

const getRestaurantReviews = async (req, res, next) => {
    const user = req.user
    const { restaurantId } = req.params

    try {
        const reviews = await prisma.UserRating.findMany({
            where: {
                restaurantId: Number(restaurantId)
            }
        })

        res.send(reviews)
    } catch (error) {
        console.error("Error getting rating:", error)
        res.status(500).send("Internal server error")
    } finally {
        await prisma.$disconnect()
    }
}

module.exports = {
    addRestaurant,
    getRestaurants,
    setVisited,
    setNotVisited,
    removeRestaurant,
    addRating,
    getRestaurantReviews,
    getRestaurant
}