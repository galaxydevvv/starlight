async function loadManifest() {
  const response = await fetch(new URL("../content/games/manifest.json", window.location.href));
  if (!response.ok) throw new Error("Could not load game manifest.");
  return response.json();
}

function createFeaturedCard(game, compact) {
  const anchor = document.createElement("a");
  anchor.className = "featured-card" + (compact ? " is-small" : "");
  anchor.href = `/player.html?game=${encodeURIComponent(game.slug)}`;
  anchor.innerHTML = `<span>${game.title}</span>`;
  return anchor;
}

async function initHome() {
  const featuredRoot = document.getElementById("featured-games");
  if (!featuredRoot) return;

  try {
    const games = await loadManifest();
    games.filter((game) => game.featured).forEach((game, index) => {
      featuredRoot.appendChild(createFeaturedCard(game, index > 1));
    });
  } catch (error) {
    featuredRoot.innerHTML = "<p>Unable to load featured games.</p>";
  }
}

initHome();
