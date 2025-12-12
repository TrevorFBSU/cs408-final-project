const API_BASE = "https://rg7endbzic.execute-api.us-east-2.amazonaws.com"; // no trailing slash

async function apiRequest(path, options = {}) {
  const fetchOptions = {
    method: options.method || "GET",
    headers: options.headers || {},
  };

  // Only set JSON header if we're sending a body
  if (options.body !== undefined) {
    fetchOptions.headers["Content-Type"] = "application/json";
    fetchOptions.body =
      typeof options.body === "string" ? options.body : JSON.stringify(options.body);
  }

  const res = await fetch(`${API_BASE}${path}`, fetchOptions);

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; }
  catch { data = text; }

  if (!res.ok) {
    const msg = (data && data.message) ? data.message : `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

function sanitizeText(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim();
}

window.apiRequest = apiRequest;
window.sanitizeText = sanitizeText;


// Allow tests to import in Node without breaking the browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = { apiRequest, sanitizeText };
}

