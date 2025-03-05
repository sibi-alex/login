//Passive WebApp serviceWorker code 
if("serviceWorker" in navigator){
    navigator.serviceWorker.register("sworker.js").then(registration=>{
        console.log("Service worker registered")
        console.log(registration);
    }).catch(error=>{
        console.log("Service worker error")
        console.log(error)
    })
    
}
else {
    alert("Service worker not working")
}





let workStartTime = localStorage.getItem("workStartTime") || null;
let breakStartTime = localStorage.getItem("breakStartTime") || null;
let totalWorkTime = parseInt(localStorage.getItem("totalWorkTime")) || 0;
let totalBreakTime = parseInt(localStorage.getItem("totalBreakTime")) || 0;
let working = localStorage.getItem("working") === "true";
let onBreak = localStorage.getItem("onBreak") === "true";

const startWorkBtn = document.getElementById("startWork");
const breakBtn = document.getElementById("breakBtn");
const restoreBtn = document.getElementById("restore");

function updateClock() {
    document.getElementById("clock").innerText = new Date().toLocaleTimeString("en-GB");
}
setInterval(updateClock, 1000);
updateClock();

function updateTimers() {
    let workElapsed = working && !onBreak && workStartTime ? Math.floor((Date.now() - workStartTime) / 1000) : 0;
    let breakElapsed = onBreak && breakStartTime ? Math.floor((Date.now() - breakStartTime) / 1000) : 0;

    document.getElementById("workTime").innerText = new Date((totalWorkTime + workElapsed) * 1000).toISOString().substr(11, 8);
    document.getElementById("breakTime").innerText = new Date((totalBreakTime + breakElapsed) * 1000).toISOString().substr(11, 8);
}

setInterval(updateTimers, 1000);
updateTimers();

// Start/Stop Work Logic
startWorkBtn.addEventListener("click", function () {
    if (working) {
        // Stop work
        totalWorkTime += Math.floor((Date.now() - workStartTime) / 1000);
        localStorage.setItem("totalWorkTime", totalWorkTime);
        
        working = false;
        localStorage.setItem("working", false);

        document.getElementById("workEnded").innerText = new Date().toLocaleTimeString("en-GB");
        localStorage.setItem("workEnded", document.getElementById("workEnded").innerText);

        this.innerText = "Start Work";
        this.style.backgroundColor = "rgb(103, 173, 103)";

        // Disable break button after stopping work
        breakBtn.disabled = true;
    } else {
        // Start work
        workStartTime = Date.now();
        localStorage.setItem("workStartTime", workStartTime);

        document.getElementById("workStarted").innerText = new Date().toLocaleTimeString("en-GB");
        localStorage.setItem("workStarted", document.getElementById("workStarted").innerText);

        working = true;
        localStorage.setItem("working", true);

        this.innerText = "Stop Work";
        this.style.backgroundColor = "rgb(223, 87, 87)";

        // Enable break button only when work starts
        breakBtn.disabled = false;
    }
    updateTimers();
});

// Break/Back to Work Logic
breakBtn.addEventListener("click", function () {
    if (onBreak) {
        // Stop break and resume work
        totalBreakTime += Math.floor((Date.now() - breakStartTime) / 1000);
        localStorage.setItem("totalBreakTime", totalBreakTime);
        
        onBreak = false;
        localStorage.setItem("onBreak", false);
        
        this.innerText = "Break";
        this.style.backgroundColor = "orange";

        // Resume work
        workStartTime = Date.now();
        localStorage.setItem("workStartTime", workStartTime);
    } else {
        // Start break and pause work
        totalWorkTime += Math.floor((Date.now() - workStartTime) / 1000);
        localStorage.setItem("totalWorkTime", totalWorkTime);

        workStartTime = null;

        breakStartTime = Date.now();
        localStorage.setItem("breakStartTime", breakStartTime);

        onBreak = true;
        localStorage.setItem("onBreak", true);

        this.innerText = "Back to Work";
        this.style.backgroundColor = "rgb(219, 29, 73)";
    }
    updateTimers();
});

// Restore Functionality
restoreBtn.addEventListener("click", function () {
    localStorage.clear();
    location.reload();
});

// Ensure correct UI state on reload
if (working) {
    startWorkBtn.innerText = "Stop Work";
    startWorkBtn.style.backgroundColor = "rgb(223, 87, 87)";
    breakBtn.disabled = false;
} else {
    startWorkBtn.innerText = "Start Work";
    startWorkBtn.style.backgroundColor = "rgb(103, 173, 103)";
    breakBtn.disabled = true;
}

if (onBreak) {
    breakBtn.innerText = "Back to Work";
    breakBtn.style.backgroundColor = "rgb(219, 29, 73)";
}

document.getElementById("workStarted").innerText = localStorage.getItem("workStarted") || "--:--:--";
document.getElementById("workEnded").innerText = localStorage.getItem("workEnded") || "--:--:--";

updateTimers();
