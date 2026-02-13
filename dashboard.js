const token = localStorage.getItem("token");

if (!token) {
  // not logged in
  window.location.href = "login.html";
}

function applyToken() {
  const slot = document.getElementById("slot").value;
  const errorText = document.getElementById("error");

  errorText.innerText = "";

  if (!slot) {
    errorText.innerText = "Please select a slot";
    return;
  }

  fetch("http://localhost:5000/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ slot })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        errorText.innerText = data.error;
      } else {
        showMyToken();
      }
    })
    .catch(() => {
      errorText.innerText = "Server error";
    });
}

function showMyToken() {
  fetch("http://localhost:5000/api/my-token", {
    headers: {
      "Authorization": "Bearer " + token
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        document.getElementById("tokenDetails").innerText = data.message;
      } else {
        document.getElementById("tokenDetails").innerText =
          `Slot: ${data.slot} | Token No: ${data.token_number} | Status: ${data.status}`;
      }
    });
}

// auto-load token if exists
showMyToken();
