require('dotenv').config()

const express = require("express")
const cors = require("cors")
const axios = require("axios")
const app = express()
app.use(cors())
app.use(express.json())

// Authentication
const authRoutes = require('./src/routes/authRoutes')
app.use('/api/auth', authRoutes)

// User api calls/requests
const userRoutes = require('./src/routes/userRoutes')
app.use("/api/user", userRoutes)

// Google Places API
app.get('/places-api/details/:placeId', async (req, res) => {
    const placeId = req.params.placeId;
    
    const fields = ['name', 'formatted_address', 'photos', 'rating', 'url']
    // Make an Axios GET request to the Google Places API
    try {
        const response = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
            params: {
                placeid: placeId,
                key: process.env.GOOGLE_PLACES_API_KEY,
                fields: fields.join(',')
            }
        });
        if (response.data.status === 'OK') {
            res.json(response.data.result);
        } else {
            res.status(500).json({ error: 'Place details request failed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Request to Google Places API failed' });
    }
});

app.get("/places-api/apiKey", async (req, res) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    res.send(apiKey)
})

// Error handling
app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`)
})