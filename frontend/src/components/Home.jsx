import { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Typography, Card, CardMedia, CardContent, CardActions, IconButton, Snackbar, Alert, Button, Dialog, DialogTitle, DialogActions } from "@mui/material"
import StarIcon from '@mui/icons-material/Star'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { pink, yellow } from '@mui/material/colors'

export default function Home() {
    const [map, setMap] = useState(null);
    // map only changes state on initMap(). Everything else doesnt change the state of map. When you have a state variable in React that is an object and you change one of its keys, it does not change the state of the object itself, so it will not rerender the component.
    const [autocomplete, setAutocomplete] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [apiKey, setApiKey] = useState(null)
    const [clonedRestaurant, setClonedRestaurant] = useState(null)

    // Function to load Google Maps JavaScript API
    const getGooglePlacesApiKey = async () => {
        try {
            const response = await axios.get('http://localhost:3000/places-api/apiKey')
            setApiKey(response.data)
        } catch (error) {
            console.error('Error fetching Google Places API key:', error);
        }
    }

    getGooglePlacesApiKey()

    const loadMapScript = () => {
        if (apiKey) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.onload = initMap;
            document.body.appendChild(script);
        }
    };

    // Function to initialize the map
    const initMap = () => {
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 40.7128, lng: -74.0060 },
            zoom: 13,
        });
        setMap(map);

        const input = document.getElementById('location-input');
        const autocomplete = new window.google.maps.places.Autocomplete(input);
        setAutocomplete(autocomplete);
        
        window.google.maps.event.addListener(map, 'click', function (event) {
            // 'event' contains information about the right-click event
            const lat = event.latLng.lat()
            const lng = event.latLng.lng()
    
            map.setCenter({ lat, lng })
            setConfirmationDialogOpen(true)
        })
    };

    useEffect(() => {
        loadMapScript();
    }, [apiKey]);

    useEffect(() => {
        if (map && autocomplete) {
            const placesService = new window.google.maps.places.PlacesService(map);

            // Listen for changes in the selected location
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();

                if (!place.geometry) {
                    return;
                }

                // Center the map on the selected location
                map.setCenter(place.geometry.location);
                map.setZoom(17);

                // Search for nearby restaurants
                const request = {
                    location: place.geometry.location,
                    radius: 500,
                    type: ['restaurant'],
                };

                // Send a request to the Places API
                placesService.nearbySearch(request, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        const placesData = results.map((result) => getPlaceData(result.place_id))

                        Promise.all(placesData)
                            .then((placesData) => {
                                setRestaurants(placesData);
                                clearMarkers();
                                createMarkers(results, placesData);
                            })
                            .catch((error) => {
                                console.log(error)
                            });
                    }
                });


            });
        }
    }, [map, autocomplete]);

    // Function to clear existing markers
    const clearMarkers = () => {
        const markers = restaurants.map((restaurant) => restaurant.marker);
        markers.forEach((marker) => marker.setMap(null));
    };

    // Function to fetch place details from your server
    const getPlaceData = async (placeId) => {
        try {
            const response = await axios.get(`http://localhost:3000/places-api/details/${placeId}`);
            if (response.request.statusText === 'OK') {
                const restaurantDetails = response.data;
                if (restaurantDetails.photos && restaurantDetails.photos.length > 0) {
                    restaurantDetails.imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurantDetails.photos[0].photo_reference}&key=${apiKey}`
                  } else {
                    restaurantDetails.imageUrl = "https://cdn.discordapp.com/avatars/291316574667931648/1132b847935f2dd0e61eb04dc1f8be96.webp?size=96"
                  }
                return restaurantDetails
            }
        } catch (error) {
            throw error;
        }
    };

    // Function to create map markers with info windows
    const createMarkers = (results, placesData) => {
        // map over placesData situationally?
        const markers = results.map((result, index) => {
            const placeData = placesData[index]
            const marker = new google.maps.Marker({
                map,
                position: result.geometry.location,
                title: result.name,
            });

            const infoWindowContent = `
                <div>
                    <h1>${placeData.name}</h1>
                    <img src="${placeData.imageUrl}" alt="${placeData.name}" width="100" height="100">
                    <p>Rating: ${placeData.rating}</p>
                </div>
            `;

            const infoWindow = new window.google.maps.InfoWindow({
                content: infoWindowContent,
            });

            // Show info window when hovering over a marker
            marker.addListener('mouseover', () => {
                infoWindow.setContent(infoWindowContent)
                infoWindow.open(map, marker);
            });

            // Close the info window when moving the cursor out
            marker.addListener('mouseout', () => {
                infoWindow.close();
            });

            return { result, marker };
        });

        // Update the list of restaurants with markers
        setRestaurants(placesData.map((placeData, index) => ({ ...placeData, marker: markers[index].marker })));
    };

    // add to places I want to visit
    const addRestaurant = async (restaurant, isVisited) => {
        try {
            const clonedRestaurant = {
                name: restaurant.name,
                address: restaurant.formatted_address,
                imageUrl: restaurant.imageUrl,
                rating: restaurant.rating,
                googleUrl: restaurant.url,
                visited: isVisited
            }

            const response = await axios.post(
                "http://localhost:3000/api/user/addRestaurant",
                clonedRestaurant,
                {
                    headers: {
                        authorization: window.localStorage.getItem("token")
                    }
                }
            )

            if (response.status === 201) {
                console.log('added successfully')
                // add snackbar
            }
        } catch (error) {
            throw error
        }
    }

    // Function to initiate a nearby search at the specified location
    const performNearbySearch = (location) => {
        const placesService = new window.google.maps.places.PlacesService(map);

        const request = {
            location,
            radius: 500, // Adjust the radius as needed
            type: ['restaurant'],
        };

        // Send a request to the Places API
        placesService.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const placesData = results.map((result) => getPlaceData(result.place_id));

                Promise.all(placesData)
                    .then((placesData) => {
                        setRestaurants(placesData);
                        clearMarkers();
                        createMarkers(results, placesData);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    }

    // State to manage the confirmation dialog
    const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false)

    // Function to confirm and perform nearby search
    const handleConfirmNearbySearch = () => {
        performNearbySearch(map.center)
        setConfirmationDialogOpen(false)
    }

    return (
        <div className='fixed-container'>
            <input className='input' id="location-input" type="text" placeholder="Enter a location" />
            <p>Or left click on map too choose your own!</p>
            <Dialog
                open={isConfirmationDialogOpen}
                onClose={() => setConfirmationDialogOpen(false)}
            >
                <DialogTitle>Perform Nearby Search?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setConfirmationDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmNearbySearch} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <div className='container'>
                <div className='map'>
                    <div id="map" style={{ width: '95%', height: '100%' }}></div>
                </div>
                <div className='cards'>
                    <Grid container spacing={3}>
                        {restaurants.map((restaurant, index) => {
                            return (
                                <Grid key={index} item xs={3}>
                                    <Card>
                                        <CardMedia
                                            onClick={() => window.open(restaurant.url, '_blank')}
                                            sx={{ height: 100, width: '100%' }}
                                            image={restaurant.imageUrl}
                                        />
                                        <CardContent>
                                            <Typography align={'center'} variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {restaurant.name}
                                            </Typography>
                                            <Typography align={'center'} variant="body2">
                                                {restaurant.formatted_address}
                                            </Typography>
                                            <Typography align={'center'} sx={{ fontSize: 14, fontWeight: 'bold' }}>
                                                {restaurant.rating}/5
                                                <IconButton sx={{ color: yellow[500], margin: -4 }} >
                                                    <StarIcon sx={{ padding: 4 }} />
                                                </IconButton>
                                            </Typography>
                                            <Typography align={'center'} sx={{ fontSize: 14, fontWeight: 'bold', display: 'flex' }}>
                                                Add to Wishlist:
                                                <CardActions sx={{ marginTop: '-17px', marginBottom: '17px' }} >
                                                    <IconButton onClick={
                                                        () => addRestaurant(restaurant, false)
                                                    }>
                                                        <FavoriteIcon sx={{ color: pink[500] }} />
                                                    </IconButton>
                                                </CardActions>
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={
                                                    () => addRestaurant(restaurant, true)
                                                }
                                            >
                                                Add To Visited!
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </Grid>
                </div>
            </div>
        </div>
    );
}
