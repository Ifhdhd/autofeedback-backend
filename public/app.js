// public/app.js

let SESSION = "";
let acw_tc = "";

let allTasks = [];

/*
|--------------------------------------------------------------------------
| LOADER
|--------------------------------------------------------------------------
*/

function showLoader(){

  const loader =
    document.getElementById(
      "globalLoader"
    );

  if(loader){

    loader.classList.remove(
      "loader-hidden"
    );

  }

}

function hideLoader(){

  const loader =
    document.getElementById(
      "globalLoader"
    );

  if(loader){

    loader.classList.add(
      "loader-hidden"
    );

  }

}

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

async function login(){

  try{

    showLoader();

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

      await loadTasks();

    }else{

      result.innerHTML =
        `<p class="error">
          ${JSON.stringify(data.message)}
        </p>`;

    }

    hideLoader();

  }catch(err){

    console.log(err);

    hideLoader();

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

  setTimeout(() => {

    hideLoader();

  },800);

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

    showLoader();

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

      hideLoader();

      return;

    }

    const tasks =
      data.data || [];

    allTasks = [];

    for(const task of tasks){

      const taskId =
        task.taskId ||
        task.id;

      const addressId =
        await getAddressId(
          taskId
        );

      task.realAddressId =
        addressId;

      allTasks.push(task);

    }

    renderTasks(allTasks);

    hideLoader();

  }catch(err){

    console.log(err);

    hideLoader();

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

  tasks.forEach(task => {

    const taskId =
      task.taskId ||
      task.id;

    const addressId =
      task.realAddressId || "-";

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
            Address ID:
            ${addressId}
          </div>

          <div class="task-info">
            Phone:
            ${task.phoneNumber || "-"}
          </div>

          <span class="badge ${badgeClass}">
            DPD ${task.dpd || 0}
          </span>

        </div>

      </div>

      <div class="info-box">

        <div class="info-item">
          Kota:
          ${task.addressBo?.city || "-"}
        </div>

        <div class="info-item">
          Provinsi:
          ${task.addressBo?.province || "-"}
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

  });

}

/*
|--------------------------------------------------------------------------
| SEARCH TASKS
|--------------------------------------------------------------------------
*/

function filterTasks(){

  const keyword =
    document.getElementById(
      "searchInput"
    ).value.toLowerCase();

  const filtered =
    allTasks.filter(task => {

      const taskId =
        String(
          task.taskId ||
          task.id ||
          ""
        ).toLowerCase();

      const addressId =
        String(
          task.realAddressId ||
          ""
        ).toLowerCase();

      const userName =
        String(
          task.userName ||
          ""
        ).toLowerCase();

      return (
        taskId.includes(keyword) ||
        addressId.includes(keyword) ||
        userName.includes(keyword)
      );

    });

  renderTasks(filtered);

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

  showLoader();

  setTimeout(() => {

    const url =
      `/schedule.html?taskId=${taskId}&addressId=${addressId}&lat=${lat}&lng=${lng}`;

    window.location.href =
      url;

  },600);

}
