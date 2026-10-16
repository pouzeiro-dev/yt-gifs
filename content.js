(() => {
  if (window.__ytgifsLoaded) return;
  window.__ytgifsLoaded = true;

  const FAVORITES_KEY = "ytgifs_favorites";
  const API_KEY_STORAGE = "ytgifs_giphy_key";
  const DEFAULT_API_KEY = "BQ9OMmLYPNLCqEKABgrcnRYFky8hzesq";

  let activeHost = null;
  let activeButton = null;
  let teardown = null;
  let scanTimer = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const isDark = () =>
    document.documentElement.hasAttribute("dark") ||
    document.documentElement.getAttribute("dark") === "true";

  /* ---------- Storage ---------- */

  function storageGet(key) {
    return new Promise(resolve => {
      try {
        chrome.storage.local.get([key], result => {
          resolve(chrome.runtime.lastError ? undefined : result?.[key]);
        });
      } catch {
        resolve(undefined);
      }
    });
  }

  function storageSet(values) {
    return new Promise(resolve => {
      try {
        chrome.storage.local.set(values, () => resolve());
      } catch {
        resolve();
      }
    });
  }

  async function getFavorites() {
    const list = (await storageGet(FAVORITES_KEY)) || [];
    return list.filter(item => item && item.source === "giphy" && item.id);
  }

  async function getApiKey() {
    return (await storageGet(API_KEY_STORAGE)) || DEFAULT_API_KEY;
  }

  async function askApiKey() {
    const current = (await storageGet(API_KEY_STORAGE)) || "";
    const key = prompt(
      "Cole sua chave da API do GIPHY (grátis em developers.giphy.com):",
      current
    );

    if (key === null || !key.trim()) return false;

    await storageSet({ [API_KEY_STORAGE]: key.trim() });
    return true;
  }

  /* ---------- API (GIPHY) ---------- */

  async function apiFetch(url) {
    let response = null;

    try {
      response = await chrome.runtime.sendMessage({ type: "ytgifs-fetch", url });
    } catch {
      response = null;
    }

    if (response) {
      if (response.ok) return response.data;
      throw new Error(response.error || "Falha na API");
    }

    const direct = await fetch(url);
    if (!direct.ok) throw new Error(`HTTP ${direct.status}`);
    return direct.json();
  }

  function mapGif(gif) {
    const images = gif.images || {};

    const preview =
      images.fixed_width_small?.url ||
      images.fixed_width?.url ||
      images.preview_gif?.url ||
      images.original?.url;

    return {
      id: gif.id,
      source: "giphy",
      title: gif.title || "GIF",
      preview,
      url: `https://media.giphy.com/media/${gif.id}/giphy.gif`
    };
  }

  async function fetchGifs(query) {
    const key = await getApiKey();

    if (!key) {
      const error = new Error("NO_KEY");
      error.code = "NO_KEY";
      throw error;
    }

    const url = new URL(
      query
        ? "https://api.giphy.com/v1/gifs/search"
        : "https://api.giphy.com/v1/gifs/trending"
    );

    url.searchParams.set("api_key", key);
    url.searchParams.set("limit", "30");
    url.searchParams.set("rating", "pg-13");
    url.searchParams.set("lang", "pt");

    if (query) url.searchParams.set("q", query);

    const data = await apiFetch(url.toString());

    return (data.data || []).map(mapGif).filter(item => item.id && item.preview);
  }

  /* ---------- Toast ---------- */

  function showToast(message) {
    $(".ytgifs-toast")?.remove();

    const toast = document.createElement("div");
    toast.className = "ytgifs-toast";
    toast.textContent = message;

    toast.style.cssText = `
      position:fixed!important; z-index:2147483647!important;
      bottom:25px!important; left:50%!important;
      transform:translateX(-50%)!important;
      background:#282828!important; color:#fff!important;
      padding:12px 18px!important; border-radius:8px!important;
      box-shadow:0 3px 12px #0004!important;
      font:13px Roboto,Arial,sans-serif!important;
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  /* ---------- Botão ---------- */

  const BUTTON_SVG = `
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"
         style="display:block;pointer-events:none">
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5"
            fill="none" stroke="currentColor" stroke-width="1.7"/>
      <text x="12" y="14.6" text-anchor="middle" fill="currentColor"
            font-family="Roboto,Arial,sans-serif" font-size="7.4"
            font-weight="700" letter-spacing=".2">GIF</text>
    </svg>
  `;

  function findCommentBoxes() {
    const boxes = new Set();

    $$("ytd-commentbox, ytd-comment-simplebox-renderer").forEach(box => {
      if (!box.isConnected || box.getClientRects().length === 0) return;

      // evita botão duplicado
      if (
        box.matches("ytd-comment-simplebox-renderer") &&
        box.querySelector("ytd-commentbox")
      ) {
        return;
      }

      boxes.add(box);
    });

    return [...boxes];
  }

  function findEditor(host) {
    return host.querySelector('#contenteditable-root, [contenteditable="true"]');
  }

  function createButton(host) {
    if (!host || !host.isConnected) return;
    if (host.querySelector(".ytgifs-button")) return;

    const button = document.createElement("button");

    button.type = "button";
    button.className = "ytgifs-button";
    button.title = "Escolher GIF";
    button.setAttribute("aria-label", "Escolher GIF");
    button.innerHTML = BUTTON_SVG;

    button.style.cssText = `
      display:inline-flex!important; align-items:center!important;
      justify-content:center!important; flex:none!important;
      width:40px!important; height:40px!important; padding:0!important;
      margin:0 2px!important; border:0!important; border-radius:50%!important;
      background:transparent!important; cursor:pointer!important;
      color:var(--yt-spec-text-secondary,#606060)!important;
      visibility:visible!important; opacity:1!important;
      transition:background .15s!important;
    `;

    button.addEventListener("mouseenter", () => {
      button.style.setProperty("background", "rgba(128,128,128,.22)", "important");
    });

    button.addEventListener("mouseleave", () => {
      button.style.setProperty("background", "transparent", "important");
    });

    button.addEventListener("click", async event => {
      event.preventDefault();
      event.stopPropagation();

      if (activeButton === button && activeHost) {
        closePopup();
        return;
      }

      closePopup();

      const placeholder = host.querySelector(
        "#placeholder-area, #simplebox-placeholder"
      );

      if (placeholder && !findEditor(host)) placeholder.click();

      let editor = null;

      for (let i = 0; i < 20; i++) {
        editor = findEditor(host);
        if (editor) break;
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (!editor) {
        showToast("Abra a caixa de comentário antes de escolher um GIF.");
        return;
      }

      activeButton = button;
      openPopup(button, editor);
    });

    const emoji = host.querySelector("#emoji-button");
    const buttons = host.querySelector("#buttons");

    if (emoji) {
      emoji.after(button);
    } else if (buttons) {
      buttons.prepend(button);
    } else {
      const row = document.createElement("div");

      row.style.cssText = `
        display:flex!important; align-items:center!important;
        min-height:40px!important; margin:4px 0!important;
      `;

      row.appendChild(button);
      host.appendChild(row);
    }
  }

  /* ---------- Popup (Shadow DOM: isolado do CSS do YouTube) ---------- */

  function closePopup() {
    if (teardown) teardown();
    if (activeHost) activeHost.remove();

    teardown = null;
    activeHost = null;
    activeButton = null;
  }

  function positionPopup(host, button) {
    const rect = button.getBoundingClientRect();
    const width = host.offsetWidth;
    const height = host.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const gap = 10;

    const left = Math.min(Math.max(8, rect.left), viewportWidth - width - 8);

    host.style.setProperty("left", `${left}px`, "important");

    if (rect.top - gap - height >= 8) {
      // cabe acima: ancora pela borda de baixo, então o popup
      // cresce sempre pra cima e nunca cobre o botão
      host.style.setProperty("top", "auto", "important");
      host.style.setProperty(
        "bottom",
        `${viewportHeight - rect.top + gap}px`,
        "important"
      );
    } else {
      // sem espaço acima: abre abaixo do botão
      host.style.setProperty("bottom", "auto", "important");
      host.style.setProperty(
        "top",
        `${Math.min(rect.bottom + gap, Math.max(8, viewportHeight - height - 8))}px`,
        "important"
      );
    }
  }

  const POPUP_CSS = `
    :host { all: initial; }

    *, *::before, *::after { box-sizing: border-box; }
    [hidden] { display: none !important; }

    .popup {
      --bg: #ffffff; --fg: #0f0f0f; --muted: #606060;
      --line: #e0e0e0; --chip: #f2f2f2; --chip-hover: #e5e5e5;
      width: 340px; max-width: calc(100vw - 16px);
      background: var(--bg); color: var(--fg);
      border: 1px solid var(--line); border-radius: 14px;
      box-shadow: 0 8px 28px rgba(0,0,0,.28);
      overflow: hidden;
      font: 13px/1.4 Roboto, Arial, sans-serif;
      text-align: left;
    }
    .popup.dark {
      --bg: #212121; --fg: #f1f1f1; --muted: #aaaaaa;
      --line: #3f3f3f; --chip: #3a3a3a; --chip-hover: #4a4a4a;
    }

    button { font: inherit; color: inherit; }

    .head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 12px 6px 14px;
    }
    .brand { display: flex; align-items: center; gap: 8px; font-size: 14px; }
    .mark {
      background: #ff0033; color: #fff; border-radius: 5px;
      padding: 1px 6px; font-size: 11px; font-weight: 700;
    }
    .head-actions { display: flex; gap: 2px; }
    .icon-btn {
      width: 30px; height: 30px; border: 0; border-radius: 50%;
      background: transparent; cursor: pointer; font-size: 18px; line-height: 1;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .icon-btn:hover { background: var(--chip); }

    .search { display: flex; gap: 6px; padding: 6px 12px; }
    .search input {
      flex: 1; min-width: 0; height: 36px; padding: 0 14px;
      border: 1px solid var(--line); border-radius: 18px;
      background: transparent; color: var(--fg);
      font: inherit; outline: none;
    }
    .search input::placeholder { color: var(--muted); }
    .search input:focus { border-color: #3ea6ff; }
    .search-btn {
      width: 36px; height: 36px; flex: none; border: 0; border-radius: 50%;
      background: var(--chip); cursor: pointer; font-size: 16px;
    }
    .search-btn:hover { background: var(--chip-hover); }

    .tabs { display: flex; gap: 6px; padding: 2px 12px 8px; }
    .tab {
      height: 30px; padding: 0 14px; border: 0; border-radius: 8px;
      background: var(--chip); cursor: pointer;
    }
    .tab:hover { background: var(--chip-hover); }
    .tab.selected { background: var(--fg); color: var(--bg); }

    .status { padding: 4px 14px 8px; color: var(--muted); }
    .key-btn {
      display: block; margin-top: 8px; height: 32px; padding: 0 14px;
      border: 0; border-radius: 16px; cursor: pointer;
      background: #065fd4; color: #fff;
    }

    .grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 84px; gap: 6px; align-content: start;
      height: 252px; overflow-y: auto; padding: 4px 12px 10px;
    }
    .card {
      position: relative; min-width: 0; overflow: hidden;
      border-radius: 8px; background: var(--chip); cursor: pointer;
    }
    .card img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .card:hover { outline: 2px solid #3ea6ff; outline-offset: -2px; }
    .heart {
      position: absolute; right: 4px; top: 4px; width: 26px; height: 26px;
      border: 0; border-radius: 50%; background: rgba(0,0,0,.6);
      color: #fff; font-size: 15px; line-height: 1; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
    }

    .footer {
      padding: 8px 14px 10px; font-size: 11px; color: var(--muted);
      border-top: 1px solid var(--line);
    }
  `;

  function openPopup(button, editor) {
    const host = document.createElement("div");
    host.className = "ytgifs-host";

    host.style.cssText = `
      all:initial!important; display:block!important;
      position:fixed!important; z-index:2147483647!important;
      left:0!important; top:0!important; width:340px!important;
      max-width:calc(100vw - 16px)!important;
    `;

    const root = host.attachShadow({ mode: "open" });

    root.innerHTML = `
      <style>${POPUP_CSS}</style>
      <section class="popup ${isDark() ? "dark" : ""}">
        <header class="head">
          <div class="brand"><span class="mark">GIF</span><b>YTGifs</b></div>
          <div class="head-actions">
            <button class="icon-btn settings" title="Chave da API" aria-label="Chave da API">⚙</button>
            <button class="icon-btn close" title="Fechar" aria-label="Fechar">✕</button>
          </div>
        </header>

        <div class="search">
          <input type="search" placeholder="Pesquisar GIFs" aria-label="Pesquisar GIFs">
          <button class="search-btn" aria-label="Pesquisar">🔍</button>
        </div>

        <nav class="tabs">
          <button class="tab selected" data-tab="trending">Em alta</button>
          <button class="tab" data-tab="favorites">Favoritos</button>
        </nav>

        <div class="status">Carregando GIFs…</div>
        <div class="grid"></div>

        <footer class="footer">Powered by GIPHY · YTGifs</footer>
      </section>
    `;

    document.body.appendChild(host);
    activeHost = host;

    const input = $("input", root);
    const grid = $(".grid", root);
    const status = $(".status", root);
    const tabs = $$(".tab", root);

    let currentTab = "trending";
    let requestNumber = 0;

    const reposition = () => positionPopup(host, button);

    const onOutside = event => {
      const path = event.composedPath();
      if (!path.includes(host) && !path.includes(button)) closePopup();
    };

    const onKey = event => {
      if (event.key === "Escape") closePopup();
    };

    document.addEventListener("mousedown", onOutside, true);
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);

    const resizeObserver = new ResizeObserver(reposition);
    resizeObserver.observe(host);

    teardown = () => {
      resizeObserver.disconnect();
      document.removeEventListener("mousedown", onOutside, true);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };

    reposition();

    // impede atalhos do YouTube enquanto digita
    ["keydown", "keyup", "keypress"].forEach(type => {
      input.addEventListener(type, event => event.stopPropagation());
    });

    function setStatus(text, withKeyButton = false) {
      status.hidden = !text;
      status.replaceChildren(document.createTextNode(text || ""));

      if (withKeyButton) {
        const configure = document.createElement("button");
        configure.className = "key-btn";
        configure.textContent = "Configurar chave do GIPHY";

        configure.addEventListener("click", async () => {
          if (await askApiKey()) search(input.value.trim());
        });

        status.appendChild(configure);
      }
    }

    async function render(items, request) {
      const favorites = await getFavorites();

      if (request !== requestNumber) return;

      grid.replaceChildren();

      setStatus(
        items.length
          ? ""
          : currentTab === "favorites"
            ? "Você ainda não tem GIFs favoritos."
            : "Nenhum GIF encontrado."
      );

      for (const item of items) {
        const card = document.createElement("div");
        card.className = "card";

        const image = document.createElement("img");
        image.src = item.preview;
        image.alt = item.title || "GIF";
        image.loading = "lazy";

        const heart = document.createElement("button");
        heart.className = "heart";
        heart.title = "Adicionar ou remover favorito";

        const isFavorite = favorites.some(favorite => favorite.id === item.id);

        heart.textContent = isFavorite ? "♥" : "♡";
        heart.style.color = isFavorite ? "#ff4b69" : "#fff";

        heart.addEventListener("click", async event => {
          event.stopPropagation();

          const list = await getFavorites();
          const exists = list.some(favorite => favorite.id === item.id);

          const updated = exists
            ? list.filter(favorite => favorite.id !== item.id)
            : [...list, item];

          await storageSet({ [FAVORITES_KEY]: updated });

          heart.textContent = exists ? "♡" : "♥";
          heart.style.color = exists ? "#fff" : "#ff4b69";

          if (currentTab === "favorites" && exists) {
            search(input.value.trim());
          }
        });

        card.append(image, heart);
        card.addEventListener("click", () => insertGif(item, editor));

        grid.appendChild(card);
      }
    }

    async function search(query = "") {
      const request = ++requestNumber;

      grid.replaceChildren();
      setStatus("Carregando GIFs…");

      if (currentTab === "favorites") {
        const favorites = await getFavorites();
        const q = query.toLowerCase();

        const filtered = q
          ? favorites.filter(item => (item.title || "").toLowerCase().includes(q))
          : favorites;

        await render(filtered, request);
        return;
      }

      try {
        const items = await fetchGifs(query);

        if (request !== requestNumber) return;

        await render(items, request);
      } catch (error) {
        if (request !== requestNumber) return;

        const message = String(error.message || "");

        if (error.code === "NO_KEY") {
          setStatus("Para buscar GIFs, configure sua chave gratuita do GIPHY.", true);
        } else if (/HTTP 40[13]/.test(message)) {
          setStatus("Chave do GIPHY inválida ou sem permissão.", true);
        } else if (/HTTP 429/.test(message)) {
          setStatus("Limite de requisições do GIPHY atingido. Tente mais tarde.");
        } else {
          setStatus("Não foi possível carregar os GIFs.", true);
        }
      }
    }

    $(".close", root).addEventListener("click", closePopup);

    $(".settings", root).addEventListener("click", async () => {
      if (await askApiKey()) search(input.value.trim());
    });

    $(".search-btn", root).addEventListener("click", () =>
      search(input.value.trim())
    );

    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        search(input.value.trim());
      }
    });

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        currentTab = tab.dataset.tab;

        tabs.forEach(other => other.classList.toggle("selected", other === tab));

        search(input.value.trim());
      });
    });

    search();
  }

  function insertGif(item, editor) {
    const marker = `[YTGifs:${item.id}]`;

    editor.focus();

    const selection = window.getSelection();

    if (
      selection &&
      (!selection.rangeCount || !editor.contains(selection.anchorNode))
    ) {
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    let inserted = false;

    try {
      inserted = document.execCommand("insertText", false, marker);
    } catch {
      inserted = false;
    }

    if (!inserted) {
      editor.textContent = (editor.textContent || "") + marker;

      editor.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          inputType: "insertText",
          data: marker
        })
      );
    }

    closePopup();
    showToast("GIF inserido! Clique em Comentar para publicar (só quem tem a extensão ou app do YTGifs pode ver o seu gif)!");
  }

  /* ---------- GIFs nos comentários ---------- */

  function isAllowedLegacyHost(hostname) {
    return /(^|\.)(tenor|giphy)\.com$/.test(hostname);
  }

  function renderSharedGifs() {
    const nodes = $$("#content-text").filter(
      node =>
        node.closest(
          "ytd-comment-view-model, ytd-comment-renderer, ytd-comment-thread-renderer"
        ) && node.textContent.includes("[YTGifs")
    );

    for (const node of nodes) {
      const text = node.textContent;

      const pattern =
        /\[YTGifs:([A-Za-z0-9]+)\]|\[YTGifs\]\s*(https?:\/\/[^\s\]]+)\s*\[\/YTGifs\]/g;

      const fragment = document.createDocumentFragment();

      let match;
      let lastIndex = 0;
      let found = false;

      while ((match = pattern.exec(text))) {
        let src = null;

        if (match[1]) {
          src = `https://media.giphy.com/media/${match[1]}/giphy.gif`;
        } else {
          try {
            const url = new URL(match[2]);

            if (url.protocol === "https:" && isAllowedLegacyHost(url.hostname)) {
              src = url.href;
            }
          } catch {
            src = null;
          }
        }

        if (!src) continue;

        found = true;

        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, match.index))
        );

        const image = document.createElement("img");
        image.src = src;
        image.alt = "GIF compartilhado pelo YTGifs";
        image.loading = "lazy";
        image.className = "ytgifs-rendered";

        image.style.cssText = `
          display:inline-block; max-width:240px; max-height:180px;
          width:auto; height:auto; object-fit:contain;
          border-radius:8px; vertical-align:middle; margin:5px 3px;
        `;

        fragment.appendChild(image);
        lastIndex = pattern.lastIndex;
      }

      if (found) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        node.replaceChildren(fragment);
      }
    }
  }

  /* ---------- Varredura ---------- */

  function scan() {
    findCommentBoxes().forEach(createButton);
    renderSharedGifs();
  }

  const observer = new MutationObserver(() => {
    if (scanTimer) clearTimeout(scanTimer);
    scanTimer = setTimeout(scan, 150);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  scan();
})();
