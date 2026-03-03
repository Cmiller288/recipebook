
document.addEventListener("DOMContentLoaded", function () {

  console.log("Script initialized");

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const usernameEl = document.getElementById("username");
      const passwordEl = document.getElementById("password");
      const messageDiv = document.getElementById("message");

      const username = usernameEl ? usernameEl.value : "";
      const password = passwordEl ? passwordEl.value : "";

      if (username && password) {
        // Client-side mock authentication for static/demo usage.
        // Change this to call a real backend when available.
        const isDemoValid = (username === "1" && password === "2");

        if (isDemoValid) {
          console.log("Login successful (demo)");
          sessionStorage.setItem("username", username);
          sessionStorage.setItem("loggedIn", "true");
          window.location.href = "recipes.html";
        } else {
          console.log("Login failed (demo)");
          if (messageDiv) {
            messageDiv.textContent = "Incorrect username or password.";
            messageDiv.style.color = "red";
          }
        }
      } else {
        if (messageDiv) {
          messageDiv.textContent = "Please enter both username and password.";
          messageDiv.style.color = "red";
        }
      }
    });
  }

  const recipeContainer = document.getElementById("recipe-container");

  if (recipeContainer) {

    if (sessionStorage.getItem("loggedIn") !== "true") {
      window.location.href = "recipe-login.html";
      return;
    }

    fetch("../scripts/recipes.json")
      .then(response => response.json())
      .then(data => {
        renderRecipes(data);
        window.recipeData = data;
      });

    function renderRecipes(recipes) {
      recipeContainer.innerHTML = "";

      recipes.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-3";

        card.innerHTML = `
          <div class="card h-100">
            <div class="card-body">
              <h5>${recipe.title}</h5>
              <p>${recipe.category}</p>
              <a href="${recipe.url}" target="_blank" class="btn btn-primary">
                View Recipe
              </a>
            </div>
          </div>
        `;

        recipeContainer.appendChild(card);
      });
    }

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const filtered = (window.recipeData || []).filter(r =>
          r.title.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query)
        );
        renderRecipes(filtered);
      });
    }

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        let sorted = [...(window.recipeData || [])];

        if (this.value === "az") {
          sorted.sort((a, b) => a.title.localeCompare(b.title));
        } else {
          sorted.sort((a, b) => b.title.localeCompare(a.title));
        }

        renderRecipes(sorted);
      });
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        sessionStorage.clear();
        window.location.href = "../index.html";
      });
    }
  }

});