// services/schedulerService.js

const {
  queryTasks
} = require("./taskService");

const {
  getAddressDetail
} = require("./addressService");

const {
  autoCheckin
} = require("./checkinService");

/*
|--------------------------------------------------------------------------
| RUN AUTO CHECKIN
|--------------------------------------------------------------------------
*/

async function runScheduler({

  cookie,

  latitude,
  longitude,

  imageUrl

}) {

  try {

    /*
    |--------------------------------------------------------------------------
    | GET TASKS
    |--------------------------------------------------------------------------
    */

    const tasksResult =
      await queryTasks(
        cookie
      );

    if (!tasksResult.success) {

      return tasksResult;

    }

    const tasks =
      tasksResult.data;

    console.log(
      "TOTAL TASK:",
      tasks.length
    );

    /*
    |--------------------------------------------------------------------------
    | LOOP TASKS
    |--------------------------------------------------------------------------
    */

    for (const task of tasks) {

      try {

        const taskId =
          task.id;

        console.log(
          "TASK ID:",
          taskId
        );

        /*
        |--------------------------------------------------------------------------
        | GET ADDRESS
        |--------------------------------------------------------------------------
        */

        const addressResult =
          await getAddressDetail(
            cookie,
            taskId
          );

        console.log(
          "ADDRESS RESULT:",
          addressResult
        );

        if (
          !addressResult.success
        ) {

          continue;

        }

        const address =
          addressResult.data;

        /*
        |--------------------------------------------------------------------------
        | VALIDASI ADDRESS ID
        |--------------------------------------------------------------------------
        */

        if (
          !address.addressId
        ) {

          console.log(
            "ADDRESS ID EMPTY"
          );

          continue;

        }

        console.log(
          "ADDRESS ID:",
          address.addressId
        );

        /*
        |--------------------------------------------------------------------------
        | AUTO CHECKIN
        |--------------------------------------------------------------------------
        */

        const checkin =
          await autoCheckin({

            cookie,

            taskId,

            addressId:
              address.addressId,

            addressContent:
              address.fullAddress,

            addressLatitude:
              latitude,

            addressLongitude:
              longitude,

            imageUrl,

            type: 0

          });

        console.log(
          "CHECKIN RESULT:",
          checkin
        );

      } catch (err) {

        console.log(
          "TASK ERROR:",
          err.message
        );

      }

    }

    return {
      success: true
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
  runScheduler
};
