// services/taskService.js

const axios = require("axios");

const {
  buildHeaders
} = require("./loginService");

const BASE_URL =
  "https://ez-co-app.tin.group";

/*
|--------------------------------------------------------------------------
| QUERY TASK LIST
|--------------------------------------------------------------------------
*/

async function queryTasks(
  cookie
) {

  try {

    let allTasks = [];

    let pageNo = 1;

    let hasMore = true;

    while (hasMore) {

      const response =
        await axios.get(
          `${BASE_URL}/app/offline/task/queryTaskList?category=1&pageNo=${pageNo}&orderBy=1&pageSize=100`,
          {
            headers:
              buildHeaders(cookie)
          }
        );

      const tasks =
        response.data?.data?.data || [];

      allTasks.push(
        ...tasks
      );

      if (
        tasks.length < 100
      ) {

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

    console.log(
      "QUERY TASK ADDRESS:"
    );

    console.log(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    return {
      success: true,
      data:
        response.data?.data || []
    };

  } catch (err) {

    console.log(
      "QUERY TASK ADDRESS ERROR:",
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
| GET TASK DETAIL
|--------------------------------------------------------------------------
*/

async function getTaskDetail(
  cookie,
  taskId
) {

  try {

    const response =
      await axios.get(
        `${BASE_URL}/app/offline/task/detail?taskId=${taskId}`,
        {
          headers:
            buildHeaders(cookie)
        }
      );

    console.log(
      "TASK DETAIL:"
    );

    console.log(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    /*
    |--------------------------------------------------------------------------
    | DETECT ADDRESS ID
    |--------------------------------------------------------------------------
    */

    const detail =
      response.data?.data || {};

    const addressId =
      detail.addressId ||
      detail.userAddressId ||
      detail.currentAddressId ||
      detail.addrId ||
      detail.id ||
      "";

    console.log(
      "FINAL ADDRESS ID:",
      addressId
    );

    return {

      success: true,

      data: {

        ...detail,

        addressId

      }

    };

  } catch (err) {

    console.log(
      "GET TASK DETAIL ERROR:",
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
| CHECK FEEDBACK STATUS
|--------------------------------------------------------------------------
*/

async function checkFeedback(
  cookie,
  taskId,
  addressId
) {

  try {

    const response =
      await axios.get(
        `${BASE_URL}/app/offline/checkin/feedback?taskId=${taskId}&addressId=${addressId}`,
        {
          headers:
            buildHeaders(cookie)
        }
      );

    return {
      success: true,
      data:
        response.data
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
| GET CONFIG
|--------------------------------------------------------------------------
*/

async function getConfig(
  cookie
) {

  try {

    const response =
      await axios.get(
        `${BASE_URL}/app/offline/config`,
        {
          headers:
            buildHeaders(cookie)
        }
      );

    return {
      success: true,
      data:
        response.data
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

  getTaskDetail,

  checkFeedback,

  getConfig,

  // alias
  getTasks:
    queryTasks

};
