// public/app.js

let SESSION = "";
let acw_tc = "";

let allTasks = [];

/*
|--------------------------------------------------------------------------
| LOADING
|--------------------------------------------------------------------------
*/

function showLoading(){

  const loading =
    document.getElementById(
      "pageLoader"
    );

  if(loading){
    loading.style.display = "flex";
  }

}

function hideLoading(){

  const loading =
    document.getElementById(
      "pageLoader"
    );

  if(loading){
    loading.style.display = "none";
  }

}

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

async function login(){

  try{

    showLoading();

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

    if(!account || !password){

      hideLoading();

      document.getElementById(
        "loginResult"
      ).innerHTML =
        `
        <p class="error">
          Account dan password wajib diisi
        </p>
        `;

      return;

    }

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

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

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
        `
        <p class="success">
          Login berhasil
        </p>
        `;

      /*
      |--------------------------------------------------------------------------
      | SHOW DASHBOARD
      |--------------------------------------------------------------------------
      */

      document.getElementById(
        "loginCard"
      ).style.display = "none";

      document.getElementById(
        "dashboard"
      ).style.display = "block";

      /*
      |--------------------------------------------------------------------------
      | LOAD TASKS
      |--------------------------------------------------------------------------
      */

      await loadTasks();

    }else{

      result.innerHTML =
        `
        <p class="error">
          ${JSON.stringify(data.message)}
        </p>
        `;

    }

    hideLoading();

  }catch(err){

    console.log(err);

    hideLoading();

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
| AUTO LOGIN
|--------------------------------------------------------------------------
*/

window.onload = async () => {

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

    await loadTasks();

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

    const container =
      document.getElementById(
        "tasks"
      );

    container.innerHTML =
      `
      <div class="empty-text">
        Memuat data task...
      </div>
      `;

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

    if(!data.success){

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

    allTasks = [];

    /*
    |--------------------------------------------------------------------------
    | LOOP TASKS
    |--------------------------------------------------------------------------
    */

    for(const task of tasks){

      const taskId =
        task.taskId ||
        task.id;

      /*
      |--------------------------------------------------------------------------
      | ADDRESS ID
      |--------------------------------------------------------------------------
      */

      const addressId =
        await getAddressId(
          taskId
        );

      const lat =
        task.addressBo?.latitude || 0;

      const lng =
        task.addressBo?.longitude || 0;

      const taskData = {

        task,

        taskId,

        addressId,

        lat,

        lng

      };

      allTasks.push(
        taskData
      );

    }

    renderTasks(
      allTasks
    );

  }catch(err){

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
| RENDER TASKS
|--------------------------------------------------------------------------
*/

function renderTasks(tasks){

  const container =
    document.getElementById(
      "tasks"
    );

  container.innerHTML = "";

  /*
  |--------------------------------------------------------------------------
  | EMPTY
  |--------------------------------------------------------------------------
  */

  if(tasks.length === 0){

    container.innerHTML =
      `
      <div class="empty-text">
        Task tidak ditemukan
      </div>
      `;

    return;

  }

  /*
  |--------------------------------------------------------------------------
  | GRID
  |--------------------------------------------------------------------------
  */

  const grid =
    document.createElement(
      "div"
    );

  grid.className =
    "task-grid";

  /*
  |--------------------------------------------------------------------------
  | LOOP
  |--------------------------------------------------------------------------
  */

  tasks.forEach(item => {

    const {
      task,
      taskId,
      addressId,
      lat,
      lng
    } = item;

    /*
    |--------------------------------------------------------------------------
    | DPD
    |--------------------------------------------------------------------------
    */

    const dpd =
      Number(task.dpd || 0);

    let badgeClass =
      "green";

    if(dpd >= 90){

      badgeClass = "red";

    }else if(dpd >= 30){

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

    grid.appendChild(div);

  });

  container.appendChild(
    grid
  );

}

/*
|--------------------------------------------------------------------------
| SEARCH TASK
|--------------------------------------------------------------------------
*/

function searchTask(){

  const keyword =
    document.getElementById(
      "searchInput"
    ).value
    .toLowerCase();

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filtered =
    allTasks.filter(item => {

      const task =
        item.task;

      return (

        String(
          item.taskId
        )
        .toLowerCase()
        .includes(keyword)

        ||

        String(
          item.addressId
        )
        .toLowerCase()
        .includes(keyword)

        ||

        String(
          task.userName || ""
        )
        .toLowerCase()
        .includes(keyword)

        ||

        String(
          task.phoneNumber || ""
        )
        .toLowerCase()
        .includes(keyword)

      );

    });

  renderTasks(
    filtered
  );

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

  showLoading();

  const url =
    `/schedule.html?taskId=${taskId}&addressId=${addressId}&lat=${lat}&lng=${lng}`;

  setTimeout(() => {

    window.location.href =
      url;

  }, 400);

}
