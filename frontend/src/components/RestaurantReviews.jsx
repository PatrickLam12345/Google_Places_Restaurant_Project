import { useParams } from "react-router-dom"
import { useState, useEffect } from 'react'
import axios from 'axios'
import isAuthenticated from './auth/IsAuthenticated'

import { Grid, Typography, Card, CardMedia, CardContent, CardActions, IconButton, Snackbar, Alert, Button } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import { yellow } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'



export default function RestaurantReviews() {
    const { restaurantId } = useParams()
    const [reviews, setReviews] = useState([])
    const [restaurant, setRestaurant] = useState([])
    const [rating, setRating] = useState('')
    const isAuth = isAuthenticated()
    const [refresh, setRefresh] = useState(false)
    const [averageRating, setAverageRating] = useState(0)

    useEffect(() => {
        const getReviews = async () => {
            const response = await axios.get(
                `http://localhost:3000/api/user/getRestaurantReviews/${restaurantId}`,
                {
                    headers: {
                        authorization: window.localStorage.getItem("token")
                    }
                }
            )

            setReviews(response.data)
            let rating = 0
            for (let i = 0; i < response.data.length; i++) {
                rating += response.data[i].rating
            }
            setAverageRating(rating / response.data.length)
        }
        console.log(averageRating, reviews)
        getReviews()

        const getRestaurant = async () => {
            const response = await axios.get(
                `http://localhost:3000/api/user/getRestaurant/${restaurantId}`,
                {
                    headers: {
                        authorization: window.localStorage.getItem("token")
                    }
                }
            )

            setRestaurant(response.data)
        }

        getRestaurant()
    }, [refresh])

    const onSubmit = async (e, restaurantId, reviewId) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:3000/api/user/addRating',
                {
                    rating,
                    restaurantId,
                    reviewId
                }, {
                headers: {
                    authorization: window.localStorage.getItem("token")
                }
            });
            setRating('')
            if (refresh) {
                setRefresh(false)
            } else {
                setRefresh(true)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Card style={{ position: 'relative' }}>
                    <CardMedia
                        onClick={() => window.open(restaurant.googleUrl, '_blank')}
                        sx={{ height: 100, width: '100%' }}
                        image={restaurant.imageUrl}
                    />
                    <CardContent>
                        <Typography align={'center'} variant="body1" sx={{ fontWeight: 'bold' }}>
                            {restaurant.name}
                        </Typography>
                        <Typography align={'center'} variant="body2">
                            {restaurant.address}
                        </Typography>
                        {averageRating ? (
                            <Typography align={'center'} sx={{ fontSize: 14, fontWeight: 'bold', marginBottom: 1 }}>
                                {averageRating}/5
                                <IconButton sx={{ color: yellow[500], margin: -4 }} >
                                    <StarIcon sx={{ padding: 0, marginLeft: 4, marginBottom: .5 }} />
                                </IconButton>
                            </Typography>
                        ) : (
                            <Typography align={'center'} sx={{ fontSize: 14, fontWeight: 'bold', marginBottom: 1 }}>
                                Be the first to Review!
                            </Typography>
                        )}
                        <form onSubmit={(e) => onSubmit(e, restaurant.id, reviews[0] ? reviews[0].id : null )}>
                            <input
                                placeholder="Rate from 0-5"
                                value={rating}
                                onChange={(ev) => setRating(ev.target.value)}
                            />
                            <button>Add Rating</button>
                        </form>
                    </CardContent>
                </Card>
                {reviews.map((review, index) => {
                    return (
                        <Grid key={index}>
                            <Card>
                                <CardContent>
                                    <Typography align={'center'} variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Review {index + 1}:

                                    </Typography>
                                    <Typography align={'center'} variant="body1" sx={{ fontWeight: 'bold' }}>
                                        User: {review.userId}

                                    </Typography>
                                    <Typography align={'center'} variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Rating: {review.rating}
                                        <IconButton sx={{ color: yellow[500], margin: -4 }} >
                                            <StarIcon sx={{ padding: 4 }} />
                                        </IconButton>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </div>
    )
}