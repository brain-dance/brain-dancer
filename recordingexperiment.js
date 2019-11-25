let mediarec;

navigator.mediaDevices.getUserMedia({video: true}).then(
    stream=>{
        mediarec=new MediaRecorder(stream, {mimeType: 'image/jpg'});
        mediarec.ondataavailable=(evt)=>console.log(evt);
        mediarec.start();

    }
)