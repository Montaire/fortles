const {ipcRenderer, remote} = require("electron");
document.addEventListener("DOMContentLoaded", function(event) { 
    var version = document.getElementById("e-version");
    if(version){
        version.innerHTML = remote.app.getVersion();
    }
});

ipcRenderer.on("e-update-info", function(e, response){
    var info = document.getElementById("e-info");
    info.innerHTML = response;
});
ipcRenderer.on("e-update-progress", function(e, response){
    document.body.classList.add("e-downloading");
    var speed = document.getElementById("e-speed");
    if(speed){
        if(response.bytesPerSecond < 1e6){
            speed.innerHTML = Math.round(response.bytesPerSecond / 1e3) + " kbps";
        }else{
            speed.innerHTML = Math.round(response.bytesPerSecond / 1e6).toFixed(1) + " Mbps";
        }
    }
    var percent = document.getElementById("e-percent");
    if(percent){
        percent.innerHTML = response.percent + "%";
    }
    var total = document.getElementById("e-total");
    if(total){
        total.innerHTML = response.total;
    }
    var transferred = document.getElementById("e-transferred");
    if(transferred){
        transferred.innerHTML = response.transferred;
    }
    var progress = document.getElementById("e-progress");
    if(progress){
        progress.style.width = response.percent + '%';
    }
});