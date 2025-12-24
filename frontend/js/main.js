// THEME SWITCHER
const themeSwitcher = document.getElementById("theme-switcher");
const themeIcon = themeSwitcher?.querySelector("i");

themeSwitcher?.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  } else {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }
});

// INTERSECTION OBSERVER FOR GRAPH ANIMATION
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Animate Bars
        const bars = entry.target.querySelectorAll(".bar");
        bars.forEach((bar) => {
          const height = bar.getAttribute("data-height");
          bar.style.height = `${height}%`; // FIXED
        });

        // Animate Numbers
        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          const finalValue = parseInt(
            stat.parentElement.getAttribute("data-height")
          );
          let startValue = 0;

          const duration = 1000; // ms
          const stepTime = 20; // ms
          const steps = duration / stepTime;
          const increment = finalValue / steps;

          const counter = setInterval(() => {
            startValue += increment;

            if (startValue >= finalValue) {
              startValue = finalValue;
              clearInterval(counter);
            }

            stat.textContent = `${Math.round(startValue)}%`; // FIXED
          }, stepTime);
        });

        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

// APPLY OBSERVER TO GRAPH
const statsGraph = document.querySelector(".stats-graph");
if (statsGraph) {
  observer.observe(statsGraph);
}

// DYNAMIC FADE TEXT ANIMATION
const dynamicText = document.getElementById("dynamic-text");
const words = ["engineering", "upskilling", "placement", "coding"];
let wordIndex = 0;

setInterval(() => {
  dynamicText.classList.add("fade-out");

  setTimeout(() => {
    wordIndex = (wordIndex + 1) % words.length;
    dynamicText.textContent = words[wordIndex];
    dynamicText.classList.remove("fade-out");
  }, 500);
}, 2000);

const signupButton = document.querySelector(".signup");
signupButton.addEventListener("click", () => {
  window.location.href = "../pages/service.html";
});
