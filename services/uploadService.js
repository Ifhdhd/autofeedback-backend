const axios = require("axios");
const fs = require("fs");
const OSS = require("ali-oss");

const { buildHeaders } = require("./loginService");

const BASE_URL = "https://ez-co-app.tin.group";

/*
|--------------------------------------------------------------------------
| GET OSS TOKEN
|--------------------------------------------------------------------------
| type 23 = image
| type 20 = audio
*/

async function getUploadToken(
  cookie,
  type = 23
) {
  try {

    const response = await axios.get(
      `${BASE_URL}/app/offline/oss/uploadUrl?type=${type}`,
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
| CREATE OSS CLIENT
|--------------------------------------------------------------------------
*/

function createOssClient(token) {

  return new OSS({
    region: "oss-ap-southeast-5",
    accessKeyId: token.accessKeyId,
    accessKeySecret: token.accessKeySecret,
    stsToken: token.securityToken,
    bucket: token.bucket,
    endpoint: `https://${token.endpoint}`
  });
}

/*
|--------------------------------------------------------------------------
| UPLOAD IMAGE
|--------------------------------------------------------------------------
*/

async function uploadImage(
  cookie,
  localFile
) {
  try {

    const tokenResult =
      await getUploadToken(cookie, 23);

    if (!tokenResult.success) {
      return tokenResult;
    }

    const token = tokenResult.data;

    const client = createOssClient(token);

    /*
    |--------------------------------------------------------------------------
    | REMOTE FILE
    |--------------------------------------------------------------------------
    */

    const fileName =
      `${Date.now()}.jpg`;

    const remotePath =
      `${token.ossPrefix}${fileName}`;

    /*
    |--------------------------------------------------------------------------
    | UPLOAD
    |--------------------------------------------------------------------------
    */

    await client.put(
      remotePath,
      localFile
    );

    return {
      success: true,
      fileName,
      imageUrl: remotePath,
      fullUrl:
        `https://${token.bucket}.${token.endpoint}/${remotePath}`
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
| UPLOAD AUDIO
|--------------------------------------------------------------------------
*/

async function uploadAudio(
  cookie,
  localFile
) {
  try {

    const tokenResult =
      await getUploadToken(cookie, 20);

    if (!tokenResult.success) {
      return tokenResult;
    }

    const token = tokenResult.data;

    const client = createOssClient(token);

    /*
    |--------------------------------------------------------------------------
    | REMOTE FILE
    |--------------------------------------------------------------------------
    */

    const fileName =
      `${Date.now()}.amr`;

    const remotePath =
      `${token.ossPrefix}${fileName}`;

    /*
    |--------------------------------------------------------------------------
    | UPLOAD
    |--------------------------------------------------------------------------
    */

    await client.put(
      remotePath,
      localFile
    );

    return {
      success: true,
      fileName,
      audioUrl: remotePath,
      fullUrl:
        `https://${token.bucket}.${token.endpoint}/${remotePath}`
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
| DOWNLOAD TEMP AUDIO
|--------------------------------------------------------------------------
*/

async function testAudio(url) {
  try {

    const response = await axios.get(
      url,
      {
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "5030U",
          "x-wap-profile":
            "http://www-ccpp.tcl-ta.com/files/5030u.xml"
        }
      }
    );

    return {
      success: true,
      size: response.data.length
    };

  } catch (err) {

    return {
      success: false,
      message: err.message
    };

  }
}

module.exports = {
  getUploadToken,
  createOssClient,
  uploadImage,
  uploadAudio,
  testAudio
};