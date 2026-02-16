// Initialize theme
(async function init() {
  try {
    const { theme = "ocean" } = await chrome.storage.sync.get(["theme"]);
    document.documentElement.setAttribute("data-theme", theme);
    
    // Inject background once the DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        injectBackground();
      });
    } else {
      injectBackground();
    }
  } catch (e) {
    console.error("Glass Extension Error:", e);
  }
})();

// Listen for theme changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.theme) {
    document.documentElement.setAttribute("data-theme", changes.theme.newValue);
  }
});

function injectBackground() {
  // Prevent duplicate injection
  if (document.getElementById("glass-extension-bg")) return;

  const bg = document.createElement("div");
  bg.id = "glass-extension-bg";
  
  // Full SVG for Beluga Whale
  const belugaSVG = `
    <div class="beluga-wrapper">
        <div class="beluga-mover">
            <svg class="beluga-svg" viewBox="100 150 750 350" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="belugaBody" cx="40%" cy="30%" r="80%">
                        <stop offset="0%" style="stop-color:#ffffff" />
                        <stop offset="35%" style="stop-color:#f8fafc" />
                        <stop offset="65%" style="stop-color:#cbd5e1" />
                        <stop offset="90%" style="stop-color:#94a3b8" />
                        <stop offset="100%" style="stop-color:#64748b" />
                    </radialGradient>

                    <linearGradient id="backHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="10%" style="stop-color:white; stop-opacity:0.6" />
                        <stop offset="40%" style="stop-color:white; stop-opacity:0" />
                    </linearGradient>

                    <radialGradient id="melonGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#f1f5f9;stop-opacity:0" />
                    </radialGradient>

                    <pattern id="caustics" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M10 10 Q 50 0 90 10 T 170 10" fill="none" stroke="white" stroke-width="1.5" opacity="0.4" />
                    </pattern>

                    <filter id="softBlur" x="-25%" y="-25%" width="150%" height="150%">
                        <feGaussianBlur stdDeviation="6" />
                    </filter>
                    
                    <filter id="innerDepth">
                        <feOffset dx="6" dy="12" />
                        <feGaussianBlur stdDeviation="5" result="offset-blur" />
                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                        <feFlood flood-color="#1e293b" flood-opacity="0.3" result="color" />
                        <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                        <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                    </filter>
                </defs>

                <!-- Shadow -->
                <path class="body-path" d="M130,280 C130,200 250,160 380,180 C550,200 680,280 750,350 C780,380 770,420 730,440 C650,470 500,440 380,420 C250,400 130,360 130,280 Z"
                    fill="#000" opacity="0.18" transform="translate(20, 30)" filter="url(#softBlur)" />

                <!-- Underbelly -->
                <path class="body-path" d="M180,360 C250,390 400,410 550,400 C650,380 720,360 740,410 C700,440 500,450 350,420 C220,390 180,360 180,360 Z" 
                    fill="#475569" opacity="0.4" />

                <!-- Body Group with Undulation -->
                <g filter="url(#innerDepth)">
                    <path class="body-path" fill="url(#belugaBody)" d="M130,280 C130,190 230,165 350,175 C480,185 620,260 740,345 C770,365 780,405 745,430 C700,460 550,445 420,415 C280,395 180,390 130,330 C110,310 110,295 130,280 Z" />
                    <path class="body-path" fill="url(#backHighlight)" d="M130,280 C130,190 230,165 350,175 C480,185 620,260 740,345 C770,365 780,405 745,430 C700,460 550,445 420,415 C280,395 180,390 130,330 C110,310 110,295 130,280 Z" />
                </g>

                <!-- Dorsal Ridge -->
                <path d="M450,210 Q500,225 550,265" fill="none" stroke="#f1f5f9" stroke-width="4" stroke-linecap="round" opacity="0.8" />

                <!-- The Melon -->
                <ellipse cx="200" cy="255" rx="55" ry="45" fill="url(#melonGlow)" transform="rotate(-15, 200, 255)" opacity="0.9" />

                <!-- Eye -->
                <g transform="translate(255, 305)">
                    <circle r="4.5" fill="#0f172a" />
                    <circle r="1.5" cx="1" cy="-1" fill="white" />
                </g>

                <!-- Mouth -->
                <path d="M140,320 C170,345 230,350 265,335" fill="none" stroke="#475569" stroke-width="3.5" stroke-linecap="round" opacity="0.7" />

                <!-- Pectoral Fin -->
                <path class="pectoral-fin" d="M310,365 C290,390 285,440 315,465 C335,480 375,450 385,410 C390,380 340,360 310,365 Z" 
                    fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" />

                <!-- Tail Flukes -->
                <path class="tail-section" d="M745,390 C795,330 845,340 835,380 C825,400 785,405 760,395 C775,430 825,450 805,480 C790,500 735,480 725,430 L745,390 Z" 
                    fill="#94a3b8" stroke="#475569" stroke-width="1" />

                <!-- Caustics -->
                <path class="body-path" d="M130,280 C130,190 230,165 350,175 C480,185 620,260 740,345 C770,365 780,405 745,430 C700,460 550,445 420,415 C280,395 180,390 130,330 C110,310 110,295 130,280 Z" 
                    fill="url(#caustics)" opacity="0.4" pointer-events="none" />
            </svg>
        </div>
    </div>
  `;

  bg.innerHTML = `
    <div class="light-rays"></div>
    ${belugaSVG}
  `;
  document.body.appendChild(bg);
}