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
        account,
        password,
        zizhangyi
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

        return res.status(400)
          .json({
            success: false,
            message:
              "Account dan password wajib diisi"
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
          account,
          pwd: md5Password,
          appVersion: "1",
          zizhangyi
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
          result.data,
        cookies:
          result.cookies
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
