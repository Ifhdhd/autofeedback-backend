class AudioRecorder{

  constructor(){

    this.mediaRecorder = null;

    this.audioChunks = [];

    this.audioBlob = null;

    this.audioUrl = null;

    this.startTime = null;

    this.endTime = null;

    this.duration = 0;

  }

  async requestPermission(){

    try{

      const stream = await navigator.mediaDevices.getUserMedia({
        audio:true
      });

      return stream;

    }catch(err){

      throw new Error("Microphone permission denied");

    }

  }

  async start(){

    const stream = await this.requestPermission();

    this.audioChunks = [];

    this.mediaRecorder = new MediaRecorder(stream);

    this.startTime = Date.now();

    this.mediaRecorder.ondataavailable = event => {

      if(event.data.size > 0){

        this.audioChunks.push(event.data);

      }

    };

    this.mediaRecorder.start();

    console.log("Recording started");

  }

  async stop(){

    return new Promise(resolve => {

      this.mediaRecorder.onstop = () => {

        this.endTime = Date.now();

        this.duration = this.endTime - this.startTime;

        this.audioBlob = new Blob(
          this.audioChunks,
          { type:"audio/amr" }
        );

        this.audioUrl = URL.createObjectURL(this.audioBlob);

        resolve({
          blob:this.audioBlob,
          url:this.audioUrl,
          duration:this.duration,
          startTime:this.startTime,
          endTime:this.endTime
        });

      };

      this.mediaRecorder.stop();

      console.log("Recording stopped");

    });

  }

  getBlob(){

    return this.audioBlob;

  }

  getUrl(){

    return this.audioUrl;

  }

  getDuration(){

    return this.duration;

  }

  reset(){

    this.audioChunks = [];

    this.audioBlob = null;

    this.audioUrl = null;

    this.startTime = null;

    this.endTime = null;

    this.duration = 0;

  }

}

const recorder = new AudioRecorder();

async function startRecording(){

  try{

    await recorder.start();

    const status = document.getElementById("recordStatus");

    if(status){

      status.innerHTML = `
        <p style="color:green;">
          Recording...
        </p>
      `;

    }

  }catch(err){

    alert(err.message);

  }

}

async function stopRecording(){

  try{

    const result = await recorder.stop();

    const audio = document.getElementById("previewAudio");

    if(audio){

      audio.src = result.url;

      audio.style.display = "block";

    }

    const status = document.getElementById("recordStatus");

    if(status){

      status.innerHTML = `
        <p style="color:blue;">
          Durasi: ${Math.floor(result.duration / 1000)} detik
        </p>
      `;

    }

    return result;

  }catch(err){

    alert(err.message);

  }

}

function downloadRecording(){

  const blob = recorder.getBlob();

  if(!blob){

    alert("Belum ada recording");

    return;

  }

  const a = document.createElement("a");

  a.href = recorder.getUrl();

  a.download = `recording_${Date.now()}.amr`;

  a.click();

}

console.log("recorder.js loaded");