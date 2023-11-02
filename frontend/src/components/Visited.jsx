import isAuthenticated from './auth/IsAuthenticated'
import axios from 'axios'

import { Grid, Typography, Card, CardMedia, CardContent, CardActions, IconButton, Snackbar, Alert, Button } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import { useEffect, useState } from 'react'
import { yellow } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'

export default function Visited() {
    const isAuth = isAuthenticated()
    const [restaurants, setRestaurants] = useState([])
    
    const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(
                "http://localhost:3000/api/user/getRestaurants",
                {
                    headers: {
                        authorization: window.localStorage.getItem("token")
                    }
                }
            )

            setRestaurants(response.data)
        }

        getData()
    }, [])

    const setNotVisited = async (restaurant) => {
        try {
            const response = await axios.patch(`http://localhost:3000/api/user/setNotVisited/${restaurant.id}`,
                {},
                {
                    headers: {
                        authorization: window.localStorage.getItem("token")
                    }
                }
            )

            if (response.status === 200) {
                const updatedRestaurants = restaurants.filter((r) => r.id !== restaurant.id);
                setRestaurants(updatedRestaurants)
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    const viewUsersReviews = async (restaurantId) => {
        navigate(`/restaurant/${restaurantId}/reviews`)
    }

    return (
        <div>
            <Grid container spacing={3}>
                {restaurants.map((restaurant, index) => {
                    if (restaurant.visited === true) {
                        return (
                            <Grid key={index} item xs={2}>
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
                                        <Typography align={'center'} sx={{ fontSize: 14, fontWeight: 'bold' }}>
                                            {restaurant.rating}/5
                                            <IconButton sx={{ color: yellow[500], margin: -4 }} >
                                                <StarIcon sx={{ padding: 4 }} />
                                            </IconButton>
                                        </Typography>
                                        {restaurant.userRating[0] ? (
                                            <Typography align={'center'} sx={{ fontSize: 14, fontWeight: 'bold' }}>
                                                My Rating: {restaurant.userRating[0].rating}/5
                                                <IconButton sx={{ color: yellow[500], margin: -4 }} >
                                                    <StarIcon sx={{ padding: 4 }} />
                                                </IconButton>
                                            </Typography>
                                        ) : null}
                                        <Button
                                            sx={{ marginBottom: 1 }}
                                            variant="contained"
                                            color="primary"
                                            onClick={
                                                () => viewUsersReviews(restaurant.id)
                                            }
                                        >
                                            View Users Reviews
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={
                                                () => setNotVisited(restaurant)
                                            }
                                        >
                                            Remove from Visited
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    }
                })}
            </Grid>
        </div>
    );
}