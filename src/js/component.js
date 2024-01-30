const URL = "http://localhost:4000/";

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.color = 'red';
  }
  
function clearError() {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = '';
}

const saveToken = (token) => {
  localStorage.setItem("token", token);
}

const getToken = () => {
  return localStorage.getItem("token");
}

const destroyToken = () => {
  localStorage.removeItem("token");
}

const isLoggedIn = async () => {
  const response = await fetch(URL + "auth/verify/" + getToken(), {method: "GET"});

  const result = await response.json();

  if ( !result.status ) {
    window.location.pathname = "/";
  }
}

const isNotLoggedIn = async () => {
  const response = await fetch(URL + "auth/verify/" + getToken(), {method: "GET"});

  const result = await response.json();

  if ( result.status ) {
    window.location.pathname = "/pages/events.html";
  }
}