BACKEND - WEATHER APP

Weather Application

Make an weather application using Nodejs, Express, MongoDB, Redis etc.

<!-- Make sure that a user is logged in to use your weather application. -->

<!-- Maintain a blacklisting mechanism for managing logout and store the blacklisted tokens in Redis (not in an array in a file or somewhere in the server) -->

<!-- Have a meaningful endpoint to show current weather condition for a specific city given by the user. -->

<!-- Use any API such as OpenWeather API to retrieve the current weather conditions for a specific city. -->

Use MongoDB Atlas to store the user's preferred city, and their previous searchers in the DB.

Use Redis to cache the weather data. This way your application can quickly retrieve the weather data for a particular city without having to make a new API request, irrespective of the user, for a particular city.

Since weather is something that keeps changing, the weather data stored in Redis for a particular city should expire in 30 minutes.

Implement a mechanism to check if the data is already present in Redis before making an API call to weather API.

Use Winston for logging - log any errors in application to a collection in the DB.

Have a validation middleware which checks that the city passed by the user to get weather info is only a string and doesn't contain any numbers, special characters etc in it, so that you don't waste an API request to weather API with invalid city.

Since you are making your weather application free, implement a rate limiter which limits each user's IP to make only 1 request for weather per 3 minutes. (Explore any rate-limiter package)

Follow all the best practices, such as following the MVC structure, storing all secret things in .env, committing regularly with proper git messages, clean code, etc.

Deploy Backend