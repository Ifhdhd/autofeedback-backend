const axios = require("axios");
const { buildHeaders } = require("./loginService");

const BASE_URL = "https://ez-co-app.tin.group";

/*
|--------------------------------------------------------------------------
| QUERY TASK ADDRESS
|--------------------------------------------------------------------------
*/

async function queryTaskAddress(cookie, taskId) {

  try {

    const response = await axios.get(
      `${BASE_URL}/app/offline/task/queryTaskAddress?taskId=${taskId}`,
      {
        headers: buildHeaders(cookie)
      }
    );

    const addresses =
      response.data?.data || [];

    return {
      success: true,
      total: addresses.length,
      data: addresses
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

    return {
      success: true,
      data: address
    };

  } catch (err) {

    return {
      success: false,
      message: err.message
    };

  }

}

/*
|--------------------------------------------------------------------------
| BUILD ADDRESS STRING
|--------------------------------------------------------------------------
*/

function buildAddressString(
  address
) {

  return [

    address.street,
    address.district,
    address.city,
    address.province

  ]
    .filter(Boolean)
    .join(" ");

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

    return {

      success: true,

      data: {

        /*
        |--------------------------------------------------------------------------
        | PENTING
        |--------------------------------------------------------------------------
        */

        addressId:
          address.addressId,

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
          address.latitude,

        longitude:
          address.longitude,

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
