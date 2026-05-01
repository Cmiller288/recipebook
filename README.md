# RecipeBook

> A student recipe app for browsing easy meals, searching by category, and saving personal cooking notes.

## Author

Christian Miller - [GitHub Profile](https://github.com/Cmiller288)

## User Story

- *As a college student*
- *I want* a clean recipe browser with login, search, sorting, and note-taking
- *So that* I can store my favorite easy meals and remember my own cooking tips.

## Narrative

RecipeBook is a front-end web app built to showcase practical HTML, CSS, JavaScript, and browser storage skills.
Users can log in with demo credentials, browse recipes, filter by name or category, and save personal notes for each recipe. The login page prints the demo credentials in the console for a clear hint.
The app now includes a recipe note form that stores data in local storage and logs the saved note object to the console as JSON.

I chose this project because it combines a useful student-facing tool with a strong interactive front-end workflow. During development I fixed broken data paths, added persistent note saving, improved session feedback on the dashboard, and cleaned up the repository structure.

## Attribution

- Bootstrap 5.3.2: https://getbootstrap.com/
- Normalize.css: https://necolas.github.io/normalize.css/
- Google Fonts: Roboto Mono and Rubik Mono One
- Icons and styling through Bootstrap utility classes
- No AI was used to write the project code

## Project Structure

```
.
├── assets
│   └── recipes.json
├── index.html
├── README.md
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
├── scripts
│   ├── api.js
│   ├── common.js
│   ├── dashboard.js
│   ├── main.js
│   ├── recipe-script.js
│   └── search.js
└── styles
    └── recipe-styles.css
```

## Code Highlight

```javascript
function saveRecipeNote() {
  const recipeId = document.getElementById('note-recipe')?.value;
  const noteText = document.getElementById('note-text')?.value.trim();

  savedNotes[recipeId] = {
    recipeId,
    note: noteText,
    savedAt: new Date().toISOString()
  };

  localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(savedNotes));
  console.log('Saved recipe note JSON:', JSON.stringify(savedNotes, null, 2));
}
```

This function captures a personal recipe note, serializes it as JSON, stores it in local storage, and prints the saved data to the browser console. It matters because it demonstrates form handling, persistent browser storage, and JSON packaging for a client-side feature.

## Validation

- Nu Validator: https://validator.w3.org/nu/?doc=https%3A%2F%2Fcmiller288.github.io%2Frecipebook%2F
- WAVE Accessibility: https://wave.webaim.org/report#/https://cmiller288.github.io/recipebook/

## Deployment

### GitHub Pages
- https://cmiller288.github.io/recipebook/

### GCP Deployment
- http://34.162.254.98/index.html

## Future Improvements

[GitHub Milestone: Sprint 99](https://github.com/Cmiller288/recipebook/milestone/1) - Includes issues for recipe creation, mobile responsiveness, accessibility improvements, and dashboard polish.
