// public/app.js

let SESSION = "";
let acw_tc = "";

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

async function login() {

  try {

    const account =
      document.getElementById(
        "account"
      ).value;

    const password =
      document.getElementById(
        "password"
      ).value;

    const appVersion =
      document.getElementById(
        "zizhangyi"
      ).value;

    const res =
      await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            account,
            password,
            appVersion
          })
        }
      );

    const data =
      await res.json();

    console.log(data);

    const result =
      document.getElementById(
        "loginResult"
      );

    /*
    |--------------------------------------------------------------------------
    | LOGIN SUCCESS
    |--------------------------------------------------------------------------
    */

    if (data.success) {

      SESSION =
        data.cookies?.SESSION || "";

      acw_tc =
        data.cookies?.acw_tc || "";

      result.innerHTML =
        `
        <p class="success">
          Login berhasil
        </p>
      `;

      document.getElementById(
        "loginCard"
      ).style.display = "none";

      document.getElementById(
        "dashboard"
      ).style.display = "block";

      loadTasks();

    } else {

      result.innerHTML =
        `
        <p class="error">
          ${JSON.stringify(data.message)}
        </p>
      `;

    }

  } catch (err) {

    console.log(err);

    document.getElementById(
      "loginResult"
    ).innerHTML =
      `
      <p class="error">
        ${err.message}
      </p>
    `;

  }

}

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

function logout() {

  SESSION = "";
  acw_tc = "";

  location.reload();

}

/*
|--------------------------------------------------------------------------
| GET ADDRESS ID
|--------------------------------------------------------------------------
*/

async function getAddressId(taskId) {

  try {

    const res =
      await fetch(

        `/api/tasks/address/${taskId}?SESSION=${encodeURIComponent(
          SESSION
        )}&acw_tc=${encodeURIComponent(
          acw_tc
        )}`

      );

    const data =
      await res.json();

    console.log(
      "ADDRESS API:",
      data
    );

    if (
      !data.success
    ) {
      return "";
    }

    /*
    |--------------------------------------------------------------------------
    | ARRAY ADDRESS
    |--------------------------------------------------------------------------
    */

    const addresses =
      data.data?.data || [];

    if (
      !addresses.length
    ) {
      return "";
    }

    /*
    |--------------------------------------------------------------------------
    | ADDRESS ID
    |--------------------------------------------------------------------------
    */

    const address =
      addresses[0];

    return (
      address.addressId ||

      address.id ||

      ""
    );

  } catch (err) {

    console.log(
      "GET ADDRESS ERROR:",
      err
    );

    return "";

  }

}

/*
|--------------------------------------------------------------------------
| LOAD TASKS
|--------------------------------------------------------------------------
*/

async function loadTasks() {

  try {

    const url =
      `/api/tasks?SESSION=${encodeURIComponent(
        SESSION
      )}&acw_tc=${encodeURIComponent(
        acw_tc
      )}`;

    const res =
      await fetch(url);

    const data =
      await res.json();

    console.log(data);

    const container =
      document.getElementById(
        "tasks"
      );

    container.innerHTML = "";

    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    if (!data.success) {

      container.innerHTML =
        `
        <p class="error">
          ${JSON.stringify(data.message)}
        </p>
      `;

      return;

    }

    const tasks =
      data.data || [];

    /*
    |--------------------------------------------------------------------------
    | LOOP TASKS
    |--------------------------------------------------------------------------
    */

    for (const task of tasks) {

      /*
      |--------------------------------------------------------------------------
      | TASK ID
      |--------------------------------------------------------------------------
      */

      const taskId =

        task.taskId ||

        task.id ||

        "";

      /*
      |--------------------------------------------------------------------------
      | GET ADDRESS ID REAL
      |--------------------------------------------------------------------------
      */

      const addressId =
        await getAddressId(
          taskId
        );

      console.log(
        "TASK:",
        taskId,
        "ADDRESS:",
        addressId
      );

      /*
      |--------------------------------------------------------------------------
      | LOCATION
      |--------------------------------------------------------------------------
      */

      const lat =
        task.addressBo?.latitude || 0;

      const lng =
        task.addressBo?.longitude || 0;

      /*
      |--------------------------------------------------------------------------
      | DPD
      |--------------------------------------------------------------------------
      */

      const dpd =
        Number(task.dpd || 0);

      let badgeClass =
        "green";

      if (dpd >= 90) {

        badgeClass = "red";

      } else if (dpd >= 30) {

        badgeClass = "orange";

      }

      /*
      |--------------------------------------------------------------------------
      | CARD
      |--------------------------------------------------------------------------
      */

      const div =
        document.createElement(
          "div"
        );

      div.className =
        "task-card";

      /*
      |--------------------------------------------------------------------------
      | HTML
      |--------------------------------------------------------------------------
      */

      div.innerHTML = `

        <div class="task-header">

          <img
            class="task-photo"
            src="${
              task.handHoldPhoto ||
              "https://via.placeholder.com/100"
            }"
          >

          <div>

            <div class="task-name">
              ${task.userName || "-"}
            </div>

            <div class="task-info">
              Task ID:
              ${taskId}
            </div>

            <div class="task-info">
              Phone:
              ${task.phoneNumber || "-"}
            </div>

            <div class="task-info">
              Debt:
              Rp ${task.formatDebt || 0}
            </div>

            <div class="task-info">
              ${task.addressBo?.city || "-"},
              ${task.addressBo?.province || "-"}
            </div>

            <span class="badge ${badgeClass}">
              DPD ${task.dpd || 0}
            </span>

          </div>

        </div>

        <div class="info-box">

          <div class="info-item">
            <b>Address ID:</b>
            ${addressId || "-"}
          </div>

          <div class="info-item">
            <b>Latitude:</b>
            ${lat}
          </div>

          <div class="info-item">
            <b>Longitude:</b>
            ${lng}
          </div>

        </div>

        <iframe
          src="https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed">
        </iframe>

        <div class="action-group">

          <button
            class="btn-success"
            onclick="openSchedule(
              '${taskId}',
              '${addressId}',
              '${lat}',
              '${lng}'
            )"
          >
            Schedule
          </button>

        </div>

      `;

      container.appendChild(div);

    }

  } catch (err) {

    console.log(err);

    document.getElementById(
      "tasks"
    ).innerHTML =
      `
      <p class="error">
        ${err.message}
      </p>
    `;

  }

}

/*
|--------------------------------------------------------------------------
| OPEN SCHEDULE
|--------------------------------------------------------------------------
*/

function openSchedule(
  taskId,
  addressId,
  lat,
  lng
) {

  const url =
    `/schedule.html?taskId=${taskId}&addressId=${addressId}&lat=${lat}&lng=${lng}`;

  window.location.href = url;

}
