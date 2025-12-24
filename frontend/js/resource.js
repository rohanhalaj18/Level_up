document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.getElementById("education-form-container");
  const nextButton = document.getElementById("next-btn");
  const prevButton = document.getElementById("prev-btn");
  const progressText = document.querySelector(".progress-indicator span");
  const progressBar = document.querySelector(".progress");
  const summaryContainer = document.getElementById("summary");
  const resourcesContainer = document.getElementById("resources-container");
  const typewriterText = document.getElementById("typewriter-text");

  let currentStep = 1;
  let totalSteps = 3;
  let userSelections = {};

  const typewriterPhrases = [
    "Find the Best Resources for Your Learning Journey",
    "Search once, get everything curated perfectly",
    "Smart recommendations tailored just for you",
    "Discover the best learning content instantly",
  ];

  let tIndex = 0,
    letterIndex = 0,
    deleting = false;

  function typeWriter() {
    let text = typewriterPhrases[tIndex];

    typewriterText.textContent = deleting
      ? text.substring(0, letterIndex--)
      : text.substring(0, letterIndex++);

    if (!deleting && letterIndex === text.length) {
      deleting = true;
      setTimeout(typeWriter, 1500);
    } else if (deleting && letterIndex === 0) {
      deleting = false;
      tIndex = (tIndex + 1) % typewriterPhrases.length;
      setTimeout(typeWriter, 600);
    } else {
      setTimeout(typeWriter, deleting ? 40 : 70);
    }
  }

  typeWriter();

  /* ===================== FORM STEPS ===================== */

  const questionnaire = {
    1: {
      title: "What is your Query?",
      key: "query",
      type: "text",
      placeholder: "e.g., JavaScript, Node.js",
    },
    2: {
      title: "Category",
      key: "category",
      type: "text",
      placeholder: "e.g., Web Development",
    },
    3: {
      title: "Your Role?",
      key: "role",
      type: "radio",
      options: [
        { label: "School Student", value: "School Student" },
        { label: "College Student", value: "College Student" },
        { label: "Working Professional", value: "Working Professional" },
        { label: "Lifelong Learner", value: "Lifelong Learner" },
      ],
    },
  };

  function renderStep(step) {
    formContainer.innerHTML = "";
    let data = questionnaire[step];

    let h = document.createElement("h1");
    h.textContent = data.title;
    formContainer.appendChild(h);

    let group = document.createElement("div");
    group.className = "form-group";

    if (data.type === "radio") {
      data.options.forEach((opt) => {
        let wrap = document.createElement("div");
        wrap.className = "option";

        wrap.innerHTML = `
                    <input type="radio" name="${data.key}" value="${opt.value}">
                    <label>${opt.label}</label>
                `;
        group.appendChild(wrap);
      });
    } else {
      let input = document.createElement("input");
      input.type = "text";
      input.name = data.key;
      input.placeholder = data.placeholder;
      input.value = userSelections[data.key] || "";
      group.appendChild(input);
    }

    formContainer.appendChild(group);
    updateProgress();
  }

  function updateProgress() {
    progressText.textContent = `Step ${currentStep} of ${totalSteps}`;
    progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
    prevButton.style.display = currentStep === 1 ? "none" : "inline-block";
    nextButton.textContent = currentStep === totalSteps ? "Finish" : "Next";
  }

  function saveStepData() {
    let stepData = questionnaire[currentStep];
    let el = formContainer.querySelector(
      "input[name='" +
        stepData.key +
        "']:checked, input[name='" +
        stepData.key +
        "']"
    );
    if (el) userSelections[stepData.key] = el.value;
  }

  /* ===================== NEXT BUTTON ===================== */

  nextButton.addEventListener("click", () => {
    saveStepData();

    if (!userSelections[questionnaire[currentStep].key]) {
      alert("Please fill this step.");
      return;
    }

    if (currentStep < totalSteps) {
      currentStep++;
      renderStep(currentStep);
    } else {
      showLoading();

      fetch("http://localhost:5000/api/resources/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userSelections),
      })
        .then((res) => res.json())
        .then((data) => {
          hideLoading();
          displayBackendResources(data.resources);
        })
        .catch(() => {
          hideLoading();
          alert("Server error. Try later!");
        });
    }
  });

  prevButton.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      renderStep(currentStep);
    }
  });

  /* ===================== LOADING ===================== */

  function showLoading() {
    document.getElementById("loading").style.display = "flex";
  }

  function hideLoading() {
    document.getElementById("loading").style.display = "none";
  }

  /* ===================== DISPLAY RESULTS ===================== */

  function displayBackendResources(resources) {
    formContainer.style.display = "none";
    prevButton.style.display = "none";
    nextButton.style.display = "none";

    summaryContainer.style.display = "block";
    resourcesContainer.innerHTML = "";

    resources.forEach((r, i) => {
      let card = document.createElement("div");
      card.className = "resource-card";
      card.style.animationDelay = `${i * 0.15}s`;

      card.innerHTML = `
                <div class="rank-badge">#${r.rank}</div>
                <h3>${r.title}</h3>
                <p>${r.description}</p>
                <p class="reason">✨ ${r.reason}</p>
                <a class="view-btn" href="${r.link}" target="_blank">
                    View Resource
                </a>
            `;

      resourcesContainer.appendChild(card);
    });
  }

  renderStep(currentStep);
});
