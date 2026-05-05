const axios = require("axios");
const { buildHeaders } = require("./loginService");

const BASE_URL = "https://ez-co-app.tin.group";

/*
|--------------------------------------------------------------------------
| QUERY TASK LIST
|--------------------------------------------------------------------------
*/

async function queryTasks(cookie) {
  try {

    const response = await axios.get(
      `${BASE_URL}/app/offline/task/list`,
      {
        headers: buildHeaders(cookie)
      }
    );

    return {
      success: true,
      data: response.data
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

    return {
      success: true,
      data: response.data
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
| CHECK FEEDBACK STATUS
|--------------------------------------------------------------------------
*/

async function checkFeedback(cookie, taskId, addressId) {
  try {

    const response = await axios.get(
      `${BASE_URL}/app/offline/checkin/feedback?taskId=${taskId}&addressId=${addressId}`,
      {
        headers: buildHeaders(cookie)
      }
    );

    return {
      success: true,
      data: response.data
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
| GET CHECKIN CONFIG
|--------------------------------------------------------------------------
*/

async function getConfig(cookie) {
  try {

    const response = await axios.get(
      `${BASE_URL}/app/offline/config`,
      {
        headers: buildHeaders(cookie)
      }
    );

    return {
      success: true,
      data: response.data
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

module.exports = {
  queryTasks,
  queryTaskAddress,
  checkFeedback,
  getConfig
};