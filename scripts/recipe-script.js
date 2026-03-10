
// main script container
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    console.log('Script initialized');

    handleLoginForm();

    const recipeContainer = document.getElementById('recipe-container');
    if (!recipeContainer) return;

    if (!requireLogin('recipe-login.html')) return;
    setupLogout();

    const recipes = await loadRecipes();
    renderRecipes(recipes);
    bindControls();
  }

  function handleLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    
    const userInput = form.querySelector('#username');
    const passInput = form.querySelector('#password');
    if (userInput && passInput) {
      userInput.value = 'user';
      passInput.value = 'password';
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const username = document.getElementById('username')?.value || '';
      const password = document.getElementById('password')?.value || '';
      const messageDiv = document.getElementById('message');

      if (!username || !password) {
        if (messageDiv) {
          messageDiv.textContent = 'Please enter both username and password.';
          messageDiv.style.color = 'red';
        }
        return;
      }

      const isDemoValid = username === 'user' && password === 'password';
      if (isDemoValid) {
        console.log('Login successful (demo)');
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('loggedIn', 'true');
        window.location.href = 'recipes.html';
      } else {
        console.log('Login failed (demo)');
        if (messageDiv) {
          messageDiv.textContent = 'Incorrect username or password.';
          messageDiv.style.color = 'red';
        }
      }
    });
  }

  async function loadRecipes() {
    try {
      const response = await fetch('../assets/recipes.json');
      const data = await response.json();
      window.recipeData = data;
      return data;
    } catch (err) {
      console.error('Failed to load recipes:', err);
      return [];
    }
  }

  function renderRecipes(recipes) {
    const container = document.getElementById('recipe-container');
    container.innerHTML = '';

    recipes.forEach(recipe => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-3';

      col.innerHTML = `
          <div class="card h-100 border border-secondary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${recipe.title}</h5>
              <p class="card-text text-muted mb-2">${recipe.category}</p>
              <p class="card-text">${recipe.description || ''}</p>
              <a href="${recipe.url}" target="_blank" class="btn btn-primary mt-auto">
                View Recipe
              </a>
            </div>
          </div>
        `;

      container.appendChild(col);
    });
  }

  function bindControls() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const filtered = (window.recipeData || []).filter(r =>
          r.title.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query)
        );
        renderRecipes(filtered);
      });
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        let sorted = [...(window.recipeData || [])];

        if (this.value === 'az') {
          sorted.sort((a, b) => a.title.localeCompare(b.title));
        } else {
          sorted.sort((a, b) => b.title.localeCompare(a.title));
        }

        renderRecipes(sorted);
      });
    }
  }

})();