const clock = document.getElementById("clock");
const panel = document.getElementById("panel");
const panelTitle = document.getElementById("panelTitle");
const panelContent = document.getElementById("panelContent");
const emyBubble = document.getElementById("emyBubble");
const appGrid = document.getElementById("appGrid");

/* ---------- SOUND SYSTEM (No download needed) ---------- */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playClickSound(freq = 440) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  gain.gain.value = 0.08;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

/* ---------- EMMY TYPING EFFECT ---------- */
let typingInterval = null;

function emy(text) {
  clearInterval(typingInterval);
  emyBubble.innerText = "";

  let i = 0;
  typingInterval = setInterval(() => {
    emyBubble.innerText += text[i];
    i++;
    if (i >= text.length) clearInterval(typingInterval);
  }, 18);
}

/* ---------- CLOCK ---------- */
function updateClock() {
  clock.innerText = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
setInterval(updateClock, 1000);
updateClock();

/* ---------- APP SYSTEM ---------- */

const defaultApps = [
  { id: "crafts", title: "Craft Studio", desc: "Paper craft tutorials step-by-step.", tag: "Creative" },
  { id: "encyclopedia", title: "Mini Encyclopedia", desc: "Search anything using Wikipedia.", tag: "Wikipedia" },
  { id: "worldclock", title: "World Clock", desc: "Real-time clock for multiple countries.", tag: "Live" },
  { id: "paint", title: "Paint App", desc: "Draw freely with brush tools.", tag: "Canvas" },
  { id: "notes", title: "Notes", desc: "Write notes saved automatically.", tag: "Storage" },
  { id: "voice", title: "Voice Detector", desc: "Detect speech using microphone.", tag: "Speech" },
  { id: "fakenews", title: "Fake News Detector", desc: "Analyze headlines + Wikipedia support.", tag: "AI-style", danger: true },
  { id: "appstore", title: "App Store", desc: "Install extra apps into your OS.", tag: "Install" },
  { id: "credits", title: "Credits", desc: "System ending page.", tag: "Final" }
];

const storeApps = [
  { id: "calculator", title: "Calculator", desc: "Basic calculator app.", tag: "Tool" },
  { id: "snake", title: "Snake Game", desc: "Classic snake game.", tag: "Game" },
  { id: "mood", title: "Mood Tracker", desc: "Track your daily mood.", tag: "Wellness" }
];

let installedApps = JSON.parse(localStorage.getItem("installedApps")) || [];

function renderGrid() {
  appGrid.innerHTML = "";

  const allApps = [...defaultApps];

  installedApps.forEach(appId => {
    const app = storeApps.find(a => a.id === appId);
    if (app) allApps.splice(allApps.length - 2, 0, app);
  });

  allApps.forEach(app => {
    const box = document.createElement("section");
    box.className = "box";
    box.onclick = () => openPanel(app.id);

    box.innerHTML = `
      <h2>${app.title}</h2>
      <p>${app.desc}</p>
      <div class="tag ${app.danger ? "danger" : ""}">${app.tag}</div>
    `;

    appGrid.appendChild(box);
  });
}

renderGrid();

/* ---------- PANEL SYSTEM ---------- */
function openPanel(app) {
  panel.classList.remove("hidden");
  panel.classList.add("show");

  playClickSound(520);

  if (app === "crafts") {
    panelTitle.innerText = "Craft Studio";
    panelContent.innerHTML = craftsHTML();
    emy("This is the craft studio. Choose a craft.");
  }

  if (app === "encyclopedia") {
    panelTitle.innerText = "Mini Encyclopedia";
    panelContent.innerHTML = encyclopediaHTML();
    emy("Search any topic. I will fetch it from Wikipedia.");
  }

  if (app === "worldclock") {
    panelTitle.innerText = "World Clock";
    panelContent.innerHTML = worldClockHTML();
    emy("Choose a country to view its live time.");
    setupWorldClock();
  }

  if (app === "paint") {
    panelTitle.innerText = "Paint App";
    panelContent.innerHTML = paintHTML();
    emy("Draw freely using this paint app.");
    setupPaint();
  }

  if (app === "notes") {
    panelTitle.innerText = "Notes";
    panelContent.innerHTML = notesHTML();
    emy("Write your notes. They are saved automatically.");
    setupNotes();
  }

  if (app === "voice") {
    panelTitle.innerText = "Voice Detector";
    panelContent.innerHTML = voiceHTML();
    emy("Click start and speak. I will detect your voice.");
  }

  if (app === "fakenews") {
    panelTitle.innerText = "Fake News Detector";
    panelContent.innerHTML = fakeNewsHTML();
    emy("Paste a headline. I will analyze it using Wikipedia.");
  }

  if (app === "appstore") {
    panelTitle.innerText = "App Store";
    panelContent.innerHTML = appStoreHTML();
    emy("Install apps to expand your system.");
  }

  if (app === "calculator") {
    panelTitle.innerText = "Calculator";
    panelContent.innerHTML = calculatorHTML();
    emy("A simple calculator.");
  }

  if (app === "snake") {
    panelTitle.innerText = "Snake Game";
    panelContent.innerHTML = snakeHTML();
    emy("Use arrow keys to play.");
    setupSnake();
  }

  if (app === "mood") {
    panelTitle.innerText = "Mood Tracker";
    panelContent.innerHTML = moodHTML();
    emy("Log your mood today.");
    setupMood();
  }

  if (app === "credits") {
    panelTitle.innerText = "Credits";
    panelContent.innerHTML = creditsHTML();
    emy("Thank you for exploring NeuraLib OS.");
  }
}

function closePanel() {
  playClickSound(280);
  panel.classList.remove("show");
  setTimeout(() => panel.classList.add("hidden"), 250);
  emy("Choose another app from the dashboard.");
}

/* ---------- APP STORE ---------- */
function appStoreHTML() {
  return `
    <h3>Available Apps</h3>
    <p style="opacity:0.75;margin-top:6px;">
      Install apps to expand your OS.
    </p>

    <div style="margin-top:14px;">
      ${storeApps.map(app => {
        const installed = installedApps.includes(app.id);
        return `
          <div style="margin-top:12px;padding:14px;border-radius:18px;
          background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);">
            <b>${app.title}</b>
            <p style="opacity:0.75;margin-top:6px;font-size:13px;">${app.desc}</p>
            <button onclick="${installed ? `uninstallApp('${app.id}')` : `installApp('${app.id}')`}">
              ${installed ? "Uninstall" : "Install"}
            </button>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function installApp(appId) {
  if (!installedApps.includes(appId)) {
    installedApps.push(appId);
    localStorage.setItem("installedApps", JSON.stringify(installedApps));
    renderGrid();
    panelContent.innerHTML = appStoreHTML();
    playClickSound(700);
    emy("Installed successfully.");
  }
}

function uninstallApp(appId) {
  installedApps = installedApps.filter(id => id !== appId);
  localStorage.setItem("installedApps", JSON.stringify(installedApps));
  renderGrid();
  panelContent.innerHTML = appStoreHTML();
  playClickSound(200);
  emy("Uninstalled.");
}

/* ---------- Crafts ---------- */
const craftsDB = [
  { title: "Paper Butterfly", steps: ["Fold paper", "Draw wings", "Cut carefully", "Decorate", "Hang with thread"] },
  { title: "Paper Plane", steps: ["Fold in half", "Fold corners", "Fold nose", "Fold wings", "Fly it"] },
  { title: "Origami Heart", steps: ["Fold diagonally", "Fold corners", "Shape top", "Flatten", "Decorate"] }
];

function craftsHTML() {
  return `
    <h3>Select a craft:</h3>
    ${craftsDB.map((c, i) => `
      <div style="margin-top:12px;padding:14px;border-radius:18px;
      background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);
      cursor:pointer;" onclick="showCraft(${i})">
        <b>${c.title}</b>
      </div>
    `).join("")}

    <div id="craftSteps" style="margin-top:18px;"></div>
  `;
}

