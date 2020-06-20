'use strict';

const
    express = require('express'),
    // i18n = require("./i18n.config"),
    bodyParser = require('body-parser'),
    config = require("./services/config"),
    Receive = require("./services/receive"),
    app = express().use(bodyParser.json());


// Check if all environment variables are set
config.checkEnvVariables();

// listen for requests :)
var listener = app.listen(config.port, function () {
    console.log("Your app is listening on port " + listener.address().port);

    if (
        config.appUrl &&
        config.verifyToken
    ) {
        console.log(
            "Is this the first time running?\n" +
            "Make sure to set the both the Messenger profile, persona " +
            "and webhook by visiting:\n" +
            config.appUrl +
            "/profile?mode=all&verify_token=" +
            config.verifyToken
        );
    }

    if (config.pageId) {
        console.log("Test your app by messaging:");
        console.log("https://m.me/" + config.pageId);
    }
});

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

    let body = req.body;
    // Checks if this is an event from a page subscription
    if (body.object == 'page') {

        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // if ("read" in webhook_event) {
            //     return;
            // }

            // if ("delivery" in webhook_event) {
            //     return;
            // }

            // let receiveMessage = new Receive(users[sender_psid], webhook_event);
            // return receiveMessage.handleMessage();
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        console.log(config.verifyToken);
        if (mode == 'subscribe' && token == config.verifyToken) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});



