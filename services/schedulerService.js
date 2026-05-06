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
      "===================================="
    );

    console.log(
      "AUTO FEEDBACK START"
    );

    console.log(
      "===================================="
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
    | LOOP TASK
    |--------------------------------------------------------------------------
    */

    for (const task of tasks) {

      try {

        console.log(
          "===================================="
        );

        console.log(
          "TASK OBJECT:"
        );

        console.log(
          JSON.stringify(
            task,
            null,
            2
          )
        );

        /*
        |--------------------------------------------------------------------------
        | FIX TASK ID
        |--------------------------------------------------------------------------
        */

        const taskId =

          task.taskId ||

          task.id ||

          task.caseId ||

          task.orderId;

        console.log(
          "TASK ID:",
          taskId
        );

        /*
        |--------------------------------------------------------------------------
        | TASK ID CHECK
        |--------------------------------------------------------------------------
        */

        if (!taskId) {

          console.log(
            "TASK ID EMPTY"
          );

          continue;

        }

        /*
        |--------------------------------------------------------------------------
        | GET ADDRESS DETAIL
        |--------------------------------------------------------------------------
        */

        const addressResult =
          await addressService.getAddressDetail(
            cookie,
            taskId
          );

        console.log(
          "ADDRESS RESULT:"
        );

        console.log(
          JSON.stringify(
            addressResult,
            null,
            2
          )
        );

        if (
          !addressResult.success
        ) {

          console.log(
            "FAILED GET ADDRESS"
          );

          continue;

        }

        const address =
          addressResult.data;

        /*
        |--------------------------------------------------------------------------
        | ADDRESS DEBUG
        |--------------------------------------------------------------------------
        */

        console.log(
          "ADDRESS DATA:"
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

          address.raw?.addressId ||

          address.raw?.id;

        console.log(
          "ADDRESS ID:",
          addressId
        );

        /*
        |--------------------------------------------------------------------------
        | ADDRESS ID CHECK
        |--------------------------------------------------------------------------
        */

        if (!addressId) {

          console.log(
            "ADDRESS ID EMPTY"
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

        console.log(
          "ADDRESS CONTENT:",
          addressContent
        );

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
              String(addressId),

            addressLatitude:
              -6.990088,

            addressLongitude:
              108.474472,

            imageUrl,

            taskId,

            type

          });

        console.log(
          "CHECKIN RESULT:"
        );

        console.log(
          JSON.stringify(
            result,
            null,
            2
          )
        );

      } catch (err) {

        console.log(
          "TASK ERROR:",
          err.message
        );

      }

    }

    console.log(
      "===================================="
    );

    console.log(
      "AUTO FEEDBACK DONE"
    );

    console.log(
      "===================================="
    );

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