function showCraft(i) {
  const box = document.getElementById("craftSteps");
  const craft = craftsDB[i];

  box.innerHTML = `
    <h3 style="margin-top:10px;">${craft.title}</h3>
    <ol style="margin-top:10px;padding-left:20px;line-height:1.8;">
      ${craft.steps.map(s => `<li>${s}</li>`).join("")}
    </ol>
  `;
  emy("Here are the steps for " + craft.title);
}

/* ---------- Encyclopedia ---------- */
function encyclopediaHTML() {
  return `
    <h3>Search Wikipedia</h3>
    <input id="wikiInput" placeholder="plastic, moon, ocean..." />
    <button onclick="wikiSearch()">Search</button>
    <div id="wikiResult" style="margin-top:14px;">---</div>
  `;
}

async function wikiSearch() {
  const input = document.getElementById("wikiInput").value.trim();
  const result = document.getElementById("wikiResult");

  if (!input) {
    result.innerText = "Type something first.";
    return;
  }

  result.innerText = "Searching...";

  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(input)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.type && data.type.includes("not_found")) {
      result.innerText = "No results found.";
      return;
    }

    result.innerHTML = `
      <h3>${data.title}</h3>
      <p style="margin-top:10px;line-height:1.6;">${data.extract}</p>
    `;

  } catch (e) {
    result.innerText = "Error fetching Wikipedia.";
  }
}

