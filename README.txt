# YTGifs 🎞️

**Share GIFs in YouTube comments with other YTGifs users.**

A Chromium browser extension that adds a GIF picker to YouTube comments. Choose a GIF, let YTGifs insert a token into your comment, and post it normally.

<p align="center">
  <img src="icons/icon128.png" alt="YTGifs icon" width="110">
</p>

<p align="center">
  <a href="#português-🇧🇷">Português</a> ·
  <a href="#english-🇺🇸">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Browser-Chromium-red?logo=googlechrome&logoColor=white" alt="Chromium">
  <img src="https://img.shields.io/badge/Platform-YouTube-red?logo=youtube&logoColor=white" alt="YouTube">
  <img src="https://img.shields.io/badge/Format-Manifest%20V3-blue" alt="Manifest V3">
  <img src="https://img.shields.io/badge/Language-JavaScript-yellow?logo=javascript&logoColor=black" alt="JavaScript">
</p>

---

## 📑 Contents

- [Português 🇧🇷](#português-🇧🇷)
  - [Como funciona](#como-funciona)
  - [Instalação](#instalação)
  - [Como usar](#como-usar)
  - [Limitações](#limitações)
  - [Solução de problemas](#solução-de-problemas)
  - [Privacidade](#privacidade)
- [English 🇺🇸](#english-🇺🇸)
  - [How it works](#how-it-works)
  - [Installation](#installation)
  - [How to use](#how-to-use)
  - [Limitations](#limitations)
  - [Troubleshooting](#troubleshooting)
  - [Privacy](#privacy)
- [Contributing](#contributing)
- [License](#license)

# Português 🇧🇷

## ✨ Sobre o projeto

O YTGifs é uma extensão para navegadores baseados em Chromium que permite compartilhar GIFs nos comentários e respostas do YouTube com outros usuários que também tenham a extensão instalada.

O objetivo é tornar os comentários mais expressivos e divertidos, adicionando uma maneira prática de compartilhar GIFs.

## 🚀 Como funciona

1. Abra um vídeo do YouTube.
2. Entre nos comentários e clique no botão GIF.
3. Escolha o GIF que deseja compartilhar.
4. O YTGifs insere um token no campo do comentário, parecido com este:

   `[ytgifs:AJUDKCdjkdkd]`

5. Publique o comentário normalmente.
6. Quando outro usuário com o YTGifs visualizar o comentário, a extensão tentará reconhecer o token e exibir o GIF correspondente.

**Importante:** o GIF não é enviado como um anexo nativo do YouTube. O token identifica o conteúdo para as instalações compatíveis da extensão.

## 📦 Instalação

### Google Chrome, Microsoft Edge, Brave e outros navegadores Chromium

1. Baixe ou clone este repositório.
2. Extraia o arquivo ZIP, caso tenha baixado o projeto compactado.
3. Abra a página de extensões do navegador:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
4. Ative o **Modo do desenvolvedor**.
5. Clique em **Carregar sem compactação**.
6. Selecione a pasta do projeto que contém o arquivo `manifest.json`.
7. Abra ou atualize uma página do YouTube.

A extensão será carregada localmente no navegador.

## 🎬 Como usar

1. Abra um vídeo e localize a caixa de comentários.
2. Clique no botão GIF adicionado pelo YTGifs.
3. Navegue pelo seletor e escolha o GIF desejado.
4. Confira o token inserido no campo de texto.
5. Publique o comentário usando o botão normal do YouTube.

Para visualizar os GIFs compartilhados, os outros usuários também precisam ter o YTGifs instalado e funcionando.

## ⚠️ Limitações

- O YTGifs foi desenvolvido para navegadores baseados em Chromium.
- Os GIFs são identificados por tokens de texto nos comentários.
- Pessoas sem a extensão podem ver o token como texto comum.
- A exibição depende de o token ser reconhecido e de o conteúdo correspondente estar disponível.
- Alterações no YouTube ou no navegador podem afetar o funcionamento da extensão.
- A extensão não garante que todos os GIFs sejam exibidos em todas as situações.

## 🛠️ Solução de problemas

| Problema | O que fazer |
| --- | --- |
| O botão GIF não aparece | Confira se a extensão está ativada e atualize a página do YouTube. |
| O seletor não abre | Recarregue a página e confira se a extensão foi carregada corretamente. |
| O token aparece como texto | Verifique se a extensão está instalada e ativa no navegador que está visualizando o comentário. |
| O GIF não aparece | Confira se o token está correto e se o conteúdo correspondente continua disponível. |
| A extensão apresenta erros | Abra a página de extensões do navegador e consulte os erros registrados. |

## 🔒 Privacidade

O YTGifs foi projetado para identificar GIFs compartilhados por meio de tokens inseridos nos comentários.

A publicação do comentário é feita pelo próprio YouTube. O funcionamento e o tratamento de dados dependem também dos serviços utilizados pela extensão para localizar e exibir GIFs.

Consulte o código-fonte do projeto para verificar as permissões, as requisições e o tratamento de dados implementados.

---

# English 🇺🇸

## ✨ About

YTGifs is a browser extension for Chromium-based browsers that lets users share GIFs in YouTube comments and replies with other people who also have the extension installed.

The goal is to make YouTube conversations more expressive and fun.

## 🚀 How it works

1. Open a YouTube video.
2. Go to the comments and click the GIF button.
3. Choose the GIF you want to share.
4. YTGifs inserts a token into the comment field, similar to this:

   `[ytgifs:AJUDKCdjkdkd]`

5. Post your comment normally.
6. When another user with YTGifs views the comment, the extension attempts to recognize the token and display the corresponding GIF.

**Important:** the GIF is not uploaded as a native YouTube attachment. The token identifies the content for compatible installations of the extension.

## 📦 Installation

### Google Chrome, Microsoft Edge, Brave, and other Chromium browsers

1. Download or clone this repository.
2. Extract the ZIP file if you downloaded a compressed copy.
3. Open your browser's extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the project folder containing `manifest.json`.
7. Open or refresh a YouTube page.

The extension will be loaded locally in your browser.

## 🎬 How to use

1. Open a YouTube video and find the comments section.
2. Click the GIF button added by YTGifs.
3. Browse the picker and select a GIF.
4. Check the token inserted into the comment field.
5. Post your comment using YouTube's normal Comment button.

Other users must also have YTGifs installed and working to see the shared GIF.

## ⚠️ Limitations

- YTGifs was developed for Chromium-based browsers.
- GIFs are identified by text tokens in comments.
- People without the extension may see the token as ordinary text.
- Displaying a GIF depends on the token being recognized and the corresponding content remaining available.
- Changes to YouTube or the browser may affect the extension.
- The extension cannot guarantee that every GIF will display in every situation.

## 🛠️ Troubleshooting

| Problem | What to do |
| --- | --- |
| The GIF button is missing | Check that the extension is enabled and refresh YouTube. |
| The picker does not open | Reload the page and check that the extension loaded correctly. |
| The token appears as text | Make sure the extension is installed and enabled in the browser viewing the comment. |
| The GIF does not appear | Check the token and whether the corresponding content is still available. |
| The extension reports errors | Open your browser's extensions page and inspect the reported errors. |

## 🔒 Privacy

YTGifs is designed to identify shared GIFs through tokens inserted into comments.

YouTube handles the comment publication itself. The extension's operation and data handling also depend on the services it uses to find and display GIFs.

Review the project source code to inspect the implemented permissions, network requests, and data handling.

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome.

If you find a problem or have an idea to improve YTGifs, open an issue in this repository.

Please include the browser you use, the steps to reproduce the problem, and any relevant error messages.

## 📄 License

See the repository's license file for the applicable terms.

If no license file exists yet, check the licensing requirements before redistributing or modifying the project.

---

<p align="center">
  Made with ❤️ for YouTube GIF lovers.
</p>

<p align="center">
  <a href="https://github.com/pouzeiro-dev/yt-gifs">YTGifs on GitHub</a>
</p>


⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⣤⡀⣄⣠⡄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠴⠚⠁⠀⠀⠀⠀⠀⠀⠉⠑⠦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠊⠁⠀⢀⣀⡀⠀⠀⠀⠀⢀⣀⡀⠀⠀⠙⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠊⠀⠀⢠⠚⠁⠀⠈⠑⢆⢠⠞⠉⠀⠈⠑⢦⠀⠀⠹⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣀⠜⠁⠀⠀⢀⡇⠀⢠⣤⡄⠀⠘⡇⠀⢀⣤⣄⠀⠈⡆⠀⠀⠀⠳⡄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⠊⠀⠀⠀⠀⠈⡆⠀⠈⠛⠃⠀⢠⡇⠀⠈⠛⠃⠀⢀⠇⠀⠀⠀⠁⡘⣇⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡼⠁⠀⠀⠀⠀⠀⠀⠙⢤⣀⠀⣀⡠⠎⠘⠦⣀⠀⣀⡠⠎⠀⠀⠀⠀⠀⠀⠈⢾⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡜⠀⠀⠀⠀⠀⣦⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠂⢻⡀⠀⠀⠀⠀
⠀⠀⢀⠏⠀⠀⠀⠀⠀⢘⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠀⠀⠂⢹⣆⠀⠀⠀
⠀⠰⡝⠀⠀⠀⠀⠀⠀⠈⣧⣀⣀⣀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠐⠀⠹⣆⠀⠀
⠀⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠄⢻⡄⠀
⣘⠃⠀⠀⠀⠀⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠁⠀⠐⡈⡶⠀
⡙⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠀⠁⠀⠀⠀⠀⠈⠀⠀⠀⠀⠠⠀⠀⠐⠠⢹⡃
⢣⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡈⢐⢹⠇
⢚⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⡐⢌⢯⠀
⠀⠳⣄⠀⠀⠀⠀⠀⠀⠀⠀⢀⠠⠀⠀⠐⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠂⡀⠒⣌⠾⠁⠀
⠀⠀⠈⠷⢌⣀⠂⠄⠠⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⢀⠀⢀⠠⠀⠂⡀⠌⡀⠤⣑⣬⠝⠋⠀⠀⠀
⠀⠀⠀⠀⠀⠉⠻⠒⡥⣆⣤⣁⣂⣁⠂⢡⠈⡐⠠⢁⠂⡁⠄⢂⠄⡈⢄⣂⣌⣴⣰⣬⠶⠏⠋⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠈⠛⠛⠙⠋⠉⠉⠉⠉⠙⠋⠙⠛⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
