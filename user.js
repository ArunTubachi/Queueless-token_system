window.onload = () => {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  let isLoading = false;

  // 🚫 CANCEL TOKEN
  window.cancelToken = function () {
    if (!confirm("Cancel your token?")) return;

    fetch("http://localhost:5000/api/token", {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(() => {
        clearSlotError();
        renderSlots();      // re-enable slots
        loadMyToken();      // refresh booking
      })
      .catch(() => {
        showSlotError("Failed to cancel token");
      });
  };

  // ✅ Decode email from JWT
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const email = payload.email;
    const nameEl = document.getElementById("welcomeUser");
    if (nameEl && email) {
      nameEl.textContent = email;
    }
  } catch (e) {
    console.log("JWT decode failed");
  }

  // 🔔 Inline error helpers
  function showSlotError(msg) {
    const el = document.getElementById("slotError");
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("hide");
  }

  function clearSlotError() {
    const el = document.getElementById("slotError");
    if (!el) return;
    el.textContent = "";
    el.classList.add("hide");
  }

  // 🚪 LOGOUT
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      window.location.href = "login.html";
    });
  }

  // 📌 BOOK SLOT
  window.book = function (slot) {
    if (!slot) {
      showSlotError("Invalid slot selected");
      return;
    }

    if (isLoading) return;

    clearSlotError();
    isLoading = true;
    toggleSlotButtons(true);

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
        isLoading = false;
        toggleSlotButtons(false);

        if (data.error) {
          showSlotError(data.error);
        } else {
          loadMyToken();
        }
      })
      .catch(() => {
        isLoading = false;
        toggleSlotButtons(false);
        showSlotError("Server error. Please try again.");
      });
  };

  // 📦 LOAD TOKEN
  function loadMyToken() {
  clearSlotError();

  const info = document.getElementById("bookingInfo");
  info.innerHTML = `
    <h2>Your Booking</h2>
    <p class="muted">Loading your token...</p>
  `;

  fetch("http://localhost:5000/api/my-token", {
    headers: {
      "Authorization": "Bearer " + token
    }
  })
    .then(res => res.json())
    .then(data => {

      // ✅ UPDATE COINS
      if (typeof data.coins !== "undefined") {
        document.getElementById("coins").textContent = data.coins;
        const walletCoins = document.getElementById("walletCoins");
        if (walletCoins) walletCoins.textContent = data.coins;
      }

      // ✅ NO TOKEN CASE
      if (data.message) {
        info.innerHTML = `
          <h2>Your Booking</h2>
          <p class="muted">No booking yet</p>
        `;
        return;
      }

      // ✅ TOKEN EXISTS
      let actionBtn = "";

      if (data.status === "WAITING") {
        actionBtn = `<button class="cancelBtn" onclick="cancelToken()">Cancel Token</button>`;
      }

      info.innerHTML = `
        <h2>Your Booking</h2>
        <div class="bookingCard token-card">
          <div class="token-row">
            <span class="label">Slot</span>
            <span class="value">${data.slot}</span>
          </div>
          <div class="token-row">
            <span class="label">Token No</span>
            <span class="value">#${data.token_number}</span>
          </div>
          <div class="token-row">
            <span class="label">Status</span>
            <span class="value status ${data.status}">${data.status}</span>
          </div>
          ${actionBtn}
        </div>
      `;
    })
    .catch(() => {
      showSlotError("Failed to load token details.");
    });
}


  // 🎮 RENDER SLOTS
  function renderSlots() {
  const slots = [
    { name: "MORNING", time: "9:00 – 12:00" },
    { name: "AFTERNOON", time: "12:00 – 15:00" },
    { name: "EVENING", time: "15:00 – 19:00" }
  ];

  document.querySelector(".slots").innerHTML = slots
    .map(
      s => `
        <button onclick="book('${s.name}')" class="slotBtn">
          <div class="slot-name">${s.name}</div>
          <div class="slot-time">${s.time}</div>
        </button>
      `
    )
    .join("");
}

  function toggleSlotButtons(disabled) {
    document.querySelectorAll(".slots button").forEach(btn => {
      btn.disabled = disabled;
    });
  }

  renderSlots();
  loadMyToken();

  window.show = function (id) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hide"));
    document.getElementById(id).classList.remove("hide");
  };
};
