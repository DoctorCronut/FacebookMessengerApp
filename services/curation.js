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
                if (response.title == i18n.curation.brands[0]) localStorage.setItem("brand", i18n.curation.brands[0]); 
                if (response.title == i18n.curation.brands[1]) localStorage.setItem("brand", i18n.curation.brands[1]);
                if (response.title == i18n.curation.brands[2]) localStorage.setItem("brand", i18n.curation.brands[2]);
                if (response.title == i18n.curation.brands[3]) localStorage.setItem("brand", i18n.curation.brands[3]);
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
                if (response.title == i18n.curation.classes[0]) localStorage.setItem("class", i18n.curation.classes[0]);
                if (response.title == i18n.curation.classes[1]) localStorage.setItem("class", i18n.curation.classes[1]);
                if (response.title == i18n.curation.classes[2]) localStorage.setItem("class", i18n.curation.classes[2]);
                if (response.title == i18n.curation.classes[3]) localStorage.setItem("class", i18n.curation.classes[3]);
                if (response.title == i18n.curation.classes[4]) localStorage.setItem("class", i18n.curation.classes[4]);
                if (response.title == i18n.curation.classes[5]) localStorage.setItem("class", i18n.curation.classes[5]);
                if (response.title == i18n.curation.classes[6]) localStorage.setItem("class", i18n.curation.classes[6]);
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
                if (response.title == i18n.curation.prices[0]) localStorage.setItem("prices", i18n.curation.prices[0]);
                if (response.title == i18n.curation.prices[1]) localStorage.setItem("prices", i18n.curation.prices[1]);
                if (response.title == i18n.curation.prices[2]) localStorage.setItem("prices", i18n.curation.prices[2]);
                if (response.title == i18n.curation.prices[3]) localStorage.setItem("prices", i18n.curation.prices[3]);
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
                if (response.title == i18n.curation.spd_range[0]) localStorage.setItem("speed", i18n.curation.spd_range[0]);
                if (response.title == i18n.curation.spd_range[1]) localStorage.setItem("speed", i18n.curation.spd_range[1]);
                if (response.title == i18n.curation.spd_range[2]) localStorage.setItem("speed", i18n.curation.spd_range[2]);
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
                if (response.title == i18n.curation.mpg_range[0]) localStorage.setItem("mpg", i18n.curation.mpg_range[0]);
                if (response.title == i18n.curation.mpg_range[1]) localStorage.setItem("mpg", i18n.curation.mpg_range[1]);
                if (response.title == i18n.curation.mpg_range[2]) localStorage.setItem("mpg", i18n.curation.mpg_range[2]);
                if (response.title == i18n.curation.mpg_range[3]) localStorage.setItem("mpg", i18n.curation.mpg_range[3]);
                if (response.title == i18n.curation.mpg_range[4]) localStorage.setItem("mpg", i18n.curation.mpg_range[4]);
                break;

            case "CURATION_RESULT":
                let brand_name = localStorage.getItem("brand");
                let class_name = localStorage.getItem("class");
                let car_price = localStorage.getItem("prices");
                let car_speed = localStorage.getItem("speed");
                let car_mpg = localStorage.getItem("mpg");
                console.log(brand_name);
                console.log(class_name);
                console.log(car_price);
                console.log(car_speed);
                console.log(car_mpg);
                response = this.genCurationResponse(payload);
                break;

            case "CURATION_OTHER":
                break;

            case "CURATION_RANDOM":
                console.log("reached");
                let model = this.randomModel();
                let model_str = `${model.Make} ${model.Model}`;
                let buttons = [
                    Response.genPostbackButton(
                        "Yes",
                        "END"
                    ),
                    Response.genPostbackButton(
                        i18n.curation.show,
                        "CURATION_RANDOM"
                    )
                ]
                response = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": [{
                                "title": `${model_str}`,
                                "subtitle": "Do you like this car?",
                                buttons
                            }]
                        }
                    }
                }
                break;
        }
        return response;
    }

    genCurationResponse(payload) {
        // let occasion = payload.split("_")[3].toLowerCase();
        // let budget = payload.split("_")[2].toLowerCase();
        // let outfit = `${this.user.gender}-${occasion}`;

        let buttons = [
            Response.genPostbackButton(
                "Yes",
                "END"
            ),
            Response.genPostbackButton(
                i18n.curation.show,
                "CURATION_OTHER"
            )
        ];

        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "filler",
                        "subtitle": "Do you like this car?",
                        buttons
                    }]
                }
            }
        }

        return response;
    }

    randomModel() {
        let occasion = car_data;
        let randomIndex = Math.floor(Math.random() * occasion.length);

        return occasion[randomIndex];
    }
}