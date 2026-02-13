const ADMIN_KEY = "admin123";
const BASE = "http://localhost:5000";

const table = document.getElementById("tokenTable");
const statsBox = document.getElementById("statsBox");
const errorBox = document.getElementById("adminError");

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("hide");
}

// 🔹 Load all tokens
fetch(`${BASE}/admin/tokens?key=${ADMIN_KEY}`)
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data)) {
      showError("Failed to load tokens");
      return;
    }

    table.innerHTML = data.map(t => `
      <tr>
        <td>${t.email}</td>
        <td>${t.slot}</td>
        <td>#${t.token_number}</td>
        <td class="status ${t.status}">${t.status}</td>
      </tr>
    `).join("");
  })
  .catch(() => showError("Server not reachable"));

// 🔹 Load stats
fetch(`${BASE}/admin/stats?key=${ADMIN_KEY}`)
  .then(res => res.json())
  .then(data => {
    statsBox.innerHTML = data.map(s => `
      <div class="stat-card">
        <strong>${s.slot}</strong>
        <span>${s.total} tokens</span>
      </div>
    `).join("");
  })
  .catch(() => {
    statsBox.innerHTML = "Failed to load stats";
  });
