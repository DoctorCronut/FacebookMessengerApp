const i18n = require("i18n"),
  path = require("path");

i18n.configure({
  locales: [
    "en_US",
    "fr_FR",
    "es_ES",
    "es_LA",
    "pt_BR",
    "id_ID",
    "ar_AR",
    "de_DE",
    "it_IT",
    "ja_JP",
    "ko_KR",
    "ru_RU",
    "th_TH",
    "vi_VN",
    "zh_CN",
    "zh_HK",
    "zh_TW"
  ],
  defaultLocale: "en_US",
  directory: path.join(__dirname, "locales"),
  objectNotation: true,
  api: {
    __: "translate",
    __n: "translateN"
  }
});

module.exports = i18n;