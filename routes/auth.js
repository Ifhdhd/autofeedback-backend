// routes/auth.js

const express = require("express");

const router = express.Router();

const {
  login
} = require("../services/loginService");

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

router.post(
  "/login",
  async (req, res) => {

    try {

      /*
      |--------------------------------------------------------------------------
      | BODY
      |--------------------------------------------------------------------------
      */

      const {

        account,

        password,

        appVersion = "0"

      } = req.body;

      /*
      |--------------------------------------------------------------------------
      | VALIDATION
      |--------------------------------------------------------------------------
      */

      if (
        !account ||
        !password
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Account dan password wajib diisi"

        });

      }

      /*
      |--------------------------------------------------------------------------
      | LOGIN SERVICE
      |--------------------------------------------------------------------------
      */

      const result =
        await login({

          account,

          password,

          appVersion

        });

      /*
      |--------------------------------------------------------------------------
      | RESPONSE
      |--------------------------------------------------------------------------
      */

      return res.json(result);

    } catch (err) {

      console.log(
        "AUTH ERROR:",
        err.message
      );

      return res.status(500).json({

        success: false,

        message:
          err.message

      });

    }

  }
);

module.exports = router;
