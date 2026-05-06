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

  if(savedSession && savedAcw){

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

  SESSION = "";
  acw_tc = "";

  location.reload();

}

/*
|--------------------------------------------------------------------------
| GET ADDRESS ID
|--------------------------------------------------------------------------
*/

async function getAddressId(taskId){

  try{

    const url =
      `/api/tasks/address?taskId=${taskId}&SESSION=${encodeURIComponent(
        SESSION
      )}&acw_tc=${encodeURIComponent(
        acw_tc
      )}`;

    const res =
      await fetch(url);

    const data =
      await res.json();

    console.log(
      "ADDRESS API:",
      data
    );

    if(!data.success){
      return "";
    }

    const address =
      data.data?.[0];

    return (
      address?.addressId ||
      address?.id ||
      ""
    );

  }catch(err){

    console.log(err);

    return "";

  }

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
      | FIX TASK ID
      |--------------------------------------------------------------------------
      */

      const taskId =
        task.taskId ||
        task.id;

      /*
      |--------------------------------------------------------------------------
      | GET ADDRESS ID REALTIME
      |--------------------------------------------------------------------------
      */

      const addressId =
        await getAddressId(
          taskId
        );

      console.log(
        "ADDRESS ID:",
        addressId
      );

      const lat =
        task.addressBo?.latitude || 0;

      const lng =
        task.addressBo?.longitude || 0;

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
              ${taskId}
            </div>

            <div class="task-info">
              Address ID:
              ${addressId || "-"}
            </div>

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

  const url =
    `/schedule.html?taskId=${taskId}&addressId=${addressId}&lat=${lat}&lng=${lng}`;

  window.location.href = url;

}
