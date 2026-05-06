const express = require("express");

const router = express.Router();

const {
  queryTasks,
  queryTaskAddress
} = require("../services/taskService");

/*
|--------------------------------------------------------------------------
| GET TASKS
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {

  try {

    const {
      SESSION,
      acw_tc
    } = req.query;

    if (!SESSION) {

      return res.status(401).json({
        success: false,
        message: "SESSION kosong"
      });

    }

    const cookie =
      `SESSION=${SESSION}; acw_tc=${acw_tc}`;

    const result =
      await queryTasks(cookie);

    if (!result.success) {

      return res.status(400).json(result);

    }

    return res.json({
      success: true,
      data: result.data
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

/*
|--------------------------------------------------------------------------
| GET ADDRESS BY TASK ID
|--------------------------------------------------------------------------
*/

router.get("/address", async (req, res) => {

  try {

    const {
      taskId,
      SESSION,
      acw_tc
    } = req.query;

    if (!SESSION) {

      return res.status(401).json({
        success: false,
        message: "SESSION kosong"
      });

    }

    if (!taskId) {

      return res.status(400).json({
        success: false,
        message: "taskId kosong"
      });

    }

    const cookie =
      `SESSION=${SESSION}; acw_tc=${acw_tc}`;

    /*
    |--------------------------------------------------------------------------
    | QUERY ADDRESS
    |--------------------------------------------------------------------------
    */

    const result =
      await queryTaskAddress(
        cookie,
        taskId
      );

    console.log(
      "ADDRESS API RESULT:"
    );

    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
    );

    if (!result.success) {

      return res.status(400).json(result);

    }

    /*
    |--------------------------------------------------------------------------
    | FIX RESPONSE
    |--------------------------------------------------------------------------
    */

    return res.json({
      success: true,
      data:
        result.data?.data ||
        result.data ||
        []
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

module.exports = router;
