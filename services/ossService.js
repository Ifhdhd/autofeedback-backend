const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

/*
|--------------------------------------------------------------------------
| GET OSS CONFIG
|--------------------------------------------------------------------------
*/

async function getOssConfig(
  cookie,
  type = 23
) {

  try {

    const response =
      await axios.get(
        `https://ez-co-app.tin.group/app/offline/oss/uploadUrl?type=${type}`,
        {
          headers: {
            "X-COUNTRY-ID": "1",
            countryCode: "ID",
            timeZoneId: "Asia/Jakarta",
            country: "ID",
            "Accept-Language": "in-ID",
            deviceId:
              "ffffffff-a665-1a66-0000-0000748ca5f0",
            deviceModel: "5030U",
            osVersion: "10",
            versionCode: "122",
            versionName:
              "2.9.2-release",
            "User-Agent":
              "okhttp/4.9.2",
            Cookie: cookie
          }
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
| GENERATE FILE NAME
|--------------------------------------------------------------------------
*/

function generateFileName(ext) {

  const random =
    Math.floor(
      Math.random() * 1000000
    );

  const timestamp =
    Date.now();

  return `${random}${timestamp}.${ext}`;
}

/*
|--------------------------------------------------------------------------
| GENERATE OSS SIGNATURE
|--------------------------------------------------------------------------
*/

function generateSignature({
  accessKeySecret,
  method,
  contentType,
  date,
  objectKey
}) {

  const stringToSign =
`${method}

${contentType}
${date}
/risk-oss-jkt-collection-prod/${objectKey}`;

  return crypto
    .createHmac(
      "sha1",
      accessKeySecret
    )
    .update(stringToSign)
    .digest("base64");
}

/*
|--------------------------------------------------------------------------
| UPLOAD FILE TO OSS
|--------------------------------------------------------------------------
*/

async function uploadToOSS({
  filePath,
  ossConfig,
  folder,
  contentType
}) {

  try {

    /*
    |--------------------------------------------------------------------------
    | FILE
    |--------------------------------------------------------------------------
    */

    const absolutePath =
      path.resolve(filePath);

    const fileBuffer =
      fs.readFileSync(
        absolutePath
      );

    /*
    |--------------------------------------------------------------------------
    | EXTENSION
    |--------------------------------------------------------------------------
    */

    const ext =
      path.extname(
        absolutePath
      ).replace(".", "");

    /*
    |--------------------------------------------------------------------------
    | OBJECT KEY
    |--------------------------------------------------------------------------
    */

    const fileName =
      generateFileName(ext);

    const objectKey =
      `${folder}/${fileName}`;

    /*
    |--------------------------------------------------------------------------
    | DATE
    |--------------------------------------------------------------------------
    */

    const date =
      new Date().toUTCString();

    /*
    |--------------------------------------------------------------------------
    | SIGNATURE
    |--------------------------------------------------------------------------
    */

    const signature =
      generateSignature({
        accessKeySecret:
          ossConfig.accessKeySecret,
        method: "PUT",
        contentType,
        date,
        objectKey
      });

    /*
    |--------------------------------------------------------------------------
    | AUTHORIZATION
    |--------------------------------------------------------------------------
    */

    const authorization =
      `OSS ${ossConfig.accessKeyId}:${signature}`;

    /*
    |--------------------------------------------------------------------------
    | URL
    |--------------------------------------------------------------------------
    */

    const uploadUrl =
      `http://${ossConfig.bucket}.${ossConfig.endpoint}/${objectKey}`;

    /*
    |--------------------------------------------------------------------------
    | UPLOAD
    |--------------------------------------------------------------------------
    */

    await axios.put(
      uploadUrl,
      fileBuffer,
      {
        headers: {
          Authorization:
            authorization,

          "x-oss-security-token":
            ossConfig.securityToken,

          Date: date,

          "Content-Type":
            contentType,

          "Content-Length":
            fileBuffer.length,

          "User-Agent":
            "aliyun-sdk-android/2.9.11"
        }
      }
    );

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    return {
      success: true,
      objectKey
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
  getOssConfig,
  uploadToOSS
};