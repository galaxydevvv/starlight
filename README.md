# Lunar

This is a multi-page HTML site styled after your screenshots.

- `index.html` is the home screen
- `search.html` is the proxied search page
- `games.html` is the game grid
- `player.html` loads HTML files from `content/games`

## How the game loader works

The site fetches `content/games/manifest.json`, renders cards from it, and opens the matching HTML file inside the player page.

To add your own game:

1. Drop a new HTML file into `content/games`
2. Add a new entry to `content/games/manifest.json`
3. Refresh the site

## How the proxy search works

This build uses locally vendored browser files for:

- `@mercuryworkshop/scramjet`
- `@mercuryworkshop/bare-mux`
- `@mercuryworkshop/epoxy-transport`

The search page registers `sw.js`, initializes BareMux, sets Epoxy transport with the public Wisp server, then opens pages in a Scramjet-controlled iframe.

Docs used:

- [Scramjet setup](https://docs.titaniumnetwork.org/proxies/scramjet)
- [bare-mux usage](https://docs.titaniumnetwork.org/transports/bare-mux)
- [EpoxyTransport usage](https://docs.titaniumnetwork.org/transports/epoxy-transport/)

## Run it

Double-click `launch-lunar.bat`

That starts a local PowerShell web server at `http://localhost:8080`.

Do not open the HTML files directly with `file://`, because the service worker, fetch calls, and proxy iframe need a local web server.
