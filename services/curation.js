"use strict";

const Response = require("./response"),
    config = require("./config"),
    i18n = require("../i18n.config");

module.exports = class Curation {
    constructor(user, webhookEvent) {
        this.user = user;
        this.webhookEvents = webhookEvent;
    }
    handlePayload(payload) {
        let response;
        let outfit;

        switch (payload) {
            case "PROMO":
                response = [
                    Response.genText(
                        i18n.__("leadgen.promo", {
                            userFirstName: this.user.userFirstName
                        })
                    )
                ];
                break;
            case "CURATION":
                response = Response.genQuickReply(i18n.__("curation.prompt"), [
                    {
                        title: i18n.__("curation.classes[0]")
                    }
                ])
        }
    }
}