"use strict";

const i18n = require("../locales/en_US.json");

module.exports = class Response {
    static genQuickReply(text, quickReplies) {
        let response = {
            text: text,
            quick_replies: []
        };

        for (let quickReply of quickReplies) {
            response["quick_replies"].push({
                content_type: "text",
                title: quickReply["title"],
                payload: quickReply["payload"]
            });
        }

        return response;
    }

    static genGenericTemplate(image_url, title, subtitle, buttons) {
        let response = {
            attachment: {
                type: "template",
                payload: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [
                            {
                                title: title,
                                subtitle: subtitle,
                                image_url: image_url,
                                buttons: buttons
                            }
                        ]
                    }
                }
            }
        };

        return response;
    }

    static genImageTemplate(image_url, title, subtitle = "") {
        let response = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: title,
                            subtitle: subtitle,
                            image_url: image_url
                        }
                    ]
                }
            }
        };

        return response;
    }

    static genButtonTemplate(title, buttons) {
        let response = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: title,
                    buttons: buttons
                }
            }
        };

        return response;
    }

    static genText(text) {
        let response = {
            text: text
        };

        return response;
    }

    static genPostbackButton(title, payload) {
        let response = {
            type: "postback",
            title: title,
            payload: payload
        };
        return response;
    }

    static genWebUrlButton(title, url) {
        let response = {
            type: "web_url",
            title: title,
            url: url,
            messenger_extensions: true
        };

        return response;
    }

    static genNuxMessage(user) {
        let welcome = this.genText(
            "Hi! Welcome to Japanese Car Match!",
        );

        let guide = this.genText(i18n.get_started.guidance);

        let curation = this.genQuickReply(i18n.get_started.help, [
            {
                title: i18n.menu.car_match,
                payload: "CURATION"
            },
            {
                title: i18n.menu.random,
                payload: "CURATION_RANDOM"
            }
        ]);

        return [welcome, guide, curation];
    }
}