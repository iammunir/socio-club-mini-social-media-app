const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

const mongo_uri = process.env.MONGO_URI;
mongoose.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('connected to database!'))
    .catch(() => console.log('connection is failed'));

// parsing the body content
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// to map the request for images
app.use('/images', express.static(path.join('backend/images')));

// to pass the CORS policy
app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

    next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;