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

    let allTasks = [];
    let pageNo = 1;
    let hasMore = true;

    while (hasMore) {

      const response = await axios.get(
        `${BASE_URL}/app/offline/task/queryTaskList?category=1&pageNo=${pageNo}&orderBy=1&pageSize=100`,
        {
          headers: buildHeaders(cookie)
        }
      );

      const tasks =
        response.data?.data?.data || [];

      allTasks.push(...tasks);

      if (tasks.length < 100) {
        hasMore = false;
      } else {
        pageNo++;
      }

    }

    return {
      success: true,
      data: allTasks
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
  getConfig,

  // FIX
  getTasks: queryTasks
};
