const express = require('express');
const https = require('https');
const { Bot, Events } = require('viber-bot');
const dotenv = require('dotenv');
const fs = require('fs')
dotenv.config();

const botToken = process.env.TOKEN;
const port = process.env.PORT || 8080;
const webhookUrl = process.env.WEBHOOK_URL;

const cert = fs.readFileSync('./certs/certificate.crt');
const ca = fs.readFileSync('./certs/ca_bundle.crt');
const key = fs.readFileSync('./certs/private.key');

const bot = new Bot({
    authToken: botToken,
    name: "Bot",
    avatar: "https://t3.ftcdn.net/jpg/05/72/99/24/360_F_572992444_ryC0SVhHfXnEk5v1VGErH8WzXr4Y1n5y.jpg"
});

bot.on(Events.MESSAGE_RECEIVED, (message, response) => {
    response.send(message);
});

const app = express();
app.use('/viber/webhook', bot.middleware());

app.get('/hello', (req, res) => {
    console.log(123)
    res.send('Hello, this is the home page!');
});

https.createServer({ ca, cert, key }, app).listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
      bot.setWebhook(webhookUrl).catch((error) => {
        console.error(error);
      });
});