function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorText = document.getElementById("error");

  errorText.innerText = "";

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
        errorText.innerText = data.error;
      } else {
        // save token
        localStorage.setItem("token", data.token);

        // go to dashboard
        window.location.href = "dashboard.html";
      }
    })
    .catch(() => {
      errorText.innerText = "Server not reachable";
    });
}
