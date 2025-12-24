// public/js/recruiter.js
// handles dashboard rendering + contact modal
(async function () {
  const listEl = document.getElementById("studentList");
  const totalCount = document.getElementById("totalCount");
  const avgApt = document.getElementById("avgApt");
  const avgCode = document.getElementById("avgCode");
  const topcard = document.getElementById("topcard");
  const leaderboard = document.getElementById("leaderboard");

  const modal = document.getElementById("contactModal");
  const mailTo = document.getElementById("mailTo");
  const mailSub = document.getElementById("mailSub");
  const mailMsg = document.getElementById("mailMsg");
  const sendBtn = document.getElementById("sendMailBtn");
  const closeBtn = document.getElementById("closeModal");
  const sendRes = document.getElementById("sendRes");

  closeBtn.onclick = () => (modal.style.display = "none");
  document.getElementById("logout").onclick = () => {
    sessionStorage.removeItem("recruiter");
    window.location.href = "../pages/main.html";
  };

  // load students
  const res = await fetch("http://localhost:5000/api/recruiter/students");
  const js = await res.json();
  const students = js.students || [];
  totalCount.textContent = students.length;
  const avg1 = Math.round(
    students.reduce((a, b) => a + b.aptitude, 0) / students.length || 0
  );
  const avg2 = Math.round(
    students.reduce((a, b) => a + b.coding, 0) / students.length || 0
  );
  avgApt.textContent = avg1;
  avgCode.textContent = avg2;

  // render list
  listEl.innerHTML = students
    .map(
      (s) => `
    <div class="item">
      <div class="avatar-small">${s.name
        .split(" ")
        .map((x) => x[0])
        .slice(0, 2)
        .join("")}</div>
      <div class="meta">
        <h4>${s.name}</h4>
        <p>${s.role} • ${s.email}</p>
      </div>
      <div style="display:flex;gap:8px" class="actions">
        <button class="btn btn-outline" onclick="location.href='../pages/student_profile.html?id=${
          s.id
        }'">View</button>
        <button class="btn btn-primary" data-email="${s.email}" data-name="${
        s.name
      }">Contact</button>
      </div>
    </div>
  `
    )
    .join("");

  // leaderboard
  const sorted = students
    .slice()
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 5);
  leaderboard.innerHTML = sorted
    .map(
      (s, i) =>
        `<div style="padding:8px 0;display:flex;justify-content:space-between;"><div>${
          i + 1
        }. ${s.name}</div><div><strong>${s.totalScore}</strong></div></div>`
    )
    .join("");

  // top candidate card
  const best = sorted[0];
  if (best) {
    topcard.innerHTML = `<div style="padding:12px;border-radius:8px;background:linear-gradient(180deg,#f7fffa,#f0fff5)"><strong>${best.name}</strong><div style="color:var(--muted)">${best.role}</div><div style="margin-top:8px">Score: <strong>${best.totalScore}</strong></div></div>`;
  }

  // Contact buttons
  document.querySelectorAll(".item .btn-primary").forEach((btn) => {
    btn.onclick = (e) => {
      const email = btn.dataset.email;
      const name = btn.dataset.name;
      modal.style.display = "flex";
      mailTo.value = email;
      mailSub.value = `Interview Opportunity — ${name}`;
      mailMsg.value = `Hello ${name},\n\nWe saw your profile and would like to connect. Are you available for a quick call? \n\nRegards,\nRecruiter Team`;
      sendRes.textContent = "";
    };
  });

  sendBtn.onclick = async () => {
    const to = mailTo.value,
      subject = mailSub.value,
      message = mailMsg.value;
    sendRes.textContent = "Sending...";
    try {
      const r = await fetch("http://localhost:5000/api/recruiter/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, message }),
      });
      const j = await r.json();
      if (j.ok) {
        sendRes.innerHTML =
          "Sent ✔" +
          (j.previewUrl
            ? `<div style="font-size:12px;color:var(--muted)">Preview: <a target="_blank" href="${j.previewUrl}">open</a></div>`
            : "");
      } else sendRes.textContent = "Error: " + (j.error || "unknown");
    } catch (err) {
      sendRes.textContent = "Error sending";
      console.error(err);
    }
  };
})();
function downloadCSV() {
  fetch("http://localhost:5000/api/recruiter/students")
    .then((r) => r.json())
    .then((js) => {
      const rows = js.students.map((s) => [s.name, s.role, s.totalScore]);

      let csv = "Name,Role,Total Score\n";
      rows.forEach((r) => {
        csv += r.join(",") + "\n";
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "leaderboard.csv";
      a.click();

      URL.revokeObjectURL(url);
    });
}
// Calendar toggle
document.querySelectorAll(".day").forEach(day => {
  if (!day.classList.contains("muted")) {
    day.addEventListener("click", () => {
      day.classList.toggle("mark");
    });
  }
});

// Task add
const taskInput = document.querySelector(".task-input");
const taskBox = document.querySelector(".tasks");

taskInput?.addEventListener("keypress", e => {
  if (e.key === "Enter" && taskInput.value.trim()) {
    const label = document.createElement("label");
    label.className = "task";
    label.innerHTML = `
      <input type="checkbox">
      <span>${taskInput.value}</span>
    `;
    taskBox.appendChild(label);
    taskInput.value = "";
  }
});
