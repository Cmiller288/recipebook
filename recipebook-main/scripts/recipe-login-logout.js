if (sessionStorage.getItem("loggedIn") !== "true") {
    console.log("Not logged in — redirecting");
    window.location.href = "recipe-login.html";
}
const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", function () {
    sessionStorage.clear();
    console.log("Session cleared");
    window.location.href = "../index.html";
});