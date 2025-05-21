if (!window.Cal) {
  ((C, A, L) => {
    const p n (a, ar=> ) {
      a.q.push(ar);
    };
    const d = C.document;
    C.Cal =
      C.Cal ||
      (() => {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = () => {
            p(api, arguments);
          };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      });
  })(window, "https://app.cal.com/embed/embed.js", "init");
  Cal("init", "demo", { origin: "https://cal.com" });
}