/* ---------- World Clock ---------- */
function worldClockHTML() {
  return `
    <select id="tzSelect">
      <option value="Asia/Kolkata">India</option>
      <option value="America/New_York">USA (New York)</option>
      <option value="Europe/London">UK</option>
      <option value="Europe/Paris">France</option>
      <option value="Europe/Rome">Italy</option>
      <option value="Asia/Tokyo">Japan</option>
      <option value="Australia/Sydney">Australia</option>
    </select>
    <div style="margin-top:18px;">
      <h1 id="worldTime" style="font-size:42px;">--:--</h1>
    </div>
  `;
}

function setupWorldClock() {
  const select = document.getElementById("tzSelect");
  const display = document.getElementById("worldTime");

  function tick() {
    display.innerText = new Date().toLocaleTimeString("en-US", {
      timeZone: select.value
    });
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------- Paint ---------- */
function paintHTML() {
  return `
    <input type="color" id="paintColor" value="#7fd6d2" />
    <input type="range" id="paintSize" min="2" max="30" value="7" />
    <button onclick="paintClear()">Clear</button>
    <canvas id="paintCanvas" width="900" height="320"
      style="margin-top:14px;border-radius:18px;background:white;width:100%;"></canvas>
  `;
}

let painting = false;

function setupPaint() {
  const canvas = document.getElementById("paintCanvas");
  const ctx = canvas.getContext("2d");

  canvas.onmousedown = () => painting = true;
  canvas.onmouseup = () => painting = false;

  canvas.onmousemove = (e) => {
    if (!painting) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = document.getElementById("paintColor").value;
    const size = document.getElementById("paintSize").value;

    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  };
}

function paintClear() {
  const canvas = document.getElementById("paintCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* ---------- Notes ---------- */
function notesHTML() {
  return `<textarea id="notesBox" style="height:300px;" placeholder="Write your notes..."></textarea>`;
}

function setupNotes() {
  const box = document.getElementById("notesBox");
  box.value = localStorage.getItem("notes") || "";

  box.oninput = () => {
    localStorage.setItem("notes", box.value);
  };
}

/* ---------- Voice Detector ---------- */
function voiceHTML() {
  return `
    <button onclick="startVoice()">Start Listening</button>
    <button onclick="stopVoice()">Stop</button>
    <div id="voiceText" style="margin-top:14px;">---</div>
  `;
}

let recognition = null;

function startVoice() {
  const box = document.getElementById("voiceText");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    box.innerText = "Not supported in this browser.";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;

  recognition.onresult = (event) => {
    box.innerText = event.results[event.results.length - 1][0].transcript;
    emy("Voice detected.");
  };

  recognition.start();
  emy("Listening...");
}

function stopVoice() {
  if (recognition) recognition.stop();
  emy("Stopped listening.");
}

/* ---------- Fake News Detector + Wikipedia ---------- */
function fakeNewsHTML() {
  return `
    <textarea id="newsInput" style="height:140px;" placeholder="Paste headline or paragraph..."></textarea>
    <button onclick="analyzeNews()">Analyze</button>
    <div id="newsResult" style="margin-top:14px;">---</div>
  `;
}

async function analyzeNews() {
  const input = document.getElementById("newsInput").value.trim();
  const out = document.getElementById("newsResult");

  if (!input) {
    out.innerText = "Paste something first.";
    return;
  }

  out.innerText = "Analyzing...";

  let score = 80;
  let reasons = [];

  const badWords = ["shocking", "secret", "they don't want you to know", "miracle", "breaking", "unbelievable"];
  badWords.forEach(w => {
    if (input.toLowerCase().includes(w)) {
      score -= 12;
      reasons.push("Clickbait phrase: " + w);
    }
  });

  if ((input.match(/!/g) || []).length >= 2) {
    score -= 10;
    reasons.push("Too many exclamation marks.");
  }

  if (input.length < 40) {
    score -= 15;
    reasons.push("Too short (low context).");
  }

  try {
    const query = input.split(" ").slice(0, 4).join(" ");
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.extract) {
      score += 12;
      reasons.push("Wikipedia contains related topic information.");
    } else {
      score -= 12;
      reasons.push("Wikipedia did not confirm this topic.");
    }
  } catch {
    reasons.push("Wikipedia check failed.");
  }

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  let status = "Likely Real";
  if (score < 65) status = "Suspicious";
  if (score < 45) status = "High Fake Risk";

  out.innerHTML = `
    <h3>Trust Score: ${score}/100</h3>
    <p><b>Status:</b> ${status}</p>
    <ul style="margin-top:12px;padding-left:20px;line-height:1.6;">
      ${reasons.map(r => `<li>${r}</li>`).join("")}
    </ul>
  `;

  emy("Fake news analysis complete.");
}

/* ---------- Calculator ---------- */
function calculatorHTML() {
  return `
    <input id="calcDisplay" disabled value="0" style="font-size:22px;text-align:right;" />

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px;">
      ${["7","8","9","/",
         "4","5","6","*",
         "1","2","3","-",
         "0",".","=","+"].map(b => `
        <button onclick="calcPress('${b}')">${b}</button>
      `).join("")}
    </div>

    <button style="margin-top:12px;" onclick="calcClear()">Clear</button>
  `;
}

let calcValue = "";

function calcPress(btn) {
  const display = document.getElementById("calcDisplay");

  if (btn === "=") {
    try {
      calcValue = eval(calcValue).toString();
    } catch {
      calcValue = "Error";
    }
    display.value = calcValue;
    return;
  }

  calcValue += btn;
  display.value = calcValue;
}

function calcClear() {
  calcValue = "";
  document.getElementById("calcDisplay").value = "0";
}

/* ---------- Mood Tracker ---------- */
function moodHTML() {
  return `
    <h3>How are you feeling today?</h3>
    <select id="moodSelect">
      <option>Happy</option>
      <option>Calm</option>
      <option>Sad</option>
      <option>Angry</option>
      <option>Motivated</option>
      <option>Tired</option>
    </select>

    <button onclick="saveMood()">Save Mood</button>

    <div id="moodHistory" style="margin-top:14px;">---</div>
  `;
}

function setupMood() {
  renderMoodHistory();
}

function saveMood() {
  const mood = document.getElementById("moodSelect").value;
  const history = JSON.parse(localStorage.getItem("moodHistory")) || [];

  history.unshift({
    mood,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("moodHistory", JSON.stringify(history));
  renderMoodHistory();
  emy("Mood saved.");
}

function renderMoodHistory() {
  const history = JSON.parse(localStorage.getItem("moodHistory")) || [];
  const box = document.getElementById("moodHistory");

  if (history.length === 0) {
    box.innerText = "No mood logs yet.";
    return;
  }

  box.innerHTML = `
    <ul style="padding-left:18px;line-height:1.7;">
      ${history.slice(0, 10).map(h => `<li><b>${h.mood}</b> — ${h.date}</li>`).join("")}
    </ul>
  `;
}

/* ---------- Snake Game ---------- */
function snakeHTML() {
  return `
    <p style="opacity:0.8;">Use arrow keys. Eat food. Don't crash.</p>
    <canvas id="snakeCanvas" width="400" height="400"
      style="margin-top:14px;border-radius:18px;background:black;width:100%;max-width:420px;"></canvas>
    <div id="snakeScore" style="margin-top:14px;font-weight:800;">Score: 0</div>
  `;
}

let snakeInterval = null;

function setupSnake() {
  const canvas = document.getElementById("snakeCanvas");
  const ctx = canvas.getContext("2d");

  let snake = [{ x: 200, y: 200 }];
  let food = { x: 100, y: 100 };
  let dx = 20;
  let dy = 0;
  let score = 0;

  document.onkeydown = (e) => {
    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -20; }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 20; }
    if (e.key === "ArrowLeft" && dx === 0) { dx = -20; dy = 0; }
    if (e.key === "ArrowRight" && dx === 0) { dx = 20; dy = 0; }
  };

  clearInterval(snakeInterval);

  snakeInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (
      head.x < 0 || head.y < 0 ||
      head.x >= canvas.width || head.y >= canvas.height ||
      snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      clearInterval(snakeInterval);
      emy("Game over.");
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      document.getElementById("snakeScore").innerText = "Score: " + score;
      food.x = Math.floor(Math.random() * 20) * 20;
      food.y = Math.floor(Math.random() * 20) * 20;
      playClickSound(800);
    } else {
      snake.pop();
    }

    ctx.fillStyle = "#7fd6d2";
    snake.forEach(s => ctx.fillRect(s.x, s.y, 18, 18));

    ctx.fillStyle = "#d9a4b2";
    ctx.fillRect(food.x, food.y, 18, 18);

  }, 140);
}

/* ---------- Credits ---------- */
function creditsHTML() {
  return `
    <div style="text-align:center;margin-top:60px;">
      <h1 style="font-weight:950;letter-spacing:2px;">Created by Saanvi</h1>
      <p style="opacity:0.7;margin-top:10px;">NeuraLib OS v6 • Dashboard Edition</p>
    </div>
  `;
}

emy("Welcome. Tap a box to open an app.");
