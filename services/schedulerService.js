const fs = require("fs");
const path = require("path");

const {
  login
} = require("./loginService");

const {
  getTasks
} = require("./taskService");

const {
  getAddressList
} = require("./addressService");

const {
  autoCheckin
} = require("./checkinService");

const {
  uploadImage
} = require("./uploadService");

const {
  uploadRecording,
  addRecording
} = require("./recordingService");

const {
  autoFeedback
} = require("./feedbackService");

/*
|--------------------------------------------------------------------------
| FILE
|--------------------------------------------------------------------------
*/

const schedulesPath = path.join(
  __dirname,
  "../data/schedules.json"
);

/*
|--------------------------------------------------------------------------
| LOAD SCHEDULES
|--------------------------------------------------------------------------
*/

function loadSchedules() {

  if (!fs.existsSync(schedulesPath)) {
    return [];
  }

  const raw =
    fs.readFileSync(
      schedulesPath,
      "utf8"
    );

  return JSON.parse(raw);
}

/*
|--------------------------------------------------------------------------
| SAVE SCHEDULES
|--------------------------------------------------------------------------
*/

function saveSchedules(data) {

  fs.writeFileSync(
    schedulesPath,
    JSON.stringify(
      data,
      null,
      2
    )
  );
}

/*
|--------------------------------------------------------------------------
| ADD SCHEDULE
|--------------------------------------------------------------------------
*/

function addSchedule(schedule) {

  const schedules =
    loadSchedules();

  schedules.push(schedule);

  saveSchedules(schedules);

  return schedule;
}

/*
|--------------------------------------------------------------------------
| REMOVE SCHEDULE
|--------------------------------------------------------------------------
*/

function removeSchedule(id) {

  const schedules =
    loadSchedules();

  const filtered =
    schedules.filter(
      item => item.id !== id
    );

  saveSchedules(filtered);
}

/*
|--------------------------------------------------------------------------
| GET ALL SCHEDULES
|--------------------------------------------------------------------------
*/

function getAllSchedules() {
  return loadSchedules();
}

/*
|--------------------------------------------------------------------------
| RUN AUTO FEEDBACK
|--------------------------------------------------------------------------
*/

async function runAutoFeedback(schedule) {

  try {

    console.log(
      `Menjalankan schedule ${schedule.id}`
    );

    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    const loginResult =
      await login(
        schedule.account,
        schedule.password,
        schedule.accountType
      );

    if (!loginResult.success) {

      console.log("Login gagal");

      return {
        success: false,
        step: "login",
        message:
          loginResult.message
      };
    }

    const cookie =
      loginResult.cookie;

    /*
    |--------------------------------------------------------------------------
    | GET TASK
    |--------------------------------------------------------------------------
    */

    const tasksResult =
      await getTasks(cookie);

    if (!tasksResult.success) {

      return {
        success: false,
        step: "tasks",
        message:
          tasksResult.message
      };
    }

    const tasks =
      tasksResult.data || [];

    if (tasks.length === 0) {

      return {
        success: false,
        step: "tasks",
        message:
          "Task kosong"
      };
    }

    /*
    |--------------------------------------------------------------------------
    | PILIH TASK PERTAMA
    |--------------------------------------------------------------------------
    */

    const task =
      tasks[0];

    const taskId =
      task.id;

    /*
    |--------------------------------------------------------------------------
    | GET ADDRESS
    |--------------------------------------------------------------------------
    */

    const addressResult =
      await getAddressList(
        cookie,
        taskId
      );

    if (!addressResult.success) {

      return {
        success: false,
        step: "address",
        message:
          addressResult.message
      };
    }

    const addresses =
      addressResult.data || [];

    if (addresses.length === 0) {

      return {
        success: false,
        step: "address",
        message:
          "Address kosong"
      };
    }

    /*
    |--------------------------------------------------------------------------
    | PILIH ADDRESS PERTAMA
    |--------------------------------------------------------------------------
    */

    const address =
      addresses[0];

    /*
    |--------------------------------------------------------------------------
    | UPLOAD FOTO
    |--------------------------------------------------------------------------
    */

    const imageUpload =
      await uploadImage({
        cookie,
        filePath:
          schedule.imagePath
      });

    if (!imageUpload.success) {

      return {
        success: false,
        step: "upload-image",
        message:
          imageUpload.message
      };
    }

    /*
    |--------------------------------------------------------------------------
    | CHECKIN
    |--------------------------------------------------------------------------
    */

    const checkinResult =
      await autoCheckin({
        cookie,
        taskId,
        address,
        imageUrl:
          imageUpload.objectKey,
        latitude:
          schedule.latitude,
        longitude:
          schedule.longitude
      });

    if (!checkinResult.success) {

      return {
        success: false,
        step: "checkin",
        message:
          checkinResult.message
      };
    }

    const checkinId =
      checkinResult.checkinId;

    /*
    |--------------------------------------------------------------------------
    | UPLOAD RECORDING
    |--------------------------------------------------------------------------
    */

    const recordingUpload =
      await uploadRecording({
        cookie,
        filePath:
          schedule.recordingPath
      });

    if (!recordingUpload.success) {

      return {
        success: false,
        step: "upload-recording",
        message:
          recordingUpload.message
      };
    }

    /*
    |--------------------------------------------------------------------------
    | ADD RECORDING
    |--------------------------------------------------------------------------
    */

    const recordingResult =
      await addRecording({
        cookie,
        checkinId,
        recordingUrl:
          recordingUpload.objectKey,
        duration:
          schedule.recordingDuration
      });

    if (!recordingResult.success) {

      return {
        success: false,
        step: "recording",
        message:
          recordingResult.message
      };
    }

    /*
    |--------------------------------------------------------------------------
    | FEEDBACK
    |--------------------------------------------------------------------------
    */

    const feedbackResult =
      await autoFeedback({
        cookie,

        addressId:
          address.id,

        checkinId,

        taskId,

        actionResultId:
          schedule.actionResultId,

        actionResultSerialNo:
          schedule.actionResultSerialNo,

        remark:
          schedule.remark || "",

        promise:
          schedule.promise || 0,

        ptpAmount:
          schedule.ptpAmount || 0,

        ptpTime:
          schedule.ptpTime || 0
      });

    if (!feedbackResult.success) {

      return {
        success: false,
        step: "feedback",
        message:
          feedbackResult.message
      };
    }

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    console.log(
      `Schedule ${schedule.id} sukses`
    );

    return {
      success: true,
      checkinId
    };

  } catch (err) {

    return {
      success: false,
      message: err.message
    };

  }
}

/*
|--------------------------------------------------------------------------
| START SCHEDULER
|--------------------------------------------------------------------------
*/

function startScheduler() {

  setInterval(async () => {

    const schedules =
      loadSchedules();

    const now =
      new Date();

    const currentHour =
      now.getHours();

    const currentMinute =
      now.getMinutes();

    for (const schedule of schedules) {

      const hour =
        Number(schedule.hour);

      const minute =
        Number(schedule.minute);

      /*
      |--------------------------------------------------------------------------
      | JALANKAN SESUAI JAM
      |--------------------------------------------------------------------------
      */

      if (
        currentHour === hour &&
        currentMinute === minute
      ) {

        console.log(
          `Menjalankan auto feedback ${schedule.id}`
        );

        await runAutoFeedback(
          schedule
        );

      }

    }

  }, 60000);
}

module.exports = {
  addSchedule,
  removeSchedule,
  getAllSchedules,
  runAutoFeedback,
  startScheduler
};