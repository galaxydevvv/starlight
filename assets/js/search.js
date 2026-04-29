function asTargetUrl(query) {
  const trimmed = query.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(trimmed)) return `https://${trimmed}`;
  return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
}

async function initSearch() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const status = document.getElementById("proxy-status");
  const urlLabel = document.getElementById("proxy-url");
  const iframe = document.getElementById("proxy-frame");
  const back = document.getElementById("proxy-back");
  const forward = document.getElementById("proxy-forward");
  const reload = document.getElementById("proxy-reload");

  if (!form || !input || !iframe) return;

  let lastProxyUrl = "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const target = asTargetUrl(input.value);
    if (!target) return;

    try {
      status.textContent = "Starting Scramjet...";
      urlLabel.textContent = target;
      const scramjet = await lunarProxy.ready();
      const proxiedUrl = scramjet.encodeUrl(target);
      lastProxyUrl = proxiedUrl;
      status.textContent = "Opening proxied page...";
      iframe.src = proxiedUrl;
    } catch (error) {
      status.textContent = `Proxy failed: ${error.message}`;
      urlLabel.textContent = "Scramjet did not finish loading.";
    }
  });

  iframe.addEventListener("load", () => {
    status.textContent = "Proxied session active.";

    try {
      const loadedUrl = iframe.contentWindow?.location?.href;
      if (loadedUrl) {
        lastProxyUrl = loadedUrl;
        urlLabel.textContent = loadedUrl;
      }
    } catch (error) {
      if (lastProxyUrl) urlLabel.textContent = lastProxyUrl;
    }
  });

  back.addEventListener("click", () => {
    try {
      iframe.contentWindow?.history.back();
    } catch (error) {
      status.textContent = "Back is unavailable for this embedded page.";
    }
  });

  forward.addEventListener("click", () => {
    try {
      iframe.contentWindow?.history.forward();
    } catch (error) {
      status.textContent = "Forward is unavailable for this embedded page.";
    }
  });

  reload.addEventListener("click", () => {
    try {
      iframe.contentWindow?.location.reload();
    } catch (error) {
      if (lastProxyUrl) {
        iframe.src = lastProxyUrl;
      } else {
        status.textContent = "Nothing to reload yet.";
      }
    }
  });
}

initSearch();
