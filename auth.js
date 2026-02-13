function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return password.length >= 6;
}

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

loginBtn.addEventListener("click", login);
registerBtn.addEventListener("click", register);

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;

  if (!email || !password) {
  alert("Email and password are required");
  return;
}

if (!isValidEmail(email)) {
  alert("Enter a valid email address");
  return;
}

if (!isValidPassword(password)) {
  alert("Password must be at least 6 characters");
  return;
}


  fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        localStorage.setItem("token", data.token);
        window.location.href = "user.html";
      }
    })
    .catch(() => {
      alert("Backend not reachable");
    });
}

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  fetch("http://localhost:5000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        alert("Registration successful. Please login.");
      }
    })
    .catch(() => {
      alert("Backend not reachable");
    });
}
