async function loadManifest() {
  const response = await fetch(new URL("./content/games/manifest.json", window.location.href));
  if (!response.ok) throw new Error("Could not load game manifest.");
  return response.json();
}

const embeddedTheme = `
<style>
  body { margin: 0; min-height: 100vh; }
  .html-demo {
    display: grid;
    place-items: center;
    background: radial-gradient(circle at top, rgba(127, 4, 255, 0.32), transparent 40%), linear-gradient(180deg, #ffffff 0%, #f3f3f6 100%);
    color: #090909;
    font-family: Arial, Helvetica, sans-serif;
  }
  .html-demo h1 {
    margin: 0;
    font-size: clamp(3rem, 8vw, 6.5rem);
    transform: rotate(-8deg);
    filter: blur(1px);
  }
  .arcade-demo {
    padding: 28px;
    background: radial-gradient(circle at top, rgba(117, 0, 255, 0.3), transparent 35%), linear-gradient(160deg, #070710, #17072e 48%, #09060f);
    color: #fff;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
  .arcade-demo .tile {
    display: inline-block;
    margin: 12px;
    padding: 18px 22px;
    border-radius: 20px;
    background: linear-gradient(180deg, #8500ff, #5a00d4);
  }
</style>
`;

function getGameSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("game") || "html-demo";
}

function applyEmbeddedTheme(html) {
  if (html.includes("</head>")) {
    return html.replace("</head>", `${embeddedTheme}</head>`);
  }

  return `${embeddedTheme}${html}`;
}

async function initPlayer() {
  const slug = getGameSlug();
  const frame = document.getElementById("game-frame");
  const title = document.getElementById("player-title");
  const status = document.getElementById("player-status");

  try {
    const games = await loadManifest();
    const game = games.find((entry) => entry.slug === slug);
    if (!game) throw new Error("Game not found.");

    title.textContent = game.title;
    document.title = `Lunar | ${game.title}`;

    const response = await fetch(new URL(`./content/games/${game.file}`, window.location.href));
    if (!response.ok) throw new Error("Could not fetch the game file.");

    const html = await response.text();
    frame.srcdoc = applyEmbeddedTheme(html);
    status.textContent = `Loaded /content/games/${game.file}`;
  } catch (error) {
    status.textContent = error.message;
    frame.srcdoc = "<!DOCTYPE html><html lang=\"en\"><body class=\"html-demo\"><h1>failed to load file</h1></body></html>";
  }
}

initPlayer();
