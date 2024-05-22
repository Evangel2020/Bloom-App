const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 5000;
const {router} = require('./routes/rts');
require('dotenv').config();

app.use(cors());
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Routes
app.use('/', router)

// Start server
app.listen(port, function(){
    console.log(`Server is running on port ${port}`)
})

