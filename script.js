// Iman Whispers - App Installation

let deferredPrompt;

const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;

  if (installBtn) {
    installBtn.hidden = false;
  }
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt = null;
    installBtn.hidden = true;
  });
}

window.addEventListener("appinstalled", () => {
  if (installBtn) {
    installBtn.hidden = true;
  }
});
