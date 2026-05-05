// services/loginService.js

const axios = require("axios");
const md5 = require("md5");

/*
|--------------------------------------------------------------------------
| BUILD HEADERS
|--------------------------------------------------------------------------
*/

function buildHeaders(cookie = "") {

  return {

    "Content-Type": "application/json",

    "X-DESENSITIZE": "true",

    "X-COUNTRY-ID": "1",

    countryCode: "ID",

    timeZoneId: "Asia/Jakarta",

    country: "ID",

    "Accept-Language": "in-ID",

    deviceId:
      "ffffffff-a665-1a66-0000-0000748ca5f0",

    deviceModel: "5030U",

    osVersion: "10",

    versionCode: "122",

    versionName: "2.9.2-release",

    "User-Agent":
      "okhttp/4.9.2",

    Cookie: cookie

  };

}

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

async function login({

  account,

  password,

  appVersion = "0"

}) {

  try {

    /*
    |--------------------------------------------------------------------------
    | PASSWORD MD5
    |--------------------------------------------------------------------------
    */

    const pwd = md5(password);

    /*
    |--------------------------------------------------------------------------
    | LOGIN API
    |--------------------------------------------------------------------------
    */

    const response =
      await axios.post(

        "https://ez-co-app.tin.group/app/offline/user/login",

        {

          account,

          pwd,

          appVersion

        },

        {

          headers:
            buildHeaders()

        }

      );

    /*
    |--------------------------------------------------------------------------
    | GET COOKIES
    |--------------------------------------------------------------------------
    */

    const rawCookies =
      response.headers["set-cookie"] || [];

    let SESSION = "";

    let acw_tc = "";

    rawCookies.forEach(cookie => {

      if (
        cookie.includes("SESSION=")
      ) {

        SESSION =
          cookie
            .split("SESSION=")[1]
            .split(";")[0];

      }

      if (
        cookie.includes("acw_tc=")
      ) {

        acw_tc =
          cookie
            .split("acw_tc=")[1]
            .split(";")[0];

      }

    });

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    return {

      success: true,

      message:
        "Login berhasil",

      data:
        response.data.data,

      raw:
        response.data,

      cookies: {

        SESSION,

        acw_tc

      }

    };

  } catch (err) {

    console.log(
      "LOGIN ERROR:",
      err.response?.data ||
      err.message
    );

    return {

      success: false,

      message:
        err.response?.data ||
        err.message

    };

  }

}

module.exports = {

  login,

  buildHeaders

};
