const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();
const redis = require('redis');
const client = redis.createClient();
const weather_api_key = process.env.weather_api_key;

const weatherRouter = express.Router();

weatherRouter.get('/:city', async (req, res) => {
    const { city } = req.params;
    await client.connect();
    if (!city) res.send({ msg: "Please Provide City Name." });
    else {
        try {
            let IsweatherData_Present = await client.get(city);

            if (IsweatherData_Present) {
                res.send(IsweatherData_Present)
                await client.disconnect();
            }
            else {
                let response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${weather_api_key}&q=${city}&aqi=yes`)
                let weatherData = await response.json();
                // 
                await client.set(`${city}`, JSON.stringify(weatherData), {
                    EX: 1800,
                    NX: true
                });
                await client.disconnect();
                res.send(weatherData)
            }
            // console.log(data)
        } catch (err) {
            // ClosedClient Error
            console.log(err);
            res.send({ err: err.message })
        }
    }
});


module.exports = weatherRouter;