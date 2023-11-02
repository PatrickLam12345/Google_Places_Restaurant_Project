import isAuthenticated from './auth/IsAuthenticated'
import axios from 'axios'

import { Grid, Typography, Card, CardMedia, CardContent, CardActions, IconButton, Snackbar, Alert, Button } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import { useEffect, useState } from 'react'
import { yellow } from '@mui/material/colors'

export default function Wishlist() {
    const isAuth = isAuthenticated()
    const [isHovered, setIsHovered] = useState(false)
    const [restaurants, setRestaurants] = useState([])

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

    const removeFromWishlist = async (restaurant) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/user/removeRestaurant/${restaurant.id}`,
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

    const setVisited = async (restaurant) => {
        try {
            const response = await axios.patch(`http://localhost:3000/api/user/setVisited/${restaurant.id}`,
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

    return (
        <div>
            <Grid container spacing={3}>
                {restaurants.map((restaurant, index) => {
                    if (restaurant.visited === false) {
                        return (
                            <Grid key={index} item xs={2}>
                                <Card style={{ position: 'relative' }}>
                                    <CardMedia
                                        onClick={() => window.open(restaurant.googleUrl, '_blank')}
                                        sx={{ height: 100, width: '100%' }}
                                        image={restaurant.imageUrl}
                                    />
                                    <CardContent >
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
                                        <CardActions
                                            style={{ justifyContent: 'center' }}
                                        >
                                            <IconButton style={{ position: 'absolute', top: 0, right: 0, color: 'black' }}
                                                onMouseEnter={() => setIsHovered(true)}
                                                onMouseLeave={() => setIsHovered(false)}
                                                onClick={
                                                    () => removeFromWishlist(restaurant)
                                                }
                                            >
                                                {isHovered ? (
                                                    <CloseIcon sx={{
                                                        color: 'black',
                                                        backgroundColor: 'white',
                                                        borderRadius: '50%',
                                                        border: '2px solid black', // Add a border for the circular outline
                                                        padding: '2px', // Adjust padding to control the size of the icon
                                                    }} />
                                                ) : <CloseIcon sx={{ padding: '1px' }} />}
                                            </IconButton>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={
                                                    () => setVisited(restaurant)
                                                }
                                            >
                                                I have visited!
                                            </Button>
                                        </CardActions>
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