const fs = require("fs");
const path = require("path");

/*
|--------------------------------------------------------------------------
| FILE PATH
|--------------------------------------------------------------------------
*/

const notifFile =
  path.join(
    __dirname,
    "../notifications.json"
  );

/*
|--------------------------------------------------------------------------
| CREATE FILE IF NOT EXISTS
|--------------------------------------------------------------------------
*/

if (!fs.existsSync(notifFile)) {

  fs.writeFileSync(
    notifFile,
    JSON.stringify([], null, 2)
  );

}

/*
|--------------------------------------------------------------------------
| READ
|--------------------------------------------------------------------------
*/

function readNotif() {

  try {

    const data =
      fs.readFileSync(
        notifFile,
        "utf8"
      );

    return JSON.parse(data);

  } catch (err) {

    return [];

  }
}

/*
|--------------------------------------------------------------------------
| SAVE
|--------------------------------------------------------------------------
*/

function saveNotif(data) {

  fs.writeFileSync(
    notifFile,
    JSON.stringify(
      data,
      null,
      2
    )
  );

}

/*
|--------------------------------------------------------------------------
| ADD NOTIFICATION
|--------------------------------------------------------------------------
*/

function addNotif(notif) {

  const data =
    readNotif();

  data.push(notif);

  saveNotif(data);

  return true;
}

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

function getAllNotif() {

  return readNotif();

}

/*
|--------------------------------------------------------------------------
| DELETE NOTIFICATION
|--------------------------------------------------------------------------
*/

function deleteNotif(id) {

  const data =
    readNotif();

  const filtered =
    data.filter(
      item => item.id !== id
    );

  saveNotif(filtered);

  return true;
}

module.exports = {
  addNotif,
  getAllNotif,
  deleteNotif
};