const themeSelect = document.getElementById("theme");

// Load saved theme
chrome.storage.sync.get(["theme"], (result) => {
  if (result.theme) {
    themeSelect.value = result.theme;
  }
});

// Save theme on change
themeSelect.addEventListener("change", (e) => {
  chrome.storage.sync.set({ theme: e.target.value });
});