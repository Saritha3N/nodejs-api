    
var values = require('dotenv').config({path:__dirname.replace('server','')+'.env'});
//console.log(values);

const PORT = process.env.PORT || 7000;
const express = require('express');
const routes = require('../routes/index');
const server = express();
server.use(express.json());
server.use('/api', routes);
module.exports = server;
if (process.env.NODE_ENV !== 'test') 
    server.listen(PORT, () => console.log(`Server is live at localhost:${PORT}`));