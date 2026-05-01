
// main script container
(function () {
  'use strict';

  const NOTE_STORAGE_KEY = 'recipeNotes';
  let savedNotes = {};

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
    setupRecipeNotes();
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

    console.log('Demo credentials: username="user", password="password"');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const username = document.getElementById('username')?.value || '';
      const password = document.getElementById('password')?.value || '';
      const messageDiv = document.getElementById('message');

      const formData = { username, password };
      console.log('Form data:', JSON.stringify(formData));

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

  function setupRecipeNotes() {
    const noteForm = document.getElementById('note-form');
    if (!noteForm) return;

    savedNotes = loadSavedNotes();

    // Ensure recipe data is loaded before populating select
    if (!window.recipeData || window.recipeData.length === 0) {
      console.log('Recipe data not loaded yet, retrying in 100ms...');
      setTimeout(setupRecipeNotes, 100);
      return;
    }

    populateRecipeSelect();
    renderSelectedRecipeNote();

    noteForm.addEventListener('submit', function (event) {
      event.preventDefault();
      saveRecipeNote();
    });

    const noteRecipe = document.getElementById('note-recipe');
    if (noteRecipe) {
      noteRecipe.addEventListener('change', renderSelectedRecipeNote);
    }
  }

  function populateRecipeSelect() {
    const noteRecipe = document.getElementById('note-recipe');
    if (!noteRecipe) {
      console.error('note-recipe select element not found');
      return;
    }

    if (!window.recipeData) {
      console.error('window.recipeData is not available');
      return;
    }

    console.log('Populating recipe select with', window.recipeData.length, 'recipes');
    noteRecipe.innerHTML = '<option value="">Choose a recipe</option>';
    window.recipeData.forEach(recipe => {
      const option = document.createElement('option');
      option.value = recipe.id;
      option.textContent = recipe.title;
      noteRecipe.appendChild(option);
    });
    console.log('Recipe select populated successfully');
  }

  function loadSavedNotes() {
    try {
      return JSON.parse(localStorage.getItem(NOTE_STORAGE_KEY) || '{}');
    } catch (err) {
      console.error('Failed to load saved notes:', err);
      return {};
    }
  }

  function saveRecipeNote() {
    const recipeId = document.getElementById('note-recipe')?.value;
    const noteText = document.getElementById('note-text')?.value.trim();
    const noteMessage = document.getElementById('note-message');

    if (!recipeId || !noteText) {
      if (noteMessage) {
        noteMessage.textContent = 'Please choose a recipe and enter a note before saving.';
        noteMessage.style.color = 'red';
      }
      return;
    }

    savedNotes[recipeId] = {
      recipeId,
      note: noteText,
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(savedNotes));
    console.log('Saved recipe note JSON:', JSON.stringify(savedNotes, null, 2));

    if (noteMessage) {
      noteMessage.textContent = 'Recipe note saved locally and logged to the console.';
      noteMessage.style.color = 'green';
    }

    renderSelectedRecipeNote();
  }

  function renderSelectedRecipeNote() {
    const noteRecipe = document.getElementById('note-recipe');
    const noteDisplay = document.getElementById('saved-note');
    if (!noteRecipe || !noteDisplay) return;

    const recipeId = noteRecipe.value;
    if (!recipeId || !savedNotes[recipeId]) {
      noteDisplay.textContent = 'No saved note for the selected recipe yet.';
      return;
    }

    const note = savedNotes[recipeId];
    const recipe = (window.recipeData || []).find(r => String(r.id) === String(recipeId));
    noteDisplay.innerHTML = `
      <p class="mb-1"><strong>Saved note for ${recipe ? recipe.title : 'selected recipe'}:</strong></p>
      <p>${note.note}</p>
    `;
  }

})();