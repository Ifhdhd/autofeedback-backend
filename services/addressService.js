// services/addressService.js

const {
  queryTaskAddress
} = require("./taskService");

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

    ${address.roomNumber || ""}

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
      await queryTaskAddress(
        cookie,
        taskId
      );

    if (!result.success) {
      return result;
    }

    const address =
      result.data[0];

    console.log(
      "RAW ADDRESS:",
      address
    );

    if (!address) {

      return {
        success: false,
        message:
          "Address not found"
      };

    }

    return {

      success: true,

      data: {

        // FIX FINAL
        addressId:
          address.addressId ||
          address.id,

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

    return {
      success: false,
      message:
        err.message
    };

  }
}

module.exports = {

  getAddressDetail,

  buildAddressString

};
