async function loadGames() {
  const response = await fetch(new URL("../content/games/manifest.json", window.location.href));
  if (!response.ok) throw new Error("Could not load games.");
  return response.json();
}

function createGameCard(game) {
  const anchor = document.createElement("a");
  anchor.className = "game-card";
  anchor.href = `/player.html?game=${encodeURIComponent(game.slug)}`;
  anchor.innerHTML = `
    <div class="game-card-tag">${game.category}</div>
    <div class="game-card-title">${game.title}</div>
  `;
  return anchor;
}

async function initGames() {
  const grid = document.getElementById("games-grid");
  if (!grid) return;

  try {
    const games = await loadGames();
    games.forEach((game) => grid.appendChild(createGameCard(game)));
  } catch (error) {
    grid.innerHTML = "<p>Unable to load games.</p>";
  }
}

initGames();
