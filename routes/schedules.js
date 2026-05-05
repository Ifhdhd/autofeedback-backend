const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const schedulesPath = path.join(
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

  const data = fs.readFileSync(
    schedulesPath,
    "utf8"
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

      return res.status(500).json({

        success: false,
        message: err.message

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

        taskId,
        addressId,
        feedbackId,
        scheduleTime,

        photoPath,
        audioPath

      } = req.body;

      /*
      |--------------------------------------------------------------------------
      | VALIDATION
      |--------------------------------------------------------------------------
      */

      if (!taskId) {

        return res.status(400).json({

          success: false,
          message: "taskId wajib"

        });

      }

      if (!addressId) {

        return res.status(400).json({

          success: false,
          message: "addressId wajib"

        });

      }

      if (!scheduleTime) {

        return res.status(400).json({

          success: false,
          message: "scheduleTime wajib"

        });

      }

      /*
      |--------------------------------------------------------------------------
      | LOAD DATA
      |--------------------------------------------------------------------------
      */

      const schedules =
        readSchedules();

      /*
      |--------------------------------------------------------------------------
      | NEW SCHEDULE
      |--------------------------------------------------------------------------
      */

      const newSchedule = {

        id: Date.now(),

        taskId,
        addressId,
        feedbackId,

        scheduleTime,

        photoPath:
          photoPath || null,

        audioPath:
          audioPath || null,

        status: "pending",

        createdAt:
          Date.now()

      };

      /*
      |--------------------------------------------------------------------------
      | PUSH
      |--------------------------------------------------------------------------
      */

      schedules.push(
        newSchedule
      );

      /*
      |--------------------------------------------------------------------------
      | SAVE
      |--------------------------------------------------------------------------
      */

      saveSchedules(
        schedules
      );

      /*
      |--------------------------------------------------------------------------
      | RESPONSE
      |--------------------------------------------------------------------------
      */

      return res.json({

        success: true,
        data: newSchedule

      });

    } catch (err) {

      return res.status(500).json({

        success: false,
        message: err.message

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

      const id = Number(
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
          "Schedule berhasil dihapus"

      });

    } catch (err) {

      return res.status(500).json({

        success: false,
        message:
          err.message

      });

    }

  }
);

/*
|--------------------------------------------------------------------------
| UPDATE STATUS
|--------------------------------------------------------------------------
*/

router.patch(
  "/schedules/:id/status",
  (req, res) => {

    try {

      const id = Number(
        req.params.id
      );

      const {
        status
      } = req.body;

      const schedules =
        readSchedules();

      const index =
        schedules.findIndex(
          item =>
            item.id === id
        );

      if (index === -1) {

        return res.status(404).json({

          success: false,
          message:
            "Schedule tidak ditemukan"

        });

      }

      schedules[index].status =
        status;

      schedules[index].updatedAt =
        Date.now();

      saveSchedules(
        schedules
      );

      return res.json({

        success: true,
        data:
          schedules[index]

      });

    } catch (err) {

      return res.status(500).json({

        success: false,
        message:
          err.message

      });

    }

  }
);

module.exports = router;
