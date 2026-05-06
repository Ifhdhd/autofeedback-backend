// server.js

const express = require("express");
const path = require("path");
const fs = require("fs");

const authRoutes =
  require("./routes/auth");

const taskRoutes =
  require("./routes/tasks");

const feedbackRoutes =
  require("./routes/feedback");

const scheduleRoutes =
  require("./routes/schedules");

const schedulerService =
  require("./services/schedulerService");

const app = express();

const PORT =
  process.env.PORT || 3000;

/*
|--------------------------------------------------------------------------
| CREATE REQUIRED FOLDERS
|--------------------------------------------------------------------------
*/

const folders = [

  "uploads",

  "uploads/photos",

  "uploads/audio",

  "temp",

  "logs",

  "public"

];

folders.forEach((folder) => {

  if (!fs.existsSync(folder)) {

    fs.mkdirSync(
      folder,
      { recursive: true }
    );

  }

});

/*
|--------------------------------------------------------------------------
| MIDDLEWARE
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: "50mb"
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(
  "/uploads",

  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/tasks",
  taskRoutes
);

app.use(
  "/api/feedback",
  feedbackRoutes
);

app.use(
  "/api/schedules",
  scheduleRoutes
);

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {

  res.json({

    success: true,

    message:
      "Auto Feedback Backend Running 🚀",

    time:
      new Date()

  });

});

/*
|--------------------------------------------------------------------------
| USERS CHECK
|--------------------------------------------------------------------------
*/

app.get(
  "/api/users",

  (req, res) => {

    try {

      const users =
        JSON.parse(

          fs.readFileSync(
            "./users.json",
            "utf8"
          )

        );

      res.json({

        success: true,

        total:
          users.length,

        data:
          users

      });

    } catch (err) {

      res.status(500).json({

        success: false,

        message:
          err.message

      });

    }

  }
);

/*
|--------------------------------------------------------------------------
| AUTO RUN SCHEDULER
|--------------------------------------------------------------------------
*/

(async () => {

  try {

    /*
    |--------------------------------------------------------------------------
    | REAL COOKIE
    |--------------------------------------------------------------------------
    */

    const cookie =

      "SESSION=N2JiNGRjNzUtNmIzOS00NTkwLTkwZTctYzE1ZjNhMGRlYjY5; acw_tc=9581d31f17779602972407866ebde2e08798567324595c6cece432f0ace79c";

    /*
    |--------------------------------------------------------------------------
    | RUN
    |--------------------------------------------------------------------------
    */

    await schedulerService.runScheduler({

      cookie,

      imageUrl:
        "https://dummyimage.com/600x400/000/fff.jpg",

      type: 0

    });

  } catch (err) {

    console.log(
      "RUN SCHEDULER ERROR:"
    );

    console.log(
      err.message
    );

  }

})();

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );

});
