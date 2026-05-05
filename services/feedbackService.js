const axios = require("axios");

const { buildHeaders } = require("./loginService");

const BASE_URL = "https://ez-co-app.tin.group";

/*
|--------------------------------------------------------------------------
| GET FEEDBACK TYPE
|--------------------------------------------------------------------------
*/

async function getFeedbackTypes(
  cookie,
  phoneType = 1
) {
  try {

    const response = await axios.get(
      `${BASE_URL}/app/offline/feedback/queryFeedbackType?phoneType=${phoneType}`,
      {
        headers: buildHeaders(cookie)
      }
    );

    return {
      success: true,
      data: response.data.data
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
| ADD FEEDBACK
|--------------------------------------------------------------------------
*/

async function addFeedback(
  cookie,
  payload
) {
  try {

    const response = await axios.post(
      `${BASE_URL}/app/offline/feedback/addFeedback`,
      payload,
      {
        headers: buildHeaders(cookie)
      }
    );

    return {
      success: true,
      raw: response.data
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
| BUILD FEEDBACK PAYLOAD
|--------------------------------------------------------------------------
*/

function buildFeedbackPayload({
  actionResultId,
  actionResultSerialNo,
  addressId,
  checkinId,
  taskId,
  remark = "",
  promise = 0,
  ptpAmount = 0,
  ptpTime = 0,
  type = 0,
  assistTaskType = 0
}) {

  return {
    actionResultId,
    actionResultSerialNo,
    addressId,
    assistTaskType,
    checkinId,
    createTime: Date.now(),
    promise,
    ptpAmount,
    ptpTime,
    remark,
    taskId,
    type
  };
}

/*
|--------------------------------------------------------------------------
| AUTO FEEDBACK
|--------------------------------------------------------------------------
*/

async function autoFeedback({
  cookie,
  addressId,
  checkinId,
  taskId,

  /*
  |--------------------------------------------------------------------------
  | WAJIB DIISI SESUAI REKAMAN
  |--------------------------------------------------------------------------
  */

  actionResultId,
  actionResultSerialNo,

  remark = "",
  promise = 0,
  ptpAmount = 0,
  ptpTime = 0,
  type = 0,
  assistTaskType = 0
}) {
  try {

    /*
    |--------------------------------------------------------------------------
    | VALIDASI
    |--------------------------------------------------------------------------
    */

    if (!actionResultId) {
      return {
        success: false,
        message: "actionResultId wajib diisi"
      };
    }

    if (!actionResultSerialNo) {
      return {
        success: false,
        message: "actionResultSerialNo wajib diisi"
      };
    }

    /*
    |--------------------------------------------------------------------------
    | PAYLOAD
    |--------------------------------------------------------------------------
    */

    const payload =
      buildFeedbackPayload({
        actionResultId,
        actionResultSerialNo,
        addressId,
        checkinId,
        taskId,
        remark,
        promise,
        ptpAmount,
        ptpTime,
        type,
        assistTaskType
      });

    /*
    |--------------------------------------------------------------------------
    | REQUEST
    |--------------------------------------------------------------------------
    */

    const result =
      await addFeedback(
        cookie,
        payload
      );

    return result;

  } catch (err) {

    return {
      success: false,
      message: err.message
    };

  }
}

/*
|--------------------------------------------------------------------------
| FIND FEEDBACK BY SERIAL
|--------------------------------------------------------------------------
*/

function findFeedbackBySerial(
  feedbacks,
  serialNo
) {

  return feedbacks.find(
    item =>
      item.serialNo === serialNo
  );
}

/*
|--------------------------------------------------------------------------
| FIND FEEDBACK BY ID
|--------------------------------------------------------------------------
*/

function findFeedbackById(
  feedbacks,
  id
) {

  return feedbacks.find(
    item =>
      Number(item.id) === Number(id)
  );
}

module.exports = {
  getFeedbackTypes,
  addFeedback,
  buildFeedbackPayload,
  autoFeedback,
  findFeedbackBySerial,
  findFeedbackById
};