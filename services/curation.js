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
                console.log(qualities);
                let maker = qualities[1];
                let car_class = qualities[2];
                let c_price = qualities[3];
                let c_spd = qualities[4];
                let c_mpg = qualities[5];
                processCarData(maker, car_class, c_price, c_spd, c_mpg);
                response = this.genCurationResponse();
                break;

            case "CURATION_OTHER":
                response = this.genCurationResponse();
                break;

            case "CURATION_RANDOM":
                console.log("reached");
                let model = this.randomModel();
                let model_str = `${model.Make} ${model.Model} ${model.Classification}, $${model.AveragePrice}, 0-60Time: ${model["0-60Time"]}s, ${model.MPG}mpg`;
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

    genCurationResponse() {
        let response;
        if (matched_cars > 0) {
            let car = matched_cars[matched_cars.length - 1]
            let model_str = `${car.Make} ${car.Model} ${car.Classification}, $${car.AveragePrice}, 0-60Time: ${car["0-60Time"]}s, ${car.MPG}mpg`;
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
                            "title": model_str,
                            "subtitle": "Do you like this car?",
                            buttons
                        }]
                    }
                }
            }
            matched_cars.pop();
        } else {
            response = [
                Response.genText("Sorry, no matches found for your specified preferences. Type start over to try again!")
            ];
        }
        return response;
    }

    randomModel() {
        let cars = car_data;
        let randomIndex = Math.floor(Math.random() * cars.length);

        return cars[randomIndex];
    }
}

function processCarData(brand, c_class, price, spd, mpg) {
    let cars = car_data;
    let prices = price.split(" ");
    let spds = spd.split(" ");
    let mpgs;
    if (mpg != "electric") mpgs = mpg.split(" ");
    let price_low, price_high, spd_low, spd_high, mpg_low, mpg_high = 0;

    if (prices[0] == "15k") {
        price_low = 15000;
        price_high = 25000;
    } else if (prices[0] == "25k") {
        price_low = 25000;
        price_high = 35000;
    } else if (prices[0] == "35k") {
        price_low = 35000;
        price_high = 45000;
    } else if (prices[0] == "45k") {
        price_low = 45000;
    }

    if (spds[0] == "2.5s") {
        spd_low = 2.5;
        spd_high = 6.25;
    } else if (spds[0] == "6.25s") {
        spd_low = 6.25;
        spd_high = 10;
    } else if (spds[0] == "10s") {
        spd_low = 10;
    }

    if (mpgs[0] == "15") {
        mpg_low = 15;
        mpg_high = 28.75;
    } else if (mpgs[0] == "28.75") {
        mpg_low = 28.75;
        mpg_high = 42.5;
    } else if (mpgs[0] == "42.5") {
        mpg_low = 42.5;
        mpg_high = 56.25;
    } else if (mpgs[0] == "56.25") {
        mpg_low = 56.25;
    }

    for (var i = 0; i < cars.length; i++) {
        var car = cars[i];
        console.log("-------------------------------------------------------");
        console.log(car.Make);
        console.log(car.Model);
        console.log(car.Classification);
        console.log(car.AveragePrice);
        console.log(car.MPG);
        console.log(car["0-60Time"]);
        console.log("-------------------------------------------------------");
        if (car.Make === brand) {
            matched_cars.push(car);
            // if (car.Classification === c_class) {
            //     if (car.AveragePrice >= price_low && (car.AveragePrice <= price_high || price_high === 0)) {
            //         if ((mpg === "electric" && car.MPG === "electric") || (car.MPG >= mpg_low && car.MPG <= mpg_high || (mpg_high === 0 && mpg_low != 0))) {
            //             if (car["0-60Time"] >= spd_low && (car["0-60Time"] <= spd_high || spd_high === 0)) {
            //                 matched_cars.push(car);
            //             }
            //         }
            //     }
            // }
            console.log(cars);
        }
    }

}