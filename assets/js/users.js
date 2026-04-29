async function initVisitorCounter() {
  const counter = document.getElementById("visitor-count");
  if (!counter) return;

  const namespace = `${window.location.hostname || "local"}.lunar-site`;
  const key = "visitors";
  const marker = `lunar-visitor-hit:${new Date().toISOString().slice(0, 10)}`;

  try {
    const endpoint = sessionStorage.getItem(marker)
      ? `https://api.countapi.xyz/get/${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`
      : `https://api.countapi.xyz/hit/${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`;

    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("Counter request failed.");
    }

    const data = await response.json();
    if (!sessionStorage.getItem(marker)) {
      sessionStorage.setItem(marker, "1");
    }

    counter.textContent = Number(data.value || 0).toLocaleString();
  } catch (error) {
    counter.textContent = "--";
  }
}

initVisitorCounter();
