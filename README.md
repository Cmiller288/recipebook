# RecipeBook – A Simple Student Recipe Finder

> "Helping college students cook something better than ramen."

## Author
Made by Christian Miller

### Attribution / Resources
- Inspired by a separate recipe collection app UI
- Search functionality inspired by Wikipedia's preview-style navigation
- Built with:
  - HTML
  - CSS
  - JavaScript

---

## User Story

As a college student  
I want to easily find meal information  
So that I don't end up eating ramen noodles all semester.

---

## Links

Repo: https://github.com/Cmiller288/recipebook  
Live Site: https://cmiller288.github.io/recipebook/index.html  

Verification: Tested on **mobile and desktop browsers**

---

## Inspiration / Modeling

Screenshot of the recipe collecting app that inspired my layout and search idea.
<img width="1736" height="779" alt="image" src="https://github.com/user-attachments/assets/58a46106-8c12-4fbc-9b21-cf84e080afea" />


See full reference here:  
[[Modeling Reference Screenshot](https://github.com/Cmiller288/recipebook/issues/3)]


While I didn't directly copy the layout, I adapted the concept by creating:
- custom recipe pages
- simple navigation
- search functionality similar to Wikipedia previews.

---

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
