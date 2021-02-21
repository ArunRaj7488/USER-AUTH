const express = require('express');
const app =  express();
const config = require('config');

console.log(config);
if (!config.get("jwtPrivateKey")) {
    console.log("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
  }

// db 
require('./startup/db');

// routes
require('./startup/router')(app);

const port  = process.env.PORT || 3000;

app.listen( port, () => console.log(`App is Listening on port ${port}`))

