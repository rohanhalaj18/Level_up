document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dream-college-form");
  if (!form) return;

  const questions = form.querySelectorAll(".question");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const submitBtn = document.getElementById("submit-btn");
  const stepCounter = document.getElementById("step-counter");
  const progressBarFill = document.querySelector(".progress-bar-fill");

  const loadingScreen = document.getElementById("loading");
  const resultsSection = document.getElementById("college-results");
  const resultsContainer = document.getElementById("result-cards");

  let currentStep = 1;
  const totalSteps = questions.length;

  const updateFormView = () => {
    stepCounter.textContent = `Step ${currentStep} of ${totalSteps}`;

    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressBarFill.style.width = `${progressPercent}%`;

    questions.forEach((q) => {
      const step = parseInt(q.dataset.step);
      q.classList.toggle("active", step === currentStep);
    });

    prevBtn.style.display = currentStep === 1 ? "none" : "inline-block";
    nextBtn.style.display =
      currentStep === totalSteps ? "none" : "inline-block";
    submitBtn.style.display =
      currentStep === totalSteps ? "inline-block" : "none";
  };

  nextBtn.addEventListener("click", () => {
    const currentQuestion = form.querySelector(
      `.question[data-step="${currentStep}"]`
    );
    const input = currentQuestion.querySelector("input");

    if (input && input.hasAttribute("required") && !input.value.trim()) {
      alert("This field is required.");
      return;
    }

    if (currentStep < totalSteps) {
      currentStep++;
      updateFormView();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateFormView();
    }
  });

  /* ---------------- BACKEND SUBMIT ---------------- */

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const submissionData = {};
    for (const [key, value] of formData.entries()) {
      submissionData[key] = value;
    }

    loadingScreen.style.display = "flex";

    try {
      const res = await fetch("http://localhost:5000/api/college-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();
      loadingScreen.style.display = "none";

      displayCollegeResults(data.data);
    } catch (error) {
      loadingScreen.style.display = "none";
      alert("Something went wrong. Try again later.");
    }
  });

  /* ---------------- SHOW RESULTS ---------------- */

  function displayCollegeResults(colleges) {
    form.style.display = "none";
    resultsSection.style.display = "block";
    resultsContainer.innerHTML = "";

    colleges.forEach((college, i) => {
      const card = document.createElement("div");
      card.className = "college-card";
      card.style.animationDelay = `${i * 0.15}s`;

      card.innerHTML = `
        <div class="rank-badge">⭐ ${college.fitScore}% Match</div>
        <h3>${college.collegeName}</h3>
        <p><b>Location:</b> ${college.location}</p>
        <p><b>Reason:</b> ${college.reason}</p>
        <p><b>Fees:</b> ${college.approximateFees}</p>
        <p><b>Entrance Exam:</b> ${college.entranceExam}</p>

        <a href="${college.link}" target="_blank" class="view-btn">Visit Website</a>
      `;

      resultsContainer.appendChild(card);
    });

    resultsSection.scrollIntoView({ behavior: "smooth" });
  }

  updateFormView();
});
