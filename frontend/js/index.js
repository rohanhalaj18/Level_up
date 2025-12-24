import { generateQuestions, startInterview } from "./api.js";

const form = document.getElementById("setupForm");
const genBtn = document.getElementById("generateBtn");
const genList = document.getElementById("generatedList");
const generatedSection = document.getElementById("generated");
const themeToggle = document.getElementById("themeToggle");
const themeText = document.getElementById("themeText");


// Theme Toggle
let currentTheme = localStorage.getItem("theme") || "dark";

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  themeToggle.innerHTML = `
                <span>${isDark ? "☀️" : "🌙"}</span>
                <span id="themeText">${
                  isDark ? "Light Mode" : "Dark Mode"
                }</span>
            `;
  localStorage.setItem("theme", theme);
}

setTheme(currentTheme);

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(currentTheme);
});

// =============== GENERATE QUESTIONS ===============
genBtn.addEventListener("click", async () => {
  genBtn.disabled = true;
  genBtn.textContent = "⏳ Generating...";

  const data = new FormData(form);

  const payload = {
    role: data.get("role"),
    experience: data.get("experience"),
    tech_stack: (data.get("tech_stack") || "").split(",").map((s) => s.trim()),
    style: data.get("style"),
    difficulty: data.get("difficulty"),
  };

  try {
    const resp = await generateQuestions(payload);
    genList.innerHTML = "";

    if (resp?.questions?.length) {
      resp.questions.forEach((q) => {
        const li = document.createElement("li");
        li.textContent = typeof q === "string" ? q : q.text;
        genList.appendChild(li);
      });

      generatedSection.style.display = "block";

      // put them in textarea (newline)
      form.questions.value = resp.questions
        .map((q) => (typeof q === "string" ? q : q.text))
        .join("\n");
    } else {
      genList.innerHTML = "<li>No questions returned.</li>";
      generatedSection.style.display = "block";
    }
  } catch (e) {
    alert("Question generation failed. Check backend connection.");
    console.error(e);
  } finally {
    genBtn.disabled = false;
    genBtn.innerHTML = "✨ Generate AI Questions";
  }
});

// =============== START INTERVIEW ===============
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const candidateName = data.get("name");

  if (!candidateName || candidateName.trim() === "") {
    alert("Please enter your name.");
    return;
  }

  const candidate = {
    name: candidateName,
    role: data.get("role"),
    experience: data.get("experience"),
    tech_stack: (data.get("tech_stack") || "").split(",").map((s) => s.trim()),
    style: data.get("style"),
    difficulty: data.get("difficulty"),
  };

  let questions = [];

  // manual typed questions (one-per-line)
  const typed = (data.get("questions") || "").trim();

  if (typed) {
    questions = typed
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((text, i) => ({ index: i + 1, text }));
  }

  // fallback: generated questions list
  if (!questions.length && genList.children.length) {
    questions = Array.from(genList.children).map((li, i) => ({
      index: i + 1,
      text: li.textContent,
    }));
  }

  if (!questions.length) {
    alert(
      "Please provide or generate questions before starting the interview."
    );
    return;
  }

  try {
    document.getElementById("globalLoader").classList.add("active");

    const { sessionId } = await startInterview({ candidate, questions });

    sessionStorage.setItem("sessionId", sessionId);
    sessionStorage.setItem("candidateName", candidateName);
    sessionStorage.setItem("questions", JSON.stringify(questions));
    sessionStorage.setItem("theme", currentTheme);

    window.location.href = "interview.html";
  } catch (err) {
    alert("Failed to start interview session. Please check backend.");
    console.error(err);
  } finally {
    document.getElementById("globalLoader").classList.remove("active");
  }
});

// =============== EXPORT NAME ===============
