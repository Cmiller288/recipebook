// dashboard.js
window.addEventListener("load", function () {
    const status = document.getElementById("session-status");

    if (sessionStorage.getItem("loggedIn") !== "true") {
        window.location.href = "recipe-login.html";
        return;
    }

    const username = sessionStorage.getItem("username") || 'Guest';
    let noteCount = 0;
    try {
        noteCount = Object.keys(JSON.parse(localStorage.getItem('recipeNotes') || '{}')).length;
    } catch (err) {
        console.error('Failed to count saved recipe notes:', err);
    }

    status.textContent = `Logged in as ${username}. You have saved ${noteCount} personal recipe note${noteCount === 1 ? '' : 's'}.`;

    console.log("Dashboard session check complete");
});