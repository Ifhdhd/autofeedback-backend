// services/addressService.js

const axios =
  require("axios");

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

    console.log(
      "QUERY TASK ADDRESS:",
      taskId
    );

    const response =
      await axios.get(

        `${BASE_URL}/app/offline/task/queryTaskAddress?taskId=${taskId}`,

        {
          headers:
            buildHeaders(cookie)
        }

      );

    console.log(
      "RAW ADDRESS RESPONSE:"
    );

    console.log(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    const addresses =

      response.data?.data ||

      [];

    return {

      success: true,

      total:
        addresses.length,

      data:
        addresses

    };

  } catch (err) {

    console.log(
      "QUERY ADDRESS ERROR:",
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

    console.log(
      "PRIMARY ADDRESS RESULT:"
    );

    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
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

      data:
        address

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
| BUILD ADDRESS STRING
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

    console.log(
      "DETAIL RESULT:"
    );

    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
    );

    if (!result.success) {

      return result;

    }

    const address =
      result.data;

    console.log(
      "RAW ADDRESS OBJECT:"
    );

    console.log(
      JSON.stringify(
        address,
        null,
        2
      )
    );

    /*
    |--------------------------------------------------------------------------
    | FIX ADDRESS ID
    |--------------------------------------------------------------------------
    */

    const addressId =

      address.addressId ||

      address.id ||

      null;

    console.log(
      "FINAL ADDRESS ID:",
      addressId
    );

    return {

      success: true,

      data: {

        addressId:
          String(addressId),

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

        fullAddress:
          buildAddressString(
            address
          ),

        raw:
          address

      }

    };

  } catch (err) {

    console.log(
      "DETAIL ERROR:",
      err.message
    );

    return {

      success: false,

      message:
        err.message

    };

  }

}

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {

  queryTaskAddress,

  getPrimaryAddress,

  getAddressDetail,

  buildAddressString

};
