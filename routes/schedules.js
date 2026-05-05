const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const schedulesPath =
  path.join(
    __dirname,
    "../schedules.json"
  );

/*
|--------------------------------------------------------------------------
| READ SCHEDULES
|--------------------------------------------------------------------------
*/

function readSchedules() {

  if (!fs.existsSync(schedulesPath)) {

    fs.writeFileSync(
      schedulesPath,
      "[]"
    );

  }

  const data =
    fs.readFileSync(
      schedulesPath,
      "utf-8"
    );

  return JSON.parse(data);

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
| GET ALL SCHEDULES
|--------------------------------------------------------------------------
*/

router.get(
  "/schedules",
  (req, res) => {

    try {

      const schedules =
        readSchedules();

      return res.json({
        success: true,
        total:
          schedules.length,
        data:
          schedules
      });

    } catch (err) {

      return res.status(500)
        .json({
          success: false,
          message:
            err.message
        });

    }

  }
);

/*
|--------------------------------------------------------------------------
| ADD SCHEDULE
|--------------------------------------------------------------------------
*/

router.post(
  "/schedules/add",
  (req, res) => {

    try {

      const {
        username,
        password,
        zizhangyi,
        hour,
        minute,
        enabled
      } = req.body;

      /*
      |------------------------------------------------------------------
      | VALIDATION
      |------------------------------------------------------------------
      */

      if (
        !username ||
        !password
      ) {

        return res.status(400)
          .json({
            success: false,
            message:
              "username dan password wajib"
          });

      }

      /*
      |------------------------------------------------------------------
      | LOAD OLD DATA
      |------------------------------------------------------------------
      */

      const schedules =
        readSchedules();

      /*
      |------------------------------------------------------------------
      | CREATE NEW SCHEDULE
      |------------------------------------------------------------------
      */

      const newSchedule = {

        id:
          Date.now(),

        username,

        password,

        /*
        | 1 = zizhangyi
        | 0 = non zizhangyi
        */

        zizhangyi:
          zizhangyi || 0,

        hour:
          hour || 8,

        minute:
          minute || 0,

        enabled:
          enabled !== false,

        createdAt:
          Date.now()

      };

      schedules.push(
        newSchedule
      );

      /*
      |------------------------------------------------------------------
      | SAVE
      |------------------------------------------------------------------
      */

      saveSchedules(
        schedules
      );

      /*
      |------------------------------------------------------------------
      | RESPONSE
      |------------------------------------------------------------------
      */

      return res.json({
        success: true,
        data:
          newSchedule
      });

    } catch (err) {

      return res.status(500)
        .json({
          success: false,
          message:
            err.message
        });

    }

  }
);

/*
|--------------------------------------------------------------------------
| DELETE SCHEDULE
|--------------------------------------------------------------------------
*/

router.delete(
  "/schedules/:id",
  (req, res) => {

    try {

      const id =
        Number(
          req.params.id
        );

      const schedules =
        readSchedules();

      const filtered =
        schedules.filter(
          item =>
            item.id !== id
        );

      saveSchedules(
        filtered
      );

      return res.json({
        success: true,
        message:
          "Schedule dihapus"
      });

    } catch (err) {

      return res.status(500)
        .json({
          success: false,
          message:
            err.message
        });

    }

  }
);

/*
|--------------------------------------------------------------------------
| ENABLE / DISABLE
|--------------------------------------------------------------------------
*/

router.patch(
  "/schedules/:id/toggle",
  (req, res) => {

    try {

      const id =
        Number(
          req.params.id
        );

      const schedules =
        readSchedules();

      const index =
        schedules.findIndex(
          item =>
            item.id === id
        );

      if (index === -1) {

        return res.status(404)
          .json({
            success: false,
            message:
              "Schedule tidak ditemukan"
          });

      }

      schedules[index].enabled =
        !schedules[index]
          .enabled;

      saveSchedules(
        schedules
      );

      return res.json({
        success: true,
        data:
          schedules[index]
      });

    } catch (err) {

      return res.status(500)
        .json({
          success: false,
          message:
            err.message
        });

    }

  }
);

module.exports = router;