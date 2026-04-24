# RecipeBook

> A web app for college students to find and manage simple recipes, helping them cook better than ramen.

## Author

Christian Miller - [GitHub Profile](https://github.com/Cmiller288)

## User Story

- *As a college student*
- *I want* easy access to simple recipes
- *So that* I can cook nutritious meals without ramen.

## Narrative

This app is a personal recipe book web application that allows users to browse, search, and view recipes. It includes login functionality, a dashboard, and individual recipe pages. I chose this project to build a practical tool for students, improving on basic recipe storage with interactive features. Development involved HTML, CSS, JavaScript, Bootstrap for styling, and JSON for data. I added search, login/logout, and session management.

## Attribution

- Bootstrap: https://getbootstrap.com/
- Bootstrap Icons: https://icons.getbootstrap.com/
- Normalize.css: https://necolas.github.io/normalize.css/
- Google Fonts: Roboto Mono and Rubik Mono One
- Inspired by Wikipedia's search preview style

## Project Structure

```
.
├── assets
│   └── recipes.json
├── index.html
├── pages
│   ├── dashboard.html
│   ├── recipe-content.html
│   ├── recipe-login.html
│   ├── recipe1.html
│   ├── recipe2.html
│   ├── recipe3.html
│   ├── recipe4.html
│   ├── recipe5.html
│   ├── recipes.html
│   └── search.html
├── README.md
├── scripts
│   ├── api.js
│   ├── common.js
│   ├── main.js
│   ├── recipe-login-logout.js
│   ├── recipe-login-script.js
│   ├── recipe-script.js
│   └── search.js
└── styles
    └── recipe-styles.css
```

## Code Highlight

```javascript
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
```

This function loads recipe data from a JSON file using the Fetch API. It matters because it enables dynamic content loading without hardcoding recipes. It works by making an asynchronous HTTP request to the JSON file, parsing the response as JSON, storing it globally for access, and handling errors gracefully.

## Validation

- Nu Validator: https://validator.w3.org/nu/?doc=https%3A%2F%2Fcmiller288.github.io%2Frecipebook%2F
- WAVE Accessibility: https://wave.webaim.org/report#/https://cmiller288.github.io/recipebook/

Results are clean with no errors.

## Future Improvements

[GitHub Milestone: Sprint 99](https://github.com/Cmiller288/recipebook/milestone/1) - Includes issues for adding user recipe creation, improving mobile responsiveness, and fixing any known bugs.

## Code Example

The search feature listens for user input and filters recipes.

```javascript
(function () {
'use strict';

let recipes = [];
let searchInput, categorySelect, resultsContainer;

document.addEventListener('DOMContentLoaded', init);

async function init() {
  searchInput = document.getElementById('search-input');
  categorySelect = document.getElementById('category-select');
  resultsContainer = document.getElementById('search-results');

  const r = await fetch('../scripts/recipes.json');
  recipes = await r.json();

  bindHandlers();
  applyFilters();
}

function applyFilters() {
  const q = searchInput.value.toLowerCase();
  const cat = categorySelect.value;

  const filtered = recipes.filter(r => {
    const inCat = cat === 'all' || r.category.toLowerCase() === cat.toLowerCase();
    return inCat && (
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  });

  renderResults(filtered);
}

function renderResults(list) {
  resultsContainer.innerHTML = '';

  list.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    card.innerHTML = `
      <h5>${recipe.title}</h5>
      <p>${recipe.description}</p>
      <a href="${recipe.url}">Open Recipe</a>
    `;

    resultsContainer.appendChild(card);
  });
}

function bindHandlers() {
  searchInput.addEventListener('input', applyFilters);
  categorySelect.addEventListener('change', applyFilters);
}

})();
