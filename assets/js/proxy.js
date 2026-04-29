const lunarProxy = (() => {
  const state = { bootPromise: null, scramjet: null };
  const pageBase = new URL("./", window.location.href);

  function asset(path) {
    return new URL(path, pageBase).pathname;
  }

  async function boot() {
    if (state.scramjet) return state.scramjet;
    if (!("serviceWorker" in navigator)) throw new Error("This browser does not support service workers.");
    if (typeof BareMux === "undefined") throw new Error("BareMux failed to load.");
    if (typeof $scramjetLoadController !== "function") throw new Error("Scramjet controller failed to load.");

    await navigator.serviceWorker.register(asset("sw.js"), { scope: asset("./") });
    await navigator.serviceWorker.ready;

    const connection = new BareMux.BareMuxConnection(asset("assets/vendor/baremux/worker.js"));
    await connection.setTransport(asset("assets/vendor/epoxy/index.mjs"), [{ wisp: "wss://wisp.mercurywork.shop/" }]);

    const { ScramjetController } = $scramjetLoadController();
    const scramjet = new ScramjetController({
      prefix: asset("service/scramjet/"),
      files: {
        wasm: asset("assets/vendor/scram/scramjet.wasm.wasm"),
        all: asset("assets/vendor/scram/scramjet.all.js"),
        sync: asset("assets/vendor/scram/scramjet.sync.js"),
      },
    });

    await scramjet.init();
    state.scramjet = scramjet;
    return scramjet;
  }

  return {
    async ready() {
      if (!state.bootPromise) state.bootPromise = boot();
      return state.bootPromise;
    },
  };
})();
