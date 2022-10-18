const cookie = require('cookiejs');

const loginContainer = document.getElementById('login-container');


const usernameDisplay = document.getElementById('username-container');
const loginButton = document.getElementById('login-button');
const usernameInput = document.getElementById('username-input');

loginButton.onclick = ()=>{
  const username = usernameInput.value;
  cookie.set('username', username);
  loginContainer.style.visibility = 'hidden';
  usernameDisplay.innerHTML = username;
};

function getUser() {
  const username = cookie.get('username');
  return username;
}

if(getUser()){
  loginContainer.style.visibility = 'hidden';
  usernameDisplay.innerHTML = getUser();
}