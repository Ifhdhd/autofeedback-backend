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

router.post(
  "/list",
  async (req, res) => {

    try {

      const {
        SESSION,
        acw_tc
      } = req.body;

      /*
      |--------------------------------------------------------------------------
      | VALIDATION
      |--------------------------------------------------------------------------
      */

      if(!SESSION || !acw_tc){

        return res.status(400).json({
          success:false,
          message:"SESSION dan acw_tc wajib diisi"
        });

      }

      /*
      |--------------------------------------------------------------------------
      | COOKIE
      |--------------------------------------------------------------------------
      */

      const cookie =
        `SESSION=${SESSION}; acw_tc=${acw_tc}`;

      /*
      |--------------------------------------------------------------------------
      | GET TASKS
      |--------------------------------------------------------------------------
      */

      const result =
        await getTasks(cookie);

      /*
      |--------------------------------------------------------------------------
      | FAILED
      |--------------------------------------------------------------------------
      */

      if(!result.success){

        return res.status(400).json(result);

      }

      /*
      |--------------------------------------------------------------------------
      | SUCCESS
      |--------------------------------------------------------------------------
      */

      return res.json({
        success:true,
        total: result.data.length,
        tasks: result.data
      });

    } catch(err){

      return res.status(500).json({
        success:false,
        message: err.message
      });

    }

  }
);

module.exports = router;
