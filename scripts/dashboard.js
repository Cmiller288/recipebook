// dashboard.js
window.addEventListener("load", function () {
    const status = document.getElementById("session-status");

    if (sessionStorage.getItem("loggedIn") === "true") {
        status.textContent = "User is currently logged in.";
    } else {
        status.textContent = "User is not logged in.";
    }

    console.log("Dashboard session check complete");
});