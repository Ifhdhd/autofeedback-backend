// public/app.js

let SESSION = "";
let acw_tc = "";

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

async function login(){

  try{

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

          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({

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

    if(data.success){

      SESSION =
        data.cookies?.SESSION || "";

      acw_tc =
        data.cookies?.acw_tc || "";

      /*
      |--------------------------------------------------------------------------
      | SAVE SESSION
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "SESSION",
        SESSION
      );

      localStorage.setItem(
        "acw_tc",
        acw_tc
      );

      result.innerHTML =
        `<p class="success">
          Login berhasil
        </p>`;

      document.getElementById(
        "loginCard"
      ).style.display = "none";

      document.getElementById(
        "dashboard"
      ).style.display = "block";

      loadTasks();

    }else{

      result.innerHTML =
        `<p class="error">
          ${JSON.stringify(data.message)}
        </p>`;

    }

  }catch(err){

    console.log(err);

  }

}

/*
|--------------------------------------------------------------------------
| AUTO LOGIN
|--------------------------------------------------------------------------
*/

window.onload = () => {

  const savedSession =
    localStorage.getItem(
      "SESSION"
    );

  const savedAcw =
    localStorage.getItem(
      "acw_tc"
    );

  if(savedSession){

    SESSION = savedSession;
    acw_tc = savedAcw;

    document.getElementById(
      "loginCard"
    ).style.display = "none";

    document.getElementById(
      "dashboard"
    ).style.display = "block";

    loadTasks();

  }

};

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

function logout(){

  localStorage.clear();

  location.reload();

}

/*
|--------------------------------------------------------------------------
| LOAD TASKS
|--------------------------------------------------------------------------
*/

async function loadTasks(){

  try{

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

    if(!data.success){

      container.innerHTML =
        `<p class="error">
          ${JSON.stringify(data.message)}
        </p>`;

      return;

    }

    const tasks =
      data.data || [];

    for(const task of tasks){

      /*
      |--------------------------------------------------------------------------
      | GET ADDRESS ID REALTIME
      |--------------------------------------------------------------------------
      */

      let addressId = "";

      try{

        const addrRes =
          await fetch(

            `/api/tasks/address/${task.id}?SESSION=${encodeURIComponent(
              SESSION
            )}&acw_tc=${encodeURIComponent(
              acw_tc
            )}`

          );

        const addrData =
          await addrRes.json();

        console.log(
          "ADDRESS:",
          addrData
        );

        addressId =

          addrData?.data?.addressId ||

          addrData?.data?.id ||

          addrData?.data?.[0]?.addressId ||

          addrData?.data?.[0]?.id ||

          "";

      }catch(err){

        console.log(
          "ADDRESS ERROR:",
          err
        );

      }

      const lat =
        task.addressBo?.latitude || 0;

      const lng =
        task.addressBo?.longitude || 0;

      const dpd =
        Number(task.dpd || 0);

      let badgeClass =
        "green";

      if(dpd >= 90){

        badgeClass = "red";

      }else if(dpd >= 30){

        badgeClass = "orange";

      }

      const div =
        document.createElement(
          "div"
        );

      div.className =
        "task-card";

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
              ${task.id || "-"}
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
              '${task.id}',
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

  }catch(err){

    console.log(err);

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
){

  /*
  |--------------------------------------------------------------------------
  | SAVE SESSION
  |--------------------------------------------------------------------------
  */

  localStorage.setItem(
    "scheduleTaskId",
    taskId
  );

  localStorage.setItem(
    "scheduleAddressId",
    addressId
  );

  localStorage.setItem(
    "scheduleLat",
    lat
  );

  localStorage.setItem(
    "scheduleLng",
    lng
  );

  /*
  |--------------------------------------------------------------------------
  | REDIRECT
  |--------------------------------------------------------------------------
  */

  window.location.href =
    "/schedule.html";

}
