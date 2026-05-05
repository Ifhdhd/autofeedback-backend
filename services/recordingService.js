const axios = require("axios");

const { buildHeaders } = require("./loginService");

const BASE_URL = "https://ez-co-app.tin.group";

/*
|--------------------------------------------------------------------------
| RANDOM EXTRA DURATION
|--------------------------------------------------------------------------
*/

function fakeDuration(realDuration){

  // tambahan 5 - 15 detik
  const extra =
    Math.floor(Math.random() * 10000) + 5000;

  return realDuration + extra;
}

/*
|--------------------------------------------------------------------------
| ADD RECORDING
|--------------------------------------------------------------------------
*/

async function addRecording(
  cookie,
  payload
) {
  try {

    const response = await axios.post(
      `${BASE_URL}/app/offline/checkin/recording/add`,
      payload,
      {
        headers: buildHeaders(cookie)
      }
    );

    return {
      success: true,
      data: response.data.data,
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
| BUILD RECORDING PAYLOAD
|--------------------------------------------------------------------------
*/

function buildRecordingPayload({
  checkinId,
  recordingUrl,
  duration,
  startTime,
  endTime
}) {

  return {
    checkinId,
    recordingDuration: duration,
    recordingEndTime: endTime,
    recordingStartTime: startTime,
    recordingUrl
  };
}

/*
|--------------------------------------------------------------------------
| AUTO ADD RECORDING
|--------------------------------------------------------------------------
*/

async function autoAddRecording({
  cookie,
  checkinId,
  recordingUrl,
  duration = 20000 // asli 20 detik
}) {
  try {

    /*
    |--------------------------------------------------------------------------
    | FAKE DURATION
    |--------------------------------------------------------------------------
    */

    const fakeRecordDuration =
      fakeDuration(duration);

    /*
    |--------------------------------------------------------------------------
    | TIME
    |--------------------------------------------------------------------------
    */

    const endTime = Date.now();

    const startTime =
      endTime - fakeRecordDuration;

    /*
    |--------------------------------------------------------------------------
    | PAYLOAD
    |--------------------------------------------------------------------------
    */

    const payload =
      buildRecordingPayload({
        checkinId,
        recordingUrl,
        duration: fakeRecordDuration,
        startTime,
        endTime
      });

    /*
    |--------------------------------------------------------------------------
    | REQUEST
    |--------------------------------------------------------------------------
    */

    const result =
      await addRecording(
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
| GET TEMP AUDIO URL
|--------------------------------------------------------------------------
*/

function getTempAudioUrl(result) {

  return result?.data?.tempRecordingUrl || null;
}

module.exports = {
  addRecording,
  buildRecordingPayload,
  autoAddRecording,
  getTempAudioUrl
};