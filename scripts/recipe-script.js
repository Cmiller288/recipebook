// This script handles the login form submission, stores the username and password in session storage, 
// and redirects to the recipe index page.

console.log("password is: recipe123");

//when button clicked, get username and password. 

//pass an Immediately Invoked Function Expression: IIFE.
document.addEventListener('submit', function (event) {
  event.preventDefault();

  // Get form values from the DOM 
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  console.log("username + pwd:", username + ", " + password);

  // Store in session storage
  sessionStorage.setItem('username', username);
  sessionStorage.setItem('password', password);
  // sessionStorage.setItem('loginTimestamp', new Date().toISOString());
  // sessionStorage.setItem('loginAttempts', (parseInt(sessionStorage.getItem('loginAttempts') || '0') + 1).toString());

  // Log to console
  console.log('session username:', username);
  console.log('session password:', password);

  window.location.assign("../pages/recipe-content.html");
//Templating: `hey${username}, welcome back!`
});
