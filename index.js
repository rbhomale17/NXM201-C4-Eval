const express = require('express');
const app = express();
const redis = require('redis');
const connection = require('./config/db');
const userRouter = require('./routes/users.router');
var cookieParser = require('cookie-parser');
const weatherRouter = require('./routes/weather.routes');

const rateLimit = require('express-rate-limit')

app.use(cookieParser())
require('dotenv').config();
const port = process.env.port | 4500

const client = redis.createClient();

app.use(express.json());

const limiter = rateLimit({
	windowMs: 3 * 60 * 1000, // 3 minutes
	max: 1, // Limit each IP to 1 request per `window` (here, per 3 minutes)
})

app.use(limiter)

app.get('/',(req,res)=>{
    res.send("connected to Server")
})





app.use('/users',userRouter);
app.use('/getweather',weatherRouter) // try search Wardha, Nagpur in req.Params

app.listen(port,async()=>{
    try {
        await connection;
        console.log('connected to DB');
        await client.connect()
        console.log('connected to Redis')
    } catch (error) {
        console.log(error);
        console.log('failed to connect DB');
    }  
    console.log('server running at http://localhost:'+port)
})
