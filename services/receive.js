"use strict";

const
    Curation = require("./curation"),
    Response = require("./response"),
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
                if (message.quick_reply) {
                    responses = this.handleQuickReply();
                } else if (message.attachments) {
                    responses = this.handleAttachmentMessage();
                } else if (message.text) {
                    responses = this.handleTextMessage();
                }
            } else {
                if (event.postback) {
                    responses = this.handlePostback();
                } else if (event.referral) {
                    responses = this.handleReferral();
                }
            }
        } catch (error) {
            console.error(error);
            responses = {
                text: 'An error has occured: \'${error}\'. We have been notified and \
        will fix the issue shortly!'
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
            '${this.webhookEvent.message.text} for ${this.user.psid}'
        );

        let greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");

        let message = this.webhookEvent.message.text.trim().toLowerCase();

        let response;

        if ((greeting && greeting.confidence > 0.8) ||
            message.includes("start over")) {
            response = Response.genNuxMessage(this.user);
        } else {
            response = [
                Response.genText(
                    i18n.fallback.any, {
                    message: this.webhookEvent.message.text
                }
                ),
                Response.genText(i18n.get_started.guidance),
                Response.genQuickReply(i18m.__("get_started.help"), [
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

    // I dont think we need to handle attachments for our app
    handleAttachmentMessage() {
        let response;

        // Get the attachment
        let attachment = this.webhookEvent.message.attachments[0];
        console.log("Received attachment:", `${attachment} for ${this.user.psid}`);

        response = Response.genQuickReply(i18n.fallback.attachment, [
            {
                title: i18n.menu.suggestion,
                payload: "CARE_HELP"
            },
            {
                title: i18n.menu.start_over,
                payload: "GET_STARTED"
            }
        ]);

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
        console.log("Received Payload:", '${payload} for ${this.user.psid}');

        this.callFBAEventsAPI(this.user.psid, payload);

        let response;

        if (
            payload == "GET_STARTED" ||
            payload == "DEVDOCS" ||
            payload == "GITHUB"
        ) {
            reponse = Response.genNuxMessage(this.user);
        } else if (payload.includes("CURATION") || payload.includes("COUPON")) {
            let curation = new Curation(this.user, this.webhookEvent);
            response = curation.handlePayload(payload);
        } else if (payload.includes("CHAT-PLUGIN")) {
            response = [
                Response.genText(i18n.chat_plugin.prompt),
                Response.genText(i18n.get_started.guidance)
            ];
        } else {
            response = {
                text: 'This is a default postback message for paylaod: ${payload}!'
            }
        }

        return response;
    }

    handlePrivateReply(type, object_id) {
        let welcomeMessage = i18n.get_started.welcome + " " +
            i18n.get_started.guidance + ". " +
            i18n.get_started.help;

        let response = Response.genQuickReply(welcomeMessage, [
            {
                title: i18n.menu.car_match,
                payload: "CURATION"
            },
            {
                title: i18n.menu.suggestion,
                payload: "CARE_HELP"
            }
        ]);

        let requestBody = {
            recipient: {
                [type]: object_id
            },
            message: response
        };

        callSendAPI(requestBody);
    }

    sendMessage(response, delay = 0) {
        // Check if there is delay in the response
        if ("delay" in response) {
            delay = response["delay"];
            delete response["delay"];
        }

        // Construct the message body
        let requestBody = {
            recipient: {
                id: this.user.psid
            },
            message: response
        };

        // Check if there is persona id in the response
        if ("persona_id" in response) {
            let persona_id = response["persona_id"];
            delete response["persona_id"];

            requestBody = {
                recipient: {
                    id: this.user.psid
                },
                message: response,
                persona_id: persona_id
            };
        }

        setTimeout(() => this.callSendAPI(requestBody), delay);
    }

    firstEntity(nlp, name) {
        return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
    }

    static callSendAPI(requestBody) {
        request(
            {
                uri: '${config.mPlatfom}/me/messages',
                qs: {
                    access_token: config.pageAccesToken
                },
                method: "POST",
                json: requestBody
            },
            error => {
                if (error) {
                    console.error("Unable to send message:", error);
                }
            }
        );
    }

    static callFBAEventsAPI(senderPsid, eventName) {
        // Construct the message body
        let requestBody = {
          event: "CUSTOM_APP_EVENTS",
          custom_events: JSON.stringify([
            {
              _eventName: "postback_payload",
              _value: eventName,
              _origin: "original_coast_clothing"
            }
          ]),
          advertiser_tracking_enabled: 1,
          application_tracking_enabled: 1,
          extinfo: JSON.stringify(["mb1"]),
          page_id: config.pageId,
          page_scoped_user_id: senderPsid
        };
    
        // Send the HTTP request to the Activities API
        request(
          {
            uri: `${config.mPlatfom}/${config.appId}/activities`,
            method: "POST",
            form: requestBody
          },
          error => {
            if (!error) {
              console.log(`FBA event '${eventName}'`);
            } else {
              console.error(`Unable to send FBA event '${eventName}':` + error);
            }
          }
        );
      }
};
