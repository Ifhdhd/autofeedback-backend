// public/app.js

let SESSION = "";
let acw_tc = "";

let ALL_TASKS = [];

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

    /*
    |--------------------------------------------------------------------------
    | FIX RESPONSE
    |--------------------------------------------------------------------------
    */

    const raw =
      data.data;

    /*
    |--------------------------------------------------------------------------
    | ARRAY
    |--------------------------------------------------------------------------
    */

    if(Array.isArray(raw)){

      const address =
        raw[0];

      return (

        address?.addressId ||

        address?.id ||

        address?.addressBo?.id ||

        ""

      );

    }

    /*
    |--------------------------------------------------------------------------
    | OBJECT
    |--------------------------------------------------------------------------
    */

    return (

      raw?.addressId ||

      raw?.id ||

      raw?.addressBo?.id ||

      raw?.data?.addressId ||

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

    ALL_TASKS =
      data.data || [];

    renderTasks(
      ALL_TASKS
    );

  }catch(err){

    console.log(err);

  }

}

/*
|--------------------------------------------------------------------------
| SEARCH TASKS
|--------------------------------------------------------------------------
*/

function searchTasks(){

  const keyword =
    document.getElementById(
      "searchTask"
    ).value.toLowerCase();

  const filtered =
    ALL_TASKS.filter(task => {

      const taskId =
        String(
          task.taskId ||
          task.id ||
          ""
        ).toLowerCase();

      const name =
        String(
          task.userName ||
          ""
        ).toLowerCase();

      const phone =
        String(
          task.phoneNumber ||
          ""
        ).toLowerCase();

      const city =
        String(
          task.addressBo?.city ||
          ""
        ).toLowerCase();

      return (

        taskId.includes(keyword) ||

        name.includes(keyword) ||

        phone.includes(keyword) ||

        city.includes(keyword)

      );

    });

  renderTasks(
    filtered
  );

}

/*
|--------------------------------------------------------------------------
| RENDER TASKS
|--------------------------------------------------------------------------
*/

async function renderTasks(tasks){

  const container =
    document.getElementById(
      "tasks"
    );

  container.innerHTML = "";

  /*
  |--------------------------------------------------------------------------
  | TOTAL
  |--------------------------------------------------------------------------
  */

  const taskCount =
    document.getElementById(
      "taskCount"
    );

  if(taskCount){

    taskCount.innerHTML =
      `Total Task:
      ${tasks.length}`;

  }

  /*
  |--------------------------------------------------------------------------
  | EMPTY
  |--------------------------------------------------------------------------
  */

  if(tasks.length === 0){

    container.innerHTML =
      `
        <div class="card">
          Task tidak ditemukan
        </div>
      `;

    return;

  }

  /*
  |--------------------------------------------------------------------------
  | LOOP
  |--------------------------------------------------------------------------
  */

  for(const task of tasks){

    const taskId =
      task.taskId ||
      task.id;

    /*
    |--------------------------------------------------------------------------
    | ADDRESS ID REALTIME
    |--------------------------------------------------------------------------
    */

    const realtimeAddressId =
      await getAddressId(
        taskId
      );

    /*
    |--------------------------------------------------------------------------
    | FALLBACK
    |--------------------------------------------------------------------------
    */

    const addressId =

      realtimeAddressId ||

      task.addressId ||

      task.addressBo?.addressId ||

      task.addressBo?.id ||

      "";

    console.log(
      "FINAL ADDRESS ID:",
      addressId
    );

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

          <div class="task-info">
            Address ID:
            ${addressId || "-"}
          </div>

          <span class="badge ${badgeClass}">
            DPD ${task.dpd || 0}
          </span>

        </div>

      </div>

      <div class="info-box">

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
  | SAVE LAST PAGE
  |--------------------------------------------------------------------------
  */

  sessionStorage.setItem(
    "lastPage",
    window.location.href
  );

  const url =
    `/schedule.html?taskId=${taskId}&addressId=${addressId}&lat=${lat}&lng=${lng}`;

  window.location.href = url;

}
