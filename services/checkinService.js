// services/checkinService.js

const axios = require("axios");

const {
  buildHeaders
} = require("./loginService");

const BASE_URL =
  "https://ez-co-app.tin.group";

/*
|--------------------------------------------------------------------------
| CALCULATE DISTANCE
|--------------------------------------------------------------------------
*/

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const R = 6371e3;

  const toRad =
    deg => deg * Math.PI / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);

  const Δφ =
    toRad(lat2 - lat1);

  const Δλ =
    toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) *
    Math.sin(Δφ / 2) +

    Math.cos(φ1) *
    Math.cos(φ2) *

    Math.sin(Δλ / 2) *
    Math.sin(Δλ / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

/*
|--------------------------------------------------------------------------
| BUILD CHECKIN PAYLOAD
|--------------------------------------------------------------------------
*/

function buildCheckinPayload({

  addressContent,
  addressId,

  addressLatitude,
  addressLongitude,

  imageUrl,
  taskId,

  type = 0

}) {

  const latitude =
    addressLatitude;

  const longitude =
    addressLongitude;

  const distance =
    calculateDistance(
      latitude,
      longitude,
      addressLatitude,
      addressLongitude
    );

  return {

    addressContent,

    // FIX
    addressId:
      String(addressId),

    addressLatitude,
    addressLongitude,

    latitude,
    longitude,

    distance:
      distance.toString(),

    imageUrl,

    taskId:
      String(taskId),

    type

  };
}

/*
|--------------------------------------------------------------------------
| ADD CHECKIN
|--------------------------------------------------------------------------
*/

async function addCheckin(
  cookie,
  payload
) {

  try {

    console.log(
      "CHECKIN PAYLOAD:",
      payload
    );

    const response =
      await axios.post(
        `${BASE_URL}/app/offline/checkin`,
        payload,
        {
          headers:
            buildHeaders(cookie)
        }
      );

    return {
      success: true,
      data:
        response.data,
    };

  } catch (err) {

    console.log(
      "CHECKIN ERROR:",
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

/*
|--------------------------------------------------------------------------
| AUTO CHECKIN
|--------------------------------------------------------------------------
*/

async function autoCheckin({

  cookie,

  addressContent,
  addressId,

  addressLatitude,
  addressLongitude,

  imageUrl,
  taskId,

  type = 0

}) {

  try {

    const payload =
      buildCheckinPayload({

        addressContent,
        addressId,

        addressLatitude,
        addressLongitude,

        imageUrl,
        taskId,

        type

      });

    return await addCheckin(
      cookie,
      payload
    );

  } catch (err) {

    return {
      success: false,
      message:
        err.message
    };

  }
}

module.exports = {
  calculateDistance,
  buildCheckinPayload,
  addCheckin,
  autoCheckin
};
