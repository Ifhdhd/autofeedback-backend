const express = require("express");
const router = express.Router();
const md5 = require("md5");

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

      const {
        username,
        password,
        type
      } = req.body;

      /*
      |--------------------------------------------------------------------------
      | VALIDATION
      |--------------------------------------------------------------------------
      */

      if (
        !username ||
        !password
      ) {

        return res.status(400)
          .json({
            success: false,
            message:
              "Username dan password wajib diisi"
          });

      }

      /*
      |--------------------------------------------------------------------------
      | MD5 PASSWORD
      |--------------------------------------------------------------------------
      */

      const md5Password =
        md5(password);

      /*
      |--------------------------------------------------------------------------
      | LOGIN
      |--------------------------------------------------------------------------
      */

      const result =
        await login({
          username,
          password: md5Password,
          type
        });

      /*
      |--------------------------------------------------------------------------
      | FAILED
      |--------------------------------------------------------------------------
      */

      if (!result.success) {

        return res.status(401)
          .json(result);

      }

      /*
      |--------------------------------------------------------------------------
      | SUCCESS
      |--------------------------------------------------------------------------
      */

      return res.json({
        success: true,
        message:
          "Login berhasil",
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