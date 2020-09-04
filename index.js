const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.y5ewu.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.use(express.json())

app.get('/api/urls', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.send(shortUrls);
})

app.post('/api/shortUrl', async (req, res) => {
    await ShortUrl.create({
        fullUrl: req.body.originalUrl
    }).then((response) => {
        res.send(response);
    })
})

app.get('/api/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl });

    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.fullUrl);
    
    // Use Below For Development
    // res.send(shortUrl.fullUrl);
})

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname + '/client/build/index.html'));
    })
}

app.listen(PORT);