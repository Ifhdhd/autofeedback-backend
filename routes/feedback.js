const express = require("express");
const router = express.Router();

const {
  addFeedback,
  getFeedbackTypes
} = require("../services/feedbackService");

/*
|--------------------------------------------------------------------------
| GET FEEDBACK TYPES
|--------------------------------------------------------------------------
*/

router.get(
  "/feedback/types",
  async (req, res) => {

    try {

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

      const result =
        await getFeedbackTypes(cookie);

      if (!result.success) {

        return res.status(400)
          .json(result);

      }

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

/*
|--------------------------------------------------------------------------
| ADD FEEDBACK
|--------------------------------------------------------------------------
*/

router.post(
  "/feedback/add",
  async (req, res) => {

    try {

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
      | BODY
      |------------------------------------------------------------------
      */

      const {
        actionResultId,
        actionResultSerialNo,
        addressId,
        assistTaskType,
        checkinId,
        createTime,
        promise,
        ptpAmount,
        ptpTime,
        remark,
        taskId,
        type
      } = req.body;

      /*
      |------------------------------------------------------------------
      | VALIDATION
      |------------------------------------------------------------------
      */

      if (
        !actionResultId ||
        !actionResultSerialNo ||
        !addressId ||
        !checkinId ||
        !taskId
      ) {

        return res.status(400)
          .json({
            success: false,
            message:
              "Data feedback tidak lengkap"
          });

      }

      /*
      |------------------------------------------------------------------
      | SEND FEEDBACK
      |------------------------------------------------------------------
      */

      const result =
        await addFeedback(
          cookie,
          {
            actionResultId,
            actionResultSerialNo,
            addressId,
            assistTaskType:
              assistTaskType || 0,
            checkinId,
            createTime:
              createTime || Date.now(),
            promise:
              promise || 0,
            ptpAmount:
              ptpAmount || 0,
            ptpTime:
              ptpTime || 0,
            remark:
              remark || "",
            taskId,
            type:
              type || 0
          }
        );

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