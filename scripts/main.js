import { apiVersion } from './api.js';

document.addEventListener("DOMContentLoaded", function () {
    console.log("Landing page loaded, API version:", apiVersion);

    if (sessionStorage.getItem("loggedIn") === "true") {
        console.log("User already logged in — redirecting");
        window.location.href = "pages/recipes.html";
    }
});