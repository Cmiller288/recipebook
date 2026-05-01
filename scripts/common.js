// common.js - shared utility functions for recipebook

/**
 * Redirects to login page if not logged in.
 * @param {string} redirectPath path to login page (relative)
 * @returns {boolean} true if user is logged in
 */
function requireLogin(redirectPath = 'recipe-login.html') {
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = redirectPath;
        return false;
    }
    return true;
}

/**
 * Attaches a logout handler to a button.
 * @param {string} buttonId element id of logout button
 * @param {string} redirectUrl location to send the user after logout
 */
function setupLogout(buttonId = 'logout-btn', redirectUrl = '../index.html') {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    btn.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = redirectUrl;
    });
}

/**
 * Insert a site header at top of body. Text is derived from document.title by default.
 * If you need custom links or structural variations you can pass an options object.
 */
function renderHeader(options = {}) {
    const title = options.title || document.title || '';
    const container = document.createElement('header');
    container.className = 'bg-dark text-white p-3';
    const links = [];

    // example logic: show recipes link on non-index pages
    const isIndex = location.pathname.endsWith('index.html') || location.pathname.endsWith('/');
    const loggedIn = sessionStorage.getItem('loggedIn') === 'true';

    if (!isIndex) {
        links.push({href: options.recipesHref || 'recipes.html', text: 'Recipes', btnClass: 'btn-info'});
        if (options.showDashboard !== false) {
            links.push({href: options.dashboardHref || 'dashboard.html', text: 'Dashboard', btnClass: 'btn-info'});
        }
    }

    let linksHtml = links.map(l =>
        `<a href="${l.href}" class="btn ${l.btnClass} me-2">${l.text}</a>`
    ).join('');

    if (loggedIn) {
        linksHtml += `<button id="logout-btn" class="btn btn-warning">Logout</button>`;
    }

    container.innerHTML = `
        <div class="container d-flex justify-content-between align-items-center">
            <h1 class="h5 mb-0">${title}</h1>
            <div>${linksHtml}</div>
        </div>
    `;
    document.body.prepend(container);
}

/**
 * Insert a consistent footer with links.
 */
function renderFooter() {
    const container = document.createElement('footer');
    container.className = 'bg-dark text-white p-3 mt-5';
    container.innerHTML = `
        <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center">
            <span class="mb-2 mb-md-0">@2026 My Personal Cookbook. All rights reserved.</span>
            <div>
                <a href="https://github.com/Cmiller288/recipebook" target="_blank" rel="noopener noreferrer" class="text-white me-3">View source</a>
                <a href="https://github.com/Cmiller288" target="_blank" rel="noopener noreferrer" class="btn btn-outline-light btn-sm">GitHub Profile</a>
            </div>
        </div>
    `;
    document.body.appendChild(container);
}

// render shared header/footer and attach logout once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    setupLogout();

});
