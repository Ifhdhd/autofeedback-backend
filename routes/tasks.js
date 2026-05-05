const express = require("express");
const router = express.Router();

const {
  getTasks
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

    if(!SESSION){

      return res.status(401).json({
        success:false,
        message:"SESSION kosong"
      });

    }

    const cookie =
      `SESSION=${SESSION}; acw_tc=${acw_tc}`;

    const result =
      await getTasks(cookie);

    if(!result.success){

      return res.status(400).json(result);

    }

    return res.json({
      success:true,
      total: result.data.length,
      data: result.data
    });

  } catch(err){

    return res.status(500).json({
      success:false,
      message: err.message
    });

  }

});

module.exports = router;
