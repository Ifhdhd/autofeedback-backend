async function api(url, method = "GET", body = null){

  const options = {
    method,
    headers:{}
  };

  if(body instanceof FormData){

    options.body = body;

  }else if(body){

    options.headers["Content-Type"] = "application/json";

    options.body = JSON.stringify(body);

  }

  const res = await fetch(url, options);

  return await res.json();

}

function saveSession(cookies){

  localStorage.setItem("SESSION", cookies.SESSION || "");
  localStorage.setItem("acw_tc", cookies.acw_tc || "");

}

function getSession(){

  return {
    SESSION: localStorage.getItem("SESSION") || "",
    acw_tc: localStorage.getItem("acw_tc") || ""
  };

}

function logout(){

  localStorage.removeItem("SESSION");
  localStorage.removeItem("acw_tc");

  location.href = "/";

}

function showLoading(el, text = "Loading..."){

  el.innerHTML = `
    <p>${text}</p>
  `;

}

function showError(el, text){

  el.innerHTML = `
    <p style="color:red;">
      ${text}
    </p>
  `;

}

function showSuccess(el, text){

  el.innerHTML = `
    <p style="color:green;">
      ${text}
    </p>
  `;

}

function previewImage(inputId, previewId){

  const input = document.getElementById(inputId);

  input.addEventListener("change", e => {

    const file = e.target.files[0];

    if(!file) return;

    const url = URL.createObjectURL(file);

    const img = document.getElementById(previewId);

    img.src = url;
    img.style.display = "block";

  });

}

function previewAudio(inputId, previewId){

  const input = document.getElementById(inputId);

  input.addEventListener("change", e => {

    const file = e.target.files[0];

    if(!file) return;

    const url = URL.createObjectURL(file);

    const audio = document.getElementById(previewId);

    audio.src = url;
    audio.style.display = "block";

  });

}

function formatDate(dateString){

  const date = new Date(dateString);

  return date.toLocaleString("id-ID",{
    year:"numeric",
    month:"2-digit",
    day:"2-digit",
    hour:"2-digit",
    minute:"2-digit"
  });

}

function createFeedbackOptions(selected = ""){

  const feedbacks = [
    {id:149, name:"PTP dari user"},
    {id:150, name:"PTP dari keluarga/teman"},
    {id:151, name:"Titip pesan ke keluarga/teman"},
    {id:154, name:"Tidak ada di rumah"},
    {id:157, name:"Tidak ketemu user"},
    {id:158, name:"User tolak bayar"},
    {id:166, name:"Sementara tidak ada uang"},
    {id:171, name:"Pengaruh pandemi"},
    {id:172, name:"Mengajukan restrukturisasi hutang"},
    {id:206, name:"Nasabah tidak mengizinkan melakukan Recording"}
  ];

  return feedbacks.map(item => `
    <option 
      value="${item.id}"
      ${selected == item.id ? "selected" : ""}
    >
      ${item.name}
    </option>
  `).join("");

}

function requireLogin(){

  const session = localStorage.getItem("SESSION");

  if(!session){

    alert("Session habis, login ulang");

    location.href = "/";

  }

}

function getFileName(file){

  if(!file) return "";

  return file.name;

}

function randomString(length = 10){

  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  for(let i=0;i<length;i++){

    result += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );

  }

  return result;

}

function sleep(ms){

  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });

}

console.log("app.js loaded");