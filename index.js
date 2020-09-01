const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const password = process.env.MONGO_DB_PASSWORD || '';

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

    res.send(shortUrl.fullUrl);
})

app.listen(PORT);