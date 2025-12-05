// frontend/js/utils.js

// 🔁 REPLACE this with your real Invoke URL (without trailing slash)
const API_BASE = "https://rg7endbzic.execute-api.us-east-2.amazonaws.com/";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  // Try to parse JSON, but don't crash if body is empty
  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    data = null;
  }

  if (!response.ok) {
    const message = data && data.message ? data.message : `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

// Simple sanitizer – we'll reuse this everywhere
function sanitizeText(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim();
}

// Make available to other scripts (no modules needed)
window.apiRequest = apiRequest;
window.sanitizeText = sanitizeText;
