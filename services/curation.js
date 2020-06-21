"use strict";

const Response = require("./response"),
    config = require("./config"),
    car_data = require("../car_data/csvjson.json"),
    i18n = require("../locales/en_US.json");

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
                        i18nleadgen.promo, {
                        userFirstName: this.user.userFirstName
                    })
                ];
                break;
            case "CURATION":
                response = Response.genQuickReply(i18n.curation.brand, [
                    {
                        title: i18n.curation.brands[0],
                        payload: "CURATION_BRANDS"
                    },
                    {
                        title: i18n.curation.brands[1],
                        payload: "CURATION_BRANDS"
                    },
                    {
                        title: i18n.curation.brands[2],
                        payload: "CURATION_BRANDS"
                    },
                    {
                        title: i18n.curation.brands[3],
                        payload: "CURATION_BRANDS"
                    }

                ]);
                break;
            case "CURATION_BRANDS":
                response = Response.genQuickReply(i18n.curation.class, [
                    {
                        title: i18n.curation.classes[0],
                        payload: "CURATION_FOR_CLASSES"
                    },
                    {
                        title: i18n.curation.classes[1],
                        payload: "CURATION_FOR_CLASSES"
                    },
                    {
                        title: i18n.curation.classes[2],
                        payload: "CURATION_FOR_CLASSES"
                    },
                    {
                        title: i18n.curation.classes[3],
                        payload: "CURATION_FOR_CLASSES"
                    },
                    {
                        title: i18n.curation.classes[4],
                        payload: "CURATION_FOR_CLASSES"
                    },
                    {
                        title: i18n.curation.classes[5],
                        payload: "CURATION_FOR_CLASSES"
                    },
                    {
                        title: i18n.curation.classes[6],
                        payload: "CURATION_FOR_CLASSES"
                    }
                ]);
                break;
            case "CURATION_FOR_CLASSES":
                response = Response.genQuickReply(i18n.curation.price_range, [
                    {
                        title: i18n.curation.prices[0],
                        payload: "CURATION_PRICES"
                    },
                    {
                        title: i18n.curation.prices[1],
                        payload: "CURATION_PRICES"
                    },
                    {
                        title: i18n.curation.prices[2],
                        payload: "CURATION_PRICES"
                    },
                    {
                        title: i18n.curation.prices[3],
                        payload: "CURATION_PRICES"
                    }
                ]);
                break;
            case "CURATION_PRICES":
                response = Response.genQuickReply(i18n.curation.speed, [
                    {
                        title: i18n.curation.spd_range[0],
                        payload: "CURATION_SPEED"
                    },
                    {
                        title: i18n.curation.spd_range[1],
                        payload: "CURATION_SPEED"
                    },
                    {
                        title: i18n.curation.spd_range[2],
                        payload: "CURATION_SPEED"
                    }
                ]);
                break;
            case "CURATION_SPEED":
                response = Response.genQuickReply(i18n.curation.miles, [
                    {
                        title: i18n.curation.mpg_range[0],
                        payload: "CURATION_RESULT"
                    },
                    {
                        title: i18n.curation.mpg_range[1],
                        payload: "CURATION_RESULT"
                    },
                    {
                        title: i18n.curation.mpg_range[2],
                        payload: "CURATION_RESULT"
                    },
                    {
                        title: i18n.curation.mpg_range[3],
                        payload: "CURATION_RESULT"
                    },
                    {
                        title: i18n.curation.mpg_range[4],
                        payload: "CURATION_RESULT"
                    }
                ]);
                break;
                
            case "CURATION_RESULT":
                response = this.genCurationResponse(payload);
                break;

            case "CURATION_RANDOM":
                response = this.randomModel();
                break;
        }
        return response;
    }

    genCurationResponse(payload) {
        let occasion = payload.split("_")[3].toLowerCase();
        let budget = payload.split("_")[2].toLowerCase();
        let outfit = `${this.user.gender}-${occasion}`;

        let buttons = [
            Response.genWebUrlButton(
                i18n.curation.shop,
                `${config.shopUrl}/products/${outfit}`
            ),
            Response.genPostbackButton(
                i18n.curation.show,
                "CURATION_OTHER_STYLE"
            )
        ];

        if (budget === "50") {
            buttons.push(
                Response.genPostbackButton(curation.sales, "CARE_SALES")
            );
        }

        let response = Response.genGenericTemplate(
            `${config.appUrl}/styles/${outfit}.jpg`,
            i18n.__("curation.title"),
            i18n.__("curation.subtitle"),
            buttons
        );

        return response;
    }

    randomModel() {
        let occasion = car_data;
        let randomIndex = Math.floor(Math.random() * occasion.length);

        return occasion[randomIndex];
    }
}