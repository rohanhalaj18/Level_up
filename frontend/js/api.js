const BASE = "http://localhost:5000";

export async function generateQuestions(payload) {
  const res = await fetch(`${BASE}/api/interview/generate-questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "gen failed");
  }
  return res.json();
}

export async function startInterview(payload) {
  const res = await fetch(`${BASE}/api/interview/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "start failed");
  }
  return res.json();
}

export async function uploadAudios(formData) {
  const res = await fetch(`${BASE}/api/interview/upload-audios`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "upload failed");
  }
  return res.json();
}

export async function fetchResult(sessionId) {
  const res = await fetch(`${BASE}/api/interview/result/${sessionId}`);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "fetch failed");
  }
  return res.json();
}
export async function getResult(id) {
  const res = await fetch(`http://localhost:5000/api/interview/result/${id}`);
  return res.json();
}

export async function getRound2Problems(company) {
  const res = await fetch(`${BASE}/api/placement/round2/${company}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to load problems");
  }

  return await res.json();
}

// SUBMIT CODE
export async function submitRound2(body) {
  const res = await fetch(`${BASE}/api/placement/round2/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Submit failed");
  return res.json();
}