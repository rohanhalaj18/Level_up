// JavaScript for introdream page

document.addEventListener("DOMContentLoaded", function () {
  const lines = [
    "Your college, your path — simplified.",
    "Find where your future fits.",
    "Right choice. Right campus.",
    "Stop guessing. Start choosing smart.",
    "Let data guide your destiny.",
  ];

  const typewriterElement = document.getElementById("typewriter");
  let lineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentLine = lines[lineIndex];
    if (isDeleting) {
      typewriterElement.textContent = currentLine.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentLine.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentLine.length) {
      setTimeout(() => (isDeleting = true), 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      lineIndex++;
      if (lineIndex === lines.length) {
        lineIndex = 0;
      }
    }

    const typingSpeed = isDeleting ? 100 : 150;
    setTimeout(type, typingSpeed);
  }

  type();
});
