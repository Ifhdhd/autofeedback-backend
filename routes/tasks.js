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

router.get(
  "/tasks",
  async (req, res) => {

    try {

      /*
      |------------------------------------------------------------------
      | COOKIE
      |------------------------------------------------------------------
      */

      const cookie =
        req.headers.cookie;

      if (!cookie) {

        return res.status(401)
          .json({
            success: false,
            message:
              "Cookie SESSION tidak ditemukan"
          });

      }

      /*
      |------------------------------------------------------------------
      | GET TASKS
      |------------------------------------------------------------------
      */

      const result =
        await getTasks(cookie);

      /*
      |------------------------------------------------------------------
      | FAILED
      |------------------------------------------------------------------
      */

      if (!result.success) {

        return res.status(400)
          .json(result);

      }

      /*
      |------------------------------------------------------------------
      | SUCCESS
      |------------------------------------------------------------------
      */

      return res.json({
        success: true,
        total:
          result.data.length,
        data:
          result.data
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
