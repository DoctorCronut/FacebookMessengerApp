"use strict";

const
    Curation = require("./curation"),
    Response = require("./response"),
    request = require("request"),
    config = require("./config"),
    i18n = require("../locales/en_US.json");

module.exports = class Receive {
    constructor(user, webhookEvent) {
        this.user = user;
        this.webhookEvent = webhookEvent;
    }

    handleMessage() {
        let event = this.webhookEvent;

        let responses;

        try {
            if (event.message) {
                let message = event.message;
                if (message.quick_reply) {
                    responses = this.handleQuickReply();
                    console.log("reached");
                } else if (message.attachments) {
                    responses = this.handleAttachmentMessage();
                } else if (message.text) {
                    responses = this.handleTextMessage();
                }
            } else if (event.postback) {
                responses = this.handlePostback();
            } else if (event.referral) {
                responses = this.handleReferral();
            }

        } catch (error) {
            console.error(error);
            responses = {
                text: `An error has occured: \'${error}\'. We have been notified and will fix the issue shortly!`
            };
        }
        if (Array.isArray(responses)) {
            let delay = 0;
            for (let response of responses) {
                this.sendMessage(response, delay * 2000);
                delay++;
            }
        } else {
            this.sendMessage(responses);
        }
    }

    handleTextMessage() {
        console.log(
            "received text:",
            `${this.webhookEvent.message.text} for ${this.user.psid}`
        );

        let greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");

        let message = this.webhookEvent.message.text.trim().toLowerCase();

        let response;

        if ((greeting && greeting.confidence > 0.8) ||
            message.includes("start over")) {
            response = Response.genNuxMessage();
        } else {
            response = [
                Response.genText(
                    `Sorry, but I don’t recognize \"${this.webhookEvent.message.text}\".`
                ),
                Response.genText(i18n.get_started.guidance),
                Response.genQuickReply(i18n.get_started.help, [
                    {
                        title: i18n.menu.car_match,
                        payload: "CURATION"
                    },
                    {
                        title: i18n.menu.random,
                        payload: "CURATION_RANDOM"
                    }
                ])
            ];
        }

        return response;
    }

    handleQuickReply() {
        let payload = this.webhookEvent.message.quick_reply.payload;

        return this.handlePayload(payload);
    }

    handlePostback() {
        let postback = this.webhookEvent.postback;
        let payload;
        if (postback.referral && postback.referral.type == "OPEN_THREAD") {
            payload = postback.referral.ref;
        } else {
            payload = postback.payload;
        }
        return this.handlePayload(payload.toUpperCase());
    }

    handleReferral() {
        let payload = this.webhookEvent.referral.ref.toUpperCase();
        return this.handlePayload(payload);
    }

    handlePayload(payload) {
        console.log("Received Payload:", `${payload} for ${this.user.psid}`);

        let response;

        if (
            payload == "GET_STARTED" ||
            payload == "DEVDOCS" ||
            payload == "GITHUB"
        ) {
            reponse = Response.genNuxMessage();
        } else if (payload.includes("END")) {
            response = Response.genEndMessage();
        } else if (payload.includes("CURATION")) {
            console.log("Accessed");
            let curation = new Curation(this.user, this.webhookEvent);
            response = curation.handlePayload(payload);
            console.log("Set" + response);
        } else if (payload.includes("CHAT-PLUGIN")) {
            response = [
                Response.genText(i18n.chat_plugin.prompt),
                Response.genText(i18n.get_started.guidance)
            ];
        } else {
            response = {
                text: `This is a default postback message for payload: ${payload}!`
            }
        }

        return response;
    }

    sendMessage(response, delay = 0) {
        
        if ("delay" in response) {
            delay = response["delay"];
            delete response["delay"];
        }

        let requestBody = {
            recipient: {
                id: this.user.psid
            },
            message: response
        };
        
        setTimeout(() => callSendAPI(requestBody), delay);
    }


    firstEntity(nlp, name) {
        return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
    }
};

function callSendAPI(requestBody) {
    console.log(JSON.stringify(requestBody));
    request(
        {
            uri: "https://graph.facebook.com/v2.6/me/messages",
            qs: {
                access_token: 'EAAJ6dDA8aW8BAKKzLI7e7c9BfuiNkGDixRjKwhJvJZAID64JQG6wcFAn3R2nprOzbEZAFAaZC1F0gybAAmFruyeVhLbTl3ZBQpolwv4ZBnC7SWsgRhZBfEyzYPV1JnrToqFhh3AcbJoyhMUrofPIVl5dqoV2maxZA8wADcs9hLxMgZDZD'
            },
            method: "POST",
            json: requestBody
        },
        (error, res, body) => {
            if (error) {
                console.error("Unable to send message:", error);
            }
            else {
                console.log("message sent!");
            }
        }
    );
}