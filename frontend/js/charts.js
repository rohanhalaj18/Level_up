export function renderBar(canvasId, labels, data) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Score",
          data,
          backgroundColor: labels.map(() => "rgba(45,212,191,0.9)"),
        },
      ],
    },
    options: { scales: { y: { beginAtZero: true, max: 10 } } },
  });
}

export function renderRadar(canvasId, labels, data) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  new Chart(ctx, {
    type: "radar",
    data: {
      labels,
      datasets: [{ label: "Avg metrics", data }],
    },
    options: { scales: { r: { beginAtZero: true, max: 10 } } },
  });
}
