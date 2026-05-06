// services/schedulerService.js

const taskService =
  require("./taskService");

const addressService =
  require("./addressService");

const checkinService =
  require("./checkinService");

/*
|--------------------------------------------------------------------------
| RUN SCHEDULER
|--------------------------------------------------------------------------
*/

async function runScheduler({

  cookie,

  imageUrl,

  type = 0

}) {

  try {

    console.log(
      "AUTO FEEDBACK START..."
    );

    /*
    |--------------------------------------------------------------------------
    | GET TASKS
    |--------------------------------------------------------------------------
    */

    const taskResult =
      await taskService.queryTasks(
        cookie
      );

    if (!taskResult.success) {

      console.log(
        "FAILED GET TASK:",
        taskResult.message
      );

      return;

    }

    const tasks =
      taskResult.data || [];

    console.log(
      `TOTAL TASK: ${tasks.length}`
    );

    /*
    |--------------------------------------------------------------------------
    | LOOP TASKS
    |--------------------------------------------------------------------------
    */

    for (const task of tasks) {

      try {

        const taskId =
          task.taskId;

        console.log(
          `PROCESS TASK ${taskId}`
        );

        /*
        |--------------------------------------------------------------------------
        | GET ADDRESS
        |--------------------------------------------------------------------------
        */

        const addressResult =
          await addressService.getAddressDetail(
            cookie,
            taskId
          );

        if (
          !addressResult.success
        ) {

          console.log(
            `ADDRESS FAILED ${taskId}`
          );

          continue;

        }

        const address =
          addressResult.data;

        console.log(
          "ADDRESS:",
          address
        );

        /*
        |--------------------------------------------------------------------------
        | CHECK ADDRESS ID
        |--------------------------------------------------------------------------
        */

        if (
          !address.addressId
        ) {

          console.log(
            `ADDRESS ID EMPTY ${taskId}`
          );

          continue;

        }

        /*
        |--------------------------------------------------------------------------
        | BUILD ADDRESS CONTENT
        |--------------------------------------------------------------------------
        */

        const addressContent =

          `${address.street || ""} ` +
          `${address.district || ""} ` +
          `${address.city || ""} ` +
          `${address.province || ""}`

          .replace(/\s+/g, " ")
          .trim();

        /*
        |--------------------------------------------------------------------------
        | AUTO CHECKIN
        |--------------------------------------------------------------------------
        */

        const result =
          await checkinService.autoCheckin({

            cookie,

            addressContent,

            addressId:
              String(
                address.addressId
              ),

            addressLatitude:
              -6.990088,

            addressLongitude:
              108.474472,

            imageUrl,

            taskId,

            type

          });

        console.log(
          "CHECKIN RESULT:",
          result
        );

      } catch (err) {

        console.log(
          "TASK ERROR:",
          err.message
        );

      }

    }

  } catch (err) {

    console.log(
      "SCHEDULER ERROR:",
      err.message
    );

  }
}

/*
|--------------------------------------------------------------------------
| START SCHEDULER
|--------------------------------------------------------------------------
*/

async function startScheduler() {

  console.log(
    "Scheduler started..."
  );

}

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = {

  runScheduler,

  startScheduler

};
