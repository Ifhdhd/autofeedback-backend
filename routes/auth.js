const express = require("express");
const router = express.Router();

const {
  login
} = require("../services/loginService");

router.post("/login", async (req, res) => {

  try {

    const {

      account,

      password,

      appVersion = "0",

      zizhangyi = 0

    } = req.body;

    const result =
      await login({

        account,

        password,

        appVersion,

        zizhangyi

      });

    return res.json(result);

  } catch (err) {

    return res.status(500).json({

      success: false,

      message: err.message

    });

  }

});

module.exports = router;
