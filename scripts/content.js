// Initialize theme
(async function init() {
  const { theme = "ocean" } = await chrome.storage.sync.get(["theme"]);
  document.documentElement.setAttribute("data-theme", theme);
  
  injectBackground();
  startBubbles();
})();

// Listen for theme changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.theme) {
    document.documentElement.setAttribute("data-theme", changes.theme.newValue);
  }
});

function injectBackground() {
  const bg = document.createElement("div");
  bg.id = "glass-extension-bg";
  bg.innerHTML = `
    <div class="light-rays"></div>
    <div id="bubble-container"></div>
  `;
  document.body.appendChild(bg);
}

function startBubbles() {
  const container = document.getElementById("bubble-container");
  if (!container) {
    // Retry if DOM wasn't ready (though injectBackground usually handles it)
    setTimeout(startBubbles, 500);
    return;
  }

  function createBubble() {
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    const size = Math.random() * 6 + 2; // 2px to 8px
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}vw`;
    // Randomize duration between 7s and 15s
    const duration = Math.random() * 8 + 7;
    bubble.style.animationDuration = `${duration}s`;
    
    container.appendChild(bubble);

    // Clean up
    setTimeout(() => bubble.remove(), duration * 1000);
  }

  // Create bubbles continuously
  setInterval(createBubble, 800);
  
  // Initial burst
  for (let i = 0; i < 15; i++) {
    createBubble();
  }
}