import { getRound2Problems, submitRound2 } from "./api.js";

let editor;
let problems = [];
let currentIndex = 0;
let timerInterval;
let perQuestionSeconds = 120;

// UI references
const qIndicator = document.getElementById("qIndicator");
const tcResults = document.getElementById("tcResults");
const languageSelect = document.getElementById("language");
const problemsList = document.getElementById("problemsList");
const timerEl = document.getElementById("timer");

// -------------------------------------------
// MONACO EDITOR INITIALIZATION
// -------------------------------------------
function initMonaco() {
  return new Promise((resolve) => {
    require(["vs/editor/editor.main"], () => {
      editor = monaco.editor.create(
        document.getElementById("editorContainer"),
        {
          value: "// Select a problem to start coding",
          language: "javascript",
          theme: "vs-dark",
          minimap: { enabled: false },
          automaticLayout: true,
        }
      );
      resolve();
    });
  });
}

// -------------------------------------------
// STARTER CODE TEMPLATES
// -------------------------------------------
function starterCode(lang, p) {
  const header = `/* ${p.title}\n${p.description}\n*/\n\n`;

  if (lang === "javascript")
    return header + `function solve(){\n  // your code here\n}\nsolve();`;

  if (lang === "python") return header + `def solve():\n    pass\n\nsolve()`;

  if (lang === "cpp")
    return (
      header +
      `#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    return 0;\n}`
    );

  return header;
}

// -------------------------------------------
// LOAD A PROBLEM INTO UI + EDITOR
// -------------------------------------------
function loadProblem() {
  const p = problems[currentIndex];

  qIndicator.textContent = `Q ${currentIndex + 1} / ${problems.length}`;
  editor.setValue(starterCode(languageSelect.value, p));
  monaco.editor.setModelLanguage(editor.getModel(), languageSelect.value);

  renderProblemsList();
  tcResults.innerHTML = "";
  resetTimer();
}

// -------------------------------------------
// PROBLEM LIST UI
// -------------------------------------------
function renderProblemsList() {
  problemsList.innerHTML = "";
  problems.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "problem-item" + (i === currentIndex ? " active" : "");
    div.innerHTML = `
            <strong>${p.index}. ${p.title}</strong>
            <div style="font-size:13px;color:#9aa8c3">
                ${p.description.substring(0, 120)}...
            </div>
        `;
    div.onclick = () => {
      currentIndex = i;
      loadProblem();
    };
    problemsList.appendChild(div);
  });
}

// -------------------------------------------
// RUN TEST CASES USING BACKEND (PISTON)
// -------------------------------------------
async function runTests(fullRun = true) {
  const p = problems[currentIndex];
  const lang = languageSelect.value;
  const code = editor.getValue();

  tcResults.innerHTML = `<div style="color:#aaa">Running tests...</div>`;

  const resp = await submitRound2({
    company: sessionStorage.getItem("coding_company") || "tcs",
    problemIndex: p.index,
    language: lang,
    source: code,
  });

  renderResults(resp);
}

// -------------------------------------------
// DISPLAY RESULTS
// -------------------------------------------
function renderResults(resp) {
  tcResults.innerHTML = "";

  resp.rawResults.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "tc " + (r.passed ? "pass" : "fail");

    div.innerHTML = `
      <div><strong>Test ${i + 1}</strong> — ${
      r.passed ? "Passed" : "Failed"
    }</div>

      <div style="font-size:12px;margin-top:6px">
        Output:<pre>${(r.stdout || "").trim()}</pre>
      </div>

      <div style="font-size:12px">
        Expected:<pre>${(r.expected || "").trim()}</pre>
      </div>
    `;

    tcResults.appendChild(div);
  });
}

// -------------------------------------------
// TIMER PER QUESTION
// -------------------------------------------
function resetTimer() {
  clearInterval(timerInterval);
  let rem = perQuestionSeconds;

  timerEl.textContent = "02:00";

  timerInterval = setInterval(() => {
    rem--;
    timerEl.textContent = new Date(rem * 1000).toISOString().substr(14, 5);

    if (rem <= 0) {
      clearInterval(timerInterval);
      runTests(false);
    }
  }, 1000);
}

// -------------------------------------------
// MAIN BOOTSTRAP
// -------------------------------------------
(async () => {
  await initMonaco();

  const company = sessionStorage.getItem("coding_company") || "tcs";
  const resp = await getRound2Problems(company);

  problems = resp.problems;
  if (!problems.length) {
    alert("No problems found for this company.");
    return;
  }

  loadProblem();
})();

// -------------------------------------------
// UI EVENTS
// -------------------------------------------
document.getElementById("submitCode").onclick = () => runTests(true);
document.getElementById("runSingle").onclick = () => runTests(false);
document.getElementById("insertStub").onclick = () => loadProblem();
document.getElementById("nextBtn").onclick = () => {
  if (currentIndex < problems.length - 1) {
    currentIndex++;
    loadProblem();
  }
};
document.getElementById("prevBtn").onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    loadProblem();
  }
};
