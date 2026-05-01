(function () {
    'use strict';

    let recipes = [];
    let searchInput, categorySelect, resultsContainer, resultCount;

    document.addEventListener('DOMContentLoaded', init);

    async function init() {
        if (!requireLogin('recipe-login.html')) return;

        searchInput = document.getElementById('search-input');
        categorySelect = document.getElementById('category-select');
        resultsContainer = document.getElementById('search-results');
        resultCount = document.getElementById('result-count');

        await loadRecipes();
        populateCategories(recipes);
        applyFilters();
        bindHandlers();
    }

    async function loadRecipes() {
        try {
            const r = await fetch('../assets/recipes.json');
            recipes = await r.json();
        } catch (err) {
            console.error('Failed to load recipes.json', err);
            if (resultsContainer) {
                resultsContainer.innerHTML = '<div class="col-12 text-danger">Could not load recipes.</div>';
            }
        }
    }

    function populateCategories(items) {
        const cats = Array.from(new Set(items.map(i => i.category || 'Uncategorized'))).sort();
        cats.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            categorySelect.appendChild(opt);
        });
    }

    function renderResults(list) {
        resultsContainer.innerHTML = '';

        if (!list.length) {
            resultsContainer.innerHTML = '<div class="col-12">No recipes found.</div>';
            resultCount.textContent = '0 results';
            return;
        }

        resultCount.textContent = `${list.length} result${list.length !== 1 ? 's' : ''}`;

        list.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-3';

            card.innerHTML = `
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${recipe.title}</h5>
            <p class="card-text text-muted mb-2">${recipe.category || ''}</p>
            <p class="card-text">${recipe.description || ''}</p>
            <div class="mt-auto">
              <a href="${recipe.url}" class="btn btn-primary" target="_self">Open</a>
            </div>
          </div>
        </div>
      `;

            resultsContainer.appendChild(card);
        });
    }

    function applyFilters() {
        const q = (searchInput.value || '').trim().toLowerCase();
        const cat = categorySelect.value;

        const filtered = recipes.filter(r => {
            const inCat = cat === 'all' || (r.category || '').toLowerCase() === cat.toLowerCase();
            if (!inCat) return false;

            if (!q) return true;

            return (r.title || '').toLowerCase().includes(q)
                || (r.description || '').toLowerCase().includes(q)
                || (r.category || '').toLowerCase().includes(q);
        });

        renderResults(filtered);
    }

    function bindHandlers() {
        if (searchInput) {
            let timer;
            searchInput.addEventListener('input', function () {
                clearTimeout(timer);
                timer = setTimeout(applyFilters, 150);
            });
        }

        if (categorySelect) {
            categorySelect.addEventListener('change', applyFilters);
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.clear();
                window.location.href = 'recipe-login.html';
            });
        }
    }
})();
