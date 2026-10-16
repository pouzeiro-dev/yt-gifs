// Service worker (Manifest V3): faz as chamadas à API do GIPHY
// fora da página do YouTube, evitando problemas de CORS/CSP.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== "ytgifs-fetch") return;

  let url;

  try {
    url = new URL(message.url);
  } catch {
    sendResponse({ ok: false, error: "URL inválida" });
    return;
  }

  if (url.protocol !== "https:" || url.hostname !== "api.giphy.com") {
    sendResponse({ ok: false, error: "Host não permitido" });
    return;
  }

  fetch(url.href)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => sendResponse({ ok: true, data }))
    .catch(error => sendResponse({ ok: false, error: String(error.message || error) }));

  return true; // mantém o canal aberto para a resposta assíncrona
});
