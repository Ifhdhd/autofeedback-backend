const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

/*
|--------------------------------------------------------------------------
| STORAGE CONFIG
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    const userId = req.body.userId || "unknown";

    let folder = "uploads/temp";

    if (file.fieldname === "photo") {

      folder = `uploads/photos/${userId}`;

    }

    if (file.fieldname === "audio") {

      folder = `uploads/audio/${userId}`;

    }

    if (!fs.existsSync(folder)) {

      fs.mkdirSync(folder, { recursive: true });

    }

    cb(null, folder);

  },

  filename: function (req, file, cb) {

    const ext =
      path.extname(file.originalname);

    const fileName =
      Date.now() + ext;

    cb(null, fileName);

  }

});

const upload = multer({ storage });

/*
|--------------------------------------------------------------------------
| UPLOAD PHOTO + AUDIO
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "audio", maxCount: 1 }
  ]),
  async (req, res) => {

    try {

      const photo =
        req.files?.photo?.[0];

      const audio =
        req.files?.audio?.[0];

      return res.json({

        success: true,

        message:
          "Upload berhasil",

        data: {

          photo: photo
            ? {
                filename: photo.filename,
                path: photo.path,
                size: photo.size
              }
            : null,

          audio: audio
            ? {
                filename: audio.filename,
                path: audio.path,
                size: audio.size
              }
            : null

        }

      });

    } catch (err) {

      return res.status(500).json({

        success: false,
        message: err.message

      });

    }

  }
);

module.exports = router;
