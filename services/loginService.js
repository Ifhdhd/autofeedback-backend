// services/loginService.js

const axios = require("axios");

async function login({
  username,
  password,
  type
}) {

  try {

    /*
    |--------------------------------------------------------------------------
    | LOGIN API
    |--------------------------------------------------------------------------
    */

    const response =
      await axios.post(
        "https://ez-co-app.tin.group/app/login",
        {

          /*
          |------------------------------------------------------------------
          | USERNAME
          |------------------------------------------------------------------
          */

          account: username,

          /*
          |------------------------------------------------------------------
          | PASSWORD
          |------------------------------------------------------------------
          | PASSWORD SUDAH MD5 DARI auth.js
          */

          password: password,

          /*
          |------------------------------------------------------------------
          | TYPE
          |------------------------------------------------------------------
          | 1 = zizhangyi
          | 0 = non zizhangyi
          */

          type: type || 0

        },
        {

          headers: {

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
              "okhttp/4.9.2"

          }

        }
      );

    /*
    |--------------------------------------------------------------------------
    | COOKIE
    |--------------------------------------------------------------------------
    */

    const cookies =
      response.headers["set-cookie"] || [];

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    return {

      success: true,

      data: {

        user:
          response.data,

        cookies

      }

    };

  } catch (err) {

    /*
    |--------------------------------------------------------------------------
    | FAILED
    |--------------------------------------------------------------------------
    */

    return {

      success: false,

      message:
        err?.response?.data?.message ||
        err.message

    };

  }

}

module.exports = {
  login
};