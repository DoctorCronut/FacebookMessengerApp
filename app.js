'use strict';

const
    express = require('express'),
    bodyParser = require('body-parser'),
    config = require("./services/config"),
    app = express().use(bodyParser.json());

var users = {};

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode == 'subscribe' && token == config.verifyToken) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

    let body = req.body;

    // Checks if this is an event from a page subscription
    if (body.object == 'page') {
        
        res.status(200).send('EVENT_RECEIVED');

        body.entry.forEach(function(entry) {
           let webhook_event = entry.messaging[0];
           console.log(webhook_event);

           let sender_psid = webhook_event.sender.id;
           console.log('Sender PSID: ' + sender_psid);

           if (webhook_event.message) {
               handleMessage(sender_psid, webhook_event.message);
           } else if (webhook_event.postback) {
               handlePostback(sender_psid, webhook_event.postback);
           }
        });
    } else {
        res.sendStatus(404);
    }
});

