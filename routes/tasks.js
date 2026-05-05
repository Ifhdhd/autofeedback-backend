const express = require("express");
const router = express.Router();

const {
  queryTasks
} = require("../services/taskService");

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

module.exports = router;
