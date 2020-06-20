const PAGE_ACCESS_TOKEN = 'EAAJ6dDA8aW8BANrRs3UY5ovI80nCtJ3FLva7UBLOBWeD7RfK4bMNFgZClXZBE2tv0NJ83xhOkiYOPNUZBf5y3w6CDlot7fHI5vsndfl2lH2WnIukVmvnStnJC0bxZBhiggGGlGxWeLc6wR4vHdmvltHtE91MaCoqJzsXqW3FWQZDZD';
const request = require('request');

'use strict';

// Imports dependencies and set up http server
const
    express = require('express'),
    config = require('./services/config'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
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

    // Checks this is an event from a page subscription
    if (body.object == 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the message. entry.messaging is an array, but
            // will only ever contian one message, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = "SHUBB"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode == 'subscribe' && token == VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Handles messages events
function handleMessage(sender_psid, received_message) {

    let response;

    // Checks if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
        }
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }

    // Send the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = {
            "text": "Check the next article?",
            "quick_replies": [{
                    "content_type": "text",
                    "title": "More stories",
                    "payload": "more stories"
                },
                {
                    "content_type": "text",
                    "title": "Sport",
                    "payload": "sport"
                },
                {
                    "content_type": "text",
                    "title": "Business",
                    "payload": "business"
                }
    
            ]
        };
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

// function getQuickReplies(sender_psid) {
    // console.log("in next function");
    // var quick_list = {
    //     "text": "Check the next article?",
    //     "quick_replies": [{
    //             "content_type": "text",
    //             "title": "More stories",
    //             "payload": "more stories"
    //         },
    //         {
    //             "content_type": "text",
    //             "title": "Sport",
    //             "payload": "sport"
    //         },
    //         {
    //             "content_type": "text",
    //             "title": "Business",
    //             "payload": "business"
    //         }

    //     ]
    // };
    // bot.getProfile(payload.sender.id, (err, profile) => {
    //     if (err) throw err
    //     text = quick_list;
    //     bot.sendMessage(payload.sender.id, text) {//this prints quick replies
    //         console.log("sending message");
    //     }
    // });
// }

// function sendQuickReply(sender_psid, response) {

//     let request_body = {
//         "recipient": {
//             "id": sender_psid
//         },
//         "messaging_type": "RESPONSE",
//         "message": {
//             "text": "Pick a color:",
//             "quick_replies": [
//                 {
//                     "content_type": "text",
//                     "title": "Red",
//                     "payload": response.payload,
//                     "image_url": "http://example.com/img/red.png"
//                 }, {
//                     "content_type": "text",
//                     "title": "Green",
//                     "payload": "<POSTBACK_PAYLOAD>",
//                     "image_url": "http://example.com/img/green.png"
//                 }
//             ]
//         }
//     }

//     request(
//         {
//             "uri": "https://graph.facebook.com/v2.6/me/messages?access_token=EAAJ6dDA8aW8BANrRs3UY5ovI80nCtJ3FLva7UBLOBWeD7RfK4bMNFgZClXZBE2tv0NJ83xhOkiYOPNUZBf5y3w6CDlot7fHI5vsndfl2lH2WnIukVmvnStnJC0bxZBhiggGGlGxWeLc6wR4vHdmvltHtE91MaCoqJzsXqW3FWQZDZD",
//             "qs": { "access_token": PAGE_ACCESS_TOKEN },
//             "method": "POST",
//             "json": request_body
//         }, (err, res, body) => {
//             if (!err) {
//                 console.log('message sent!')
//             } else {
//                 console.error("Unable to send message:" + err);
//             }
//         }
//     );
// }

// function sendNotification(sender_psid, response) {
//     let request_body = {
//         "recipient": {
//             "id": sender_psid
//         },
//         "message": {
//             "attachment": {
//                 "type": "template",
//                 "payload": {
//                     "template_type": "one_time_notif_req",
//                     "title": "<TITLE_TEXT>",
//                     "payload": "<USER_DEFINED_PAYLOAD>"
//                 }
//             }
//         }
//     }
// }