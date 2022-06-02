 //server configuration file 
 //#lightweight npm package that automatically loads environment variables from a .env file   
require('dotenv').config({path:__dirname.replace('server','')+'.env'});

//access the enviornment variables
// Initializing the express and port number
const PORT = process.env.PORT || 5000;
const express = require('express');
//Router of api
const routes = require('../routes/index');
//it allows to setup middleware to respond http requests
const server = express();
// Calling the express.json() method for parsing
server.use(express.json());
//will load the routes from routes/index.js
server.use('/api', routes);
if (process.env.NODE_ENV !== 'test') 
    server.listen(PORT, () => console.log(`Server is live at localhost:${PORT}`));

    
module.exports = server;