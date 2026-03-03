document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const resultsContainer = document.getElementById('search-results');
    const resultCount = document.getElementById('result-count');

    // Require login for the search page (same behavior as recipes view)
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'recipe-login.html';
        return;
    }

    let recipes = [];

    fetch('../scripts/recipes.json')
        .then(r => r.json())
        .then(data => {
            recipes = data;
            populateCategories(recipes);
            applyFilters();
        })
        .catch(err => {
            console.error('Failed to load recipes.json', err);
            resultsContainer.innerHTML = '<div class="col-12 text-danger">Could not load recipes.</div>';
        });

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

    let inputTimer = null;
    searchInput.addEventListener('input', function () {
        clearTimeout(inputTimer);
        inputTimer = setTimeout(applyFilters, 150);
    });

    categorySelect.addEventListener('change', applyFilters);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            sessionStorage.clear();
            window.location.href = '../index.html';
        });
    }
});
