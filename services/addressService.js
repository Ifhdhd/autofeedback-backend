// services/addressService.js

const axios = require("axios");

const {
  buildHeaders
} = require("./loginService");

const BASE_URL =
  "https://ez-co-app.tin.group";

/*
|--------------------------------------------------------------------------
| QUERY TASK ADDRESS
|--------------------------------------------------------------------------
*/

async function queryTaskAddress(
  cookie,
  taskId
) {

  try {

    const response =
      await axios.get(
        `${BASE_URL}/app/offline/task/queryTaskAddress?taskId=${taskId}`,
        {
          headers:
            buildHeaders(cookie)
        }
      );

    const addresses =
      response.data?.data || [];

    console.log(
      "QUERY TASK ADDRESS:",
      JSON.stringify(
        addresses,
        null,
        2
      )
    );

    return {
      success: true,
      total:
        addresses.length,
      data:
        addresses
    };

  } catch (err) {

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
| GET PRIMARY ADDRESS
|--------------------------------------------------------------------------
*/

async function getPrimaryAddress(
  cookie,
  taskId
) {

  try {

    const result =
      await queryTaskAddress(
        cookie,
        taskId
      );

    if (!result.success) {
      return result;
    }

    const address =
      result.data[0];

    if (!address) {

      return {
        success: false,
        message:
          "Address not found"
      };

    }

    console.log(
      "PRIMARY ADDRESS:",
      JSON.stringify(
        address,
        null,
        2
      )
    );

    return {
      success: true,
      data: address
    };

  } catch (err) {

    return {
      success: false,
      message:
        err.message
    };

  }
}

/*
|--------------------------------------------------------------------------
| FORMAT ADDRESS
|--------------------------------------------------------------------------
*/

function buildAddressString(
  address
) {

  return `
    ${address.street || ""}
    ${address.district || ""}
    ${address.city || ""}
    ${address.province || ""}
  `
    .replace(/\s+/g, " ")
    .trim();
}

/*
|--------------------------------------------------------------------------
| GET ADDRESS DETAIL
|--------------------------------------------------------------------------
*/

async function getAddressDetail(
  cookie,
  taskId
) {

  try {

    const result =
      await getPrimaryAddress(
        cookie,
        taskId
      );

    if (!result.success) {
      return result;
    }

    const address =
      result.data;

    /*
    |--------------------------------------------------------------------------
    | ADDRESS ID FIX
    |--------------------------------------------------------------------------
    */

    const addressId =
      Number(
        address.addressId ||
        address.id ||
        address.addrId ||
        address.address_id ||
        0
      );

    console.log(
      "ADDRESS ID:",
      addressId
    );

    return {

      success: true,

      data: {

        addressId,

        uid:
          address.uid,

        province:
          address.province,

        city:
          address.city,

        district:
          address.district,

        street:
          address.street,

        roomNumber:
          address.roomNumber,

        latitude:
          Number(
            address.latitude ||
            address.lat ||
            0
          ),

        longitude:
          Number(
            address.longitude ||
            address.lng ||
            address.lon ||
            0
          ),

        fullAddress:
          buildAddressString(
            address
          ),

        raw:
          address

      }

    };

  } catch (err) {

    return {
      success: false,
      message:
        err.message
    };

  }
}

module.exports = {

  queryTaskAddress,
  getPrimaryAddress,
  getAddressDetail,
  buildAddressString

};
