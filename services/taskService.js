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

async function queryTasks(cookie) {

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

      allTasks.push(...tasks);

      if (tasks.length < 100) {

        hasMore = false;

      } else {

        pageNo++;

      }

    }

    return {
      success: true,
      total:
        allTasks.length,
      data:
        allTasks
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
      "ADDRESS RESPONSE:",
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
      "ADDRESS ERROR:",
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

module.exports = {

  queryTasks,

  queryTaskAddress,

  // alias
  getTasks:
    queryTasks

};
