const clock = document.getElementById("clock");
const panel = document.getElementById("panel");
const panelTitle = document.getElementById("panelTitle");
const panelContent = document.getElementById("panelContent");
const emyBubble = document.getElementById("emyBubble");
const appGrid = document.getElementById("appGrid");

const loginScreen = document.getElementById("loginScreen");
const loginName = document.getElementById("loginName");
const loginPassword = document.getElementById("loginPassword");
const loginHint = document.getElementById("loginHint");

/* ===============================
   AUDIO SYSTEM
   =============================== */
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playClickSound(freq = 520) {
  ensureAudio();
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

/* ===============================
   EMMY TYPING
   =============================== */
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

/* ===============================
   CLOCK
   =============================== */
function updateClock() {
  if (!clock) return;
  clock.innerText = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
setInterval(updateClock, 1000);
updateClock();

/* ===============================
   LOGIN SYSTEM
   =============================== */
function login() {
  playClickSound(650);

  const savedUser = localStorage.getItem("osUser");
  const savedPass = localStorage.getItem("osPass");

  const user = loginName.value.trim();
  const pass = loginPassword.value.trim();

  if (!pass) {
    loginHint.innerText = "Password is required.";
    return;
  }

  // First time setup
  if (!savedPass) {
    if (!user) {
      loginHint.innerText = "Enter a username first time.";
      return;
    }
    localStorage.setItem("osUser", user);
    localStorage.setItem("osPass", pass);
    loginHint.innerText = "Account created. Welcome!";
    loginScreen.style.display = "none";
    emy("Welcome " + user + ". Your OS is ready.");
    return;
  }

  // Normal login
  if (pass === savedPass) {
    loginHint.innerText = "Access granted.";
    loginScreen.style.display = "none";
    emy("Welcome back " + savedUser + ".");
  } else {
    loginHint.innerText = "Wrong password.";
  }
}

function lockOS() {
  playClickSound(200);
  loginScreen.style.display = "flex";
  loginName.value = "";
  loginPassword.value = "";
  loginHint.innerText = "OS Locked. Enter password.";
  emy("System locked.");
}

/* ===============================
   THEMES
   =============================== */
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("osTheme", theme);
  emy("Theme changed to " + theme + ".");
}

(function loadTheme() {
  const savedTheme = localStorage.getItem("osTheme") || "default";
  document.documentElement.setAttribute("data-theme", savedTheme);
})();

/* ===============================
   APPS GRID
   =============================== */
const apps = [
  { id: "crafts", title: "Craft Studio", desc: "Explore paper crafts step-by-step.", tag: "Creative" },
  { id: "encyclopedia", title: "Mini Encyclopedia", desc: "Search anything using Wikipedia.", tag: "Wikipedia" },
  { id: "worldclock", title: "World Clock", desc: "Real-time clock for global cities.", tag: "Live" },
  { id: "paint", title: "Paint App", desc: "Draw freely using brush tools.", tag: "Canvas" },
  { id: "notes", title: "Notes", desc: "Write notes saved automatically.", tag: "Storage" },
  { id: "voice", title: "Voice Detector", desc: "Detect speech using microphone.", tag: "Speech" },
  { id: "fakenews", title: "Fake News Detector", desc: "Analyze headlines using Wikipedia.", tag: "AI", danger: true },
  { id: "games", title: "Games Hub", desc: "Play 12 games inside NeuraLib OS.", tag: "Fun" },
  { id: "settings", title: "Profile Settings", desc: "Themes, lock, username, reset.", tag: "System" },
  { id: "credits", title: "Credits", desc: "Created by Saanvi.", tag: "Final" }
];

function renderGrid() {
  appGrid.innerHTML = "";
  apps.forEach(app => {
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

/* ===============================
   PANEL OPEN
   =============================== */
function openPanel(id) {
  playClickSound(560);
  panel.classList.remove("hidden");

  if (id === "crafts") {
    panelTitle.innerText = "Craft Studio";
    panelContent.innerHTML = craftsHTML();
    emy("Choose a craft to view steps.");
  }

  if (id === "encyclopedia") {
    panelTitle.innerText = "Mini Encyclopedia";
    panelContent.innerHTML = encyclopediaHTML();
    emy("Search a topic, I'll fetch it from Wikipedia.");
  }

  if (id === "worldclock") {
    panelTitle.innerText = "World Clock";
    panelContent.innerHTML = worldClockHTML();
    setupWorldClock();
    emy("Choose a country/city to see the time.");
  }

  if (id === "paint") {
    panelTitle.innerText = "Paint App";
    panelContent.innerHTML = paintHTML();
    setupPaint();
    emy("Paint freely. Choose color + brush size.");
  }

  if (id === "notes") {
    panelTitle.innerText = "Notes";
    panelContent.innerHTML = notesHTML();
    setupNotes();
    emy("Write notes. They auto-save.");
  }

  if (id === "voice") {
    panelTitle.innerText = "Voice Detector";
    panelContent.innerHTML = voiceHTML();
    emy("Start listening to detect your voice.");
  }

  if (id === "fakenews") {
    panelTitle.innerText = "Fake News Detector";
    panelContent.innerHTML = fakeNewsHTML();
    emy("Paste a headline and I'll analyze it.");
  }

  if (id === "games") {
    panelTitle.innerText = "Games Hub";
    panelContent.innerHTML = gamesHTML();
    emy("Select any game. There are 12.");
  }

  if (id === "settings") {
    panelTitle.innerText = "Profile Settings";
    panelContent.innerHTML = settingsHTML();
    emy("Change themes, lock OS, or reset.");
  }

  if (id === "credits") {
    panelTitle.innerText = "Credits";
    panelContent.innerHTML = creditsHTML();
    emy("Thank you for exploring NeuraLib OS v8.");
  }
}

function closePanel() {
  playClickSound(240);
  panel.classList.add("hidden");
  emy("Choose another app from the dashboard.");
}

/* ===============================
   SETTINGS APP
   =============================== */
function settingsHTML() {
  const user = localStorage.getItem("osUser") || "Unknown";
  return `
    <h3>User Profile</h3>
    <p style="opacity:0.8;margin-top:8px;">Username: <b>${user}</b></p>

    <h3 style="margin-top:20px;">Theme Switcher</h3>
    <button onclick="setTheme('default')">Soft Cyan + Muted Rose</button>
    <button onclick="setTheme('midnight')">Midnight Purple</button>
    <button onclick="setTheme('pearl')">Pearl White</button>
    <button onclick="setTheme('cyber')">Neon Cyber</button>

    <h3 style="margin-top:20px;">Security</h3>
    <button onclick="lockOS()">Lock Screen</button>

    <h3 style="margin-top:20px;">Reset System</h3>
    <button onclick="resetOS()" style="border-color:rgba(217,164,178,0.5);">
      Reset Everything
    </button>

    <p style="opacity:0.65;margin-top:10px;font-size:12px;">
      Reset deletes notes, username, password, theme, moods, and history.
    </p>
  `;
}

function resetOS() {
  playClickSound(150);
  localStorage.clear();
  location.reload();
}

/* ===============================
   CRAFT STUDIO (15 crafts)
   =============================== */
const craftsDB = [
  { title:"Paper Butterfly", steps:["Fold paper","Draw wings","Cut carefully","Decorate","Hang with thread"] },
  { title:"Paper Plane", steps:["Fold in half","Fold corners","Fold nose","Fold wings","Fly it"] },
  { title:"Origami Heart", steps:["Fold diagonally","Fold corners","Shape top","Flatten","Decorate"] },
  { title:"Paper Star", steps:["Cut strips","Tie a knot","Fold sides","Inflate gently","Shape star"] },
  { title:"Mini Paper Box", steps:["Fold square","Crease edges","Open folds","Form box","Decorate"] },
  { title:"Paper Rose", steps:["Cut spiral","Roll tightly","Glue base","Add leaves","Display"] },
  { title:"Paper Crown", steps:["Cut strip","Make spikes","Decorate jewels","Glue ends","Wear"] },
  { title:"Paper Lantern", steps:["Fold sheet","Cut lines","Open into cylinder","Glue edges","Hang"] },
  { title:"Origami Crane", steps:["Fold square base","Form wings","Fold neck","Pull tail","Shape"] },
  { title:"Paper Fan", steps:["Accordion fold","Tie base","Open fan","Decorate","Use"] },
  { title:"Bookmark Corner", steps:["Fold triangle","Fold corners","Decorate face","Fit on page","Done"] },
  { title:"Paper Snowflake", steps:["Fold into triangle","Cut shapes","Unfold carefully","Hang","Enjoy"] },
  { title:"Paper Cube", steps:["Make 6 faces","Fold tabs","Assemble cube","Glue edges","Decorate"] },
  { title:"Origami Frog", steps:["Fold rectangle","Make legs","Fold body","Press back","It jumps"] },
  { title:"Paper Bracelet", steps:["Cut strips","Weave pattern","Tighten weave","Tape ends","Wear"] }
];

function craftsHTML(){
  return `
    <h3>Select a craft:</h3>
    ${craftsDB.map((c,i)=>`
      <div style="margin-top:12px;padding:14px;border-radius:18px;
      background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);
      cursor:pointer;" onclick="showCraft(${i})">
        <b>${c.title}</b>
      </div>
    `).join("")}
    <div id="craftSteps" style="margin-top:18px;">---</div>
  `;
}

function showCraft(i){
  const box=document.getElementById("craftSteps");
  const craft=craftsDB[i];
  box.innerHTML=`
    <h3 style="margin-top:10px;">${craft.title}</h3>
    <ol style="margin-top:10px;padding-left:20px;line-height:1.8;">
      ${craft.steps.map(s=>`<li>${s}</li>`).join("")}
    </ol>
  `;
  emy("Here are steps for " + craft.title);
}

/* ===============================
   WIKIPEDIA SEARCH
   =============================== */
function encyclopediaHTML(){
  return `
    <h3>Search Wikipedia</h3>
    <input id="wikiInput" placeholder="plastic, moon, ocean..." />
    <button onclick="wikiSearch()">Search</button>
    <div id="wikiResult" style="margin-top:14px;">---</div>
  `;
}

async function wikiSearch(){
  const input=document.getElementById("wikiInput").value.trim();
  const result=document.getElementById("wikiResult");

  if(!input){
    result.innerText="Type something first.";
    return;
  }

  result.innerText="Searching...";

  try{
    const url=`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(input)}`;
    const res=await fetch(url);
    const data=await res.json();

    if(data.type && data.type.includes("not_found")){
      result.innerText="No results found.";
      return;
    }

    result.innerHTML=`
      <h3>${data.title}</h3>
      <p style="margin-top:10px;line-height:1.6;">${data.extract}</p>
    `;
  }catch{
    result.innerText="Wikipedia fetch failed.";
  }
}

/* ===============================
   WORLD CLOCK
   =============================== */
function worldClockHTML(){
  return `
    <h3>Select Country / City</h3>
    <select id="tzSelect">
      <option value="Asia/Kolkata">India (Kolkata)</option>
      <option value="Asia/Dubai">UAE (Dubai)</option>
      <option value="Asia/Singapore">Singapore</option>
      <option value="Asia/Tokyo">Japan (Tokyo)</option>
      <option value="Asia/Seoul">South Korea (Seoul)</option>
      <option value="Asia/Shanghai">China (Shanghai)</option>
      <option value="Asia/Jakarta">Indonesia (Jakarta)</option>
      <option value="Asia/Bangkok">Thailand (Bangkok)</option>
      <option value="Asia/Kathmandu">Nepal (Kathmandu)</option>
      <option value="Asia/Karachi">Pakistan (Karachi)</option>

      <option value="Australia/Sydney">Australia (Sydney)</option>
      <option value="Pacific/Auckland">New Zealand (Auckland)</option>

      <option value="Europe/London">UK (London)</option>
      <option value="Europe/Paris">France (Paris)</option>
      <option value="Europe/Rome">Italy (Rome)</option>
      <option value="Europe/Berlin">Germany (Berlin)</option>
      <option value="Europe/Madrid">Spain (Madrid)</option>
      <option value="Europe/Amsterdam">Netherlands (Amsterdam)</option>
      <option value="Europe/Stockholm">Sweden (Stockholm)</option>
      <option value="Europe/Moscow">Russia (Moscow)</option>

      <option value="America/New_York">USA (New York)</option>
      <option value="America/Los_Angeles">USA (Los Angeles)</option>
      <option value="America/Chicago">USA (Chicago)</option>
      <option value="America/Denver">USA (Denver)</option>
      <option value="America/Toronto">Canada (Toronto)</option>
      <option value="America/Vancouver">Canada (Vancouver)</option>
      <option value="America/Mexico_City">Mexico (Mexico City)</option>
      <option value="America/Sao_Paulo">Brazil (São Paulo)</option>
      <option value="America/Argentina/Buenos_Aires">Argentina (Buenos Aires)</option>

      <option value="Africa/Cairo">Egypt (Cairo)</option>
      <option value="Africa/Johannesburg">South Africa (Johannesburg)</option>
      <option value="Africa/Nairobi">Kenya (Nairobi)</option>
      <option value="Africa/Lagos">Nigeria (Lagos)</option>
    </select>

    <div style="margin-top:18px;">
      <h1 id="worldTime" style="font-size:44px;">--:--</h1>
    </div>
  `;
}

function setupWorldClock(){
  const select=document.getElementById("tzSelect");
  const display=document.getElementById("worldTime");

  function tick(){
    display.innerText=new Date().toLocaleTimeString("en-US",{timeZone:select.value});
  }

  tick();
  setInterval(tick,1000);
}

/* ===============================
   PAINT APP
   =============================== */
function paintHTML(){
  return `
    <input type="color" id="paintColor" value="#7fd6d2" />
    <input type="range" id="paintSize" min="2" max="30" value="7" />
    <button onclick="paintClear()">Clear</button>

    <canvas id="paintCanvas" width="900" height="320"
      style="margin-top:14px;border-radius:18px;background:white;width:100%;"></canvas>
  `;
}

let painting=false;
function setupPaint(){
  const canvas=document.getElementById("paintCanvas");
  const ctx=canvas.getContext("2d");

  canvas.onmousedown=()=>painting=true;
  canvas.onmouseup=()=>painting=false;

  canvas.onmousemove=(e)=>{
    if(!painting) return;

    const rect=canvas.getBoundingClientRect();
    const x=e.clientX-rect.left;
    const y=e.clientY-rect.top;

    ctx.fillStyle=document.getElementById("paintColor").value;
    const size=document.getElementById("paintSize").value;

    ctx.beginPath();
    ctx.arc(x,y,size/2,0,Math.PI*2);
    ctx.fill();
  };
}

function paintClear(){
  const canvas=document.getElementById("paintCanvas");
  const ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

/* ===============================
   NOTES
   =============================== */
function notesHTML(){
  return `<textarea id="notesBox" style="height:300px;" placeholder="Write your notes..."></textarea>`;
}

function setupNotes(){
  const box=document.getElementById("notesBox");
  box.value=localStorage.getItem("notes") || "";
  box.oninput=()=>localStorage.setItem("notes",box.value);
}

/* ===============================
   VOICE DETECTOR
   =============================== */
function voiceHTML(){
  return `
    <button onclick="startVoice()">Start Listening</button>
    <button onclick="stopVoice()">Stop</button>
    <div id="voiceText" style="margin-top:14px;">---</div>
  `;
}

let recognition=null;

function startVoice(){
  const box=document.getElementById("voiceText");
  const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition;

  if(!SpeechRecognition){
    box.innerText="Not supported in this browser.";
    return;
  }

  recognition=new SpeechRecognition();
  recognition.lang="en-US";
  recognition.continuous=true;

  recognition.onresult=(event)=>{
    box.innerText=event.results[event.results.length-1][0].transcript;
    emy("Voice detected.");
  };

  recognition.start();
  emy("Listening...");
}

function stopVoice(){
  if(recognition) recognition.stop();
  emy("Stopped listening.");
}

/* ===============================
   FAKE NEWS DETECTOR
   =============================== */
function fakeNewsHTML(){
  return `
    <textarea id="newsInput" style="height:140px;" placeholder="Paste headline or paragraph..."></textarea>
    <button onclick="analyzeNews()">Analyze</button>
    <div id="newsResult" style="margin-top:14px;">---</div>
  `;
}

async function analyzeNews(){
  const input=document.getElementById("newsInput").value.trim();
  const out=document.getElementById("newsResult");

  if(!input){
    out.innerText="Paste something first.";
    return;
  }

  out.innerText="Analyzing...";

  let score=85;
  let reasons=[];

  const clickbait=["shocking","secret","miracle","breaking","unbelievable","exposed","truth revealed"];
  clickbait.forEach(w=>{
    if(input.toLowerCase().includes(w)){
      score-=12;
      reasons.push("Clickbait phrase: "+w);
    }
  });

  if((input.match(/!/g)||[]).length>=2){
    score-=10;
    reasons.push("Too many exclamation marks.");
  }

  if(input.length<40){
    score-=15;
    reasons.push("Too short (low context).");
  }

  try{
    const query=input.split(" ").slice(0,5).join(" ");
    const url=`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const res=await fetch(url);
    const data=await res.json();

    if(data.extract){
      score+=15;
      reasons.push("Wikipedia contains related topic information.");
    }else{
      score-=15;
      reasons.push("Wikipedia did not confirm this topic.");
    }
  }catch{
    reasons.push("Wikipedia check failed.");
  }

  if(score>100) score=100;
  if(score<0) score=0;

  let status="Likely Real";
  if(score<65) status="Suspicious";
  if(score<45) status="High Fake Risk";

  out.innerHTML=`
    <h3>Trust Score: ${score}/100</h3>
    <p><b>Status:</b> ${status}</p>
    <ul style="margin-top:12px;padding-left:20px;line-height:1.6;">
      ${reasons.map(r=>`<li>${r}</li>`).join("")}
    </ul>
  `;

  emy("Analysis complete.");
}

/* ===============================
   GAMES HUB (12 games)
   =============================== */
function gamesHTML(){
  return `
    <h3>Select a Game</h3>

    <button onclick="loadGame('snake')">Snake</button>
    <button onclick="loadGame('tictactoe')">Tic Tac Toe</button>
    <button onclick="loadGame('rps')">Rock Paper Scissors</button>
    <button onclick="loadGame('memory')">Memory Cards</button>
    <button onclick="loadGame('dice')">Dice Roller</button>
    <button onclick="loadGame('coin')">Coin Flip</button>
    <button onclick="loadGame('guess')">Guess the Number</button>
    <button onclick="loadGame('typing')">Typing Speed Test</button>
    <button onclick="loadGame('hangman')">Hangman</button>
    <button onclick="loadGame('reaction')">Reaction Time Test</button>
    <button onclick="loadGame('math')">Quick Math Challenge</button>
    <button onclick="loadGame('color')">Color Match Game</button>

    <div id="gameArea" style="margin-top:16px;">---</div>
  `;
}

function loadGame(game){
  const area=document.getElementById("gameArea");

  if(game==="snake"){
    area.innerHTML=snakeHTML();
    setupSnake();
    emy("Snake loaded.");
  }

  if(game==="tictactoe"){
    area.innerHTML=ticTacToeHTML();
    setupTicTacToe();
    emy("Tic Tac Toe loaded.");
  }

  if(game==="rps"){
    area.innerHTML=rpsHTML();
    emy("Choose rock paper or scissors.");
  }

  if(game==="memory"){
    area.innerHTML=memoryHTML();
    setupMemory();
    emy("Memory game loaded.");
  }

  if(game==="dice"){
    area.innerHTML=diceHTML();
    emy("Roll the dice.");
  }

  if(game==="coin"){
    area.innerHTML=coinHTML();
    emy("Flip the coin.");
  }

  if(game==="guess"){
    area.innerHTML=guessHTML();
    setupGuess();
    emy("Guess a number between 1 and 50.");
  }

  if(game==="typing"){
    area.innerHTML=typingHTML();
    setupTyping();
    emy("Typing test started.");
  }

  if(game==="hangman"){
    area.innerHTML=hangmanHTML();
    setupHangman();
    emy("Hangman ready.");
  }

  if(game==="reaction"){
    area.innerHTML=reactionHTML();
    setupReaction();
    emy("Reaction test loaded.");
  }

  if(game==="math"){
    area.innerHTML=mathHTML();
    setupMath();
    emy("Quick math challenge ready.");
  }

  if(game==="color"){
    area.innerHTML=colorHTML();
    setupColorGame();
    emy("Color match game loaded.");
  }
}

/* ---------- Snake ---------- */
function snakeHTML(){
  return `
    <p style="opacity:0.8;">Use arrow keys.</p>
    <canvas id="snakeCanvas" width="400" height="400"
      style="margin-top:14px;border-radius:18px;background:black;width:100%;max-width:420px;"></canvas>
    <div id="snakeScore" style="margin-top:14px;font-weight:800;">Score: 0</div>
  `;
}

let snakeInterval=null;

function setupSnake(){
  const canvas=document.getElementById("snakeCanvas");
  const ctx=canvas.getContext("2d");

  let snake=[{x:200,y:200}];
  let food={x:100,y:100};
  let dx=20, dy=0;
  let score=0;

  document.onkeydown=(e)=>{
    if(e.key==="ArrowUp" && dy===0){dx=0;dy=-20;}
    if(e.key==="ArrowDown" && dy===0){dx=0;dy=20;}
    if(e.key==="ArrowLeft" && dx===0){dx=-20;dy=0;}
    if(e.key==="ArrowRight" && dx===0){dx=20;dy=0;}
  };

  clearInterval(snakeInterval);

  snakeInterval=setInterval(()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);

    const head={x:snake[0].x+dx,y:snake[0].y+dy};

    if(head.x<0||head.y<0||head.x>=canvas.width||head.y>=canvas.height||
      snake.some(s=>s.x===head.x&&s.y===head.y)){
      clearInterval(snakeInterval);
      emy("Game over.");
      return;
    }

    snake.unshift(head);

    if(head.x===food.x&&head.y===food.y){
      score++;
      document.getElementById("snakeScore").innerText="Score: "+score;
      food.x=Math.floor(Math.random()*20)*20;
      food.y=Math.floor(Math.random()*20)*20;
      playClickSound(850);
    }else{
      snake.pop();
    }

    ctx.fillStyle="#7fd6d2";
    snake.forEach(s=>ctx.fillRect(s.x,s.y,18,18));

    ctx.fillStyle="#d9a4b2";
    ctx.fillRect(food.x,food.y,18,18);

  },140);
}

/* ---------- TicTacToe ---------- */
function ticTacToeHTML(){
  return `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:280px;margin-top:10px;" id="tttBoard"></div>
    <div id="tttStatus" style="margin-top:14px;font-weight:800;">Player X turn</div>
    <button onclick="resetTicTacToe()">Reset</button>
  `;
}

let tttState=Array(9).fill("");
let tttPlayer="X";

function setupTicTacToe(){renderTTT();}

function renderTTT(){
  const board=document.getElementById("tttBoard");
  const status=document.getElementById("tttStatus");
  board.innerHTML="";

  tttState.forEach((cell,i)=>{
    const btn=document.createElement("button");
    btn.style.height="80px";
    btn.style.fontSize="26px";
    btn.innerText=cell||"";
    btn.onclick=()=>playTTT(i);
    board.appendChild(btn);
  });

  status.innerText="Player "+tttPlayer+" turn";
}

function playTTT(i){
  if(tttState[i]) return;
  tttState[i]=tttPlayer;
  playClickSound(650);

  const win=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(let p of win){
    const[a,b,c]=p;
    if(tttState[a] && tttState[a]===tttState[b] && tttState[b]===tttState[c]){
      document.getElementById("tttStatus").innerText="Winner: "+tttState[a];
      emy("Winner is "+tttState[a]);
      return;
    }
  }

  if(!tttState.includes("")){
    document.getElementById("tttStatus").innerText="Draw!";
    emy("It's a draw.");
    return;
  }

  tttPlayer=tttPlayer==="X"?"O":"X";
  renderTTT();
}

function resetTicTacToe(){
  tttState=Array(9).fill("");
  tttPlayer="X";
  renderTTT();
}

/* ---------- RPS ---------- */
function rpsHTML(){
  return `
    <button onclick="playRPS('rock')">Rock</button>
    <button onclick="playRPS('paper')">Paper</button>
    <button onclick="playRPS('scissors')">Scissors</button>
    <div id="rpsResult" style="margin-top:14px;font-weight:800;">---</div>
  `;
}

function playRPS(user){
  const options=["rock","paper","scissors"];
  const cpu=options[Math.floor(Math.random()*3)];
  let result="";

  if(user===cpu) result="Draw!";
  else if(
    (user==="rock"&&cpu==="scissors")||
    (user==="paper"&&cpu==="rock")||
    (user==="scissors"&&cpu==="paper")
  ) result="You Win!";
  else result="You Lose!";

  playClickSound(740);
  document.getElementById("rpsResult").innerHTML=`You: <b>${user}</b> | CPU: <b>${cpu}</b><br>${result}`;
}

/* ---------- Memory ---------- */
function memoryHTML(){
  return `
    <p style="opacity:0.8;">Match all pairs.</p>
    <div id="memoryBoard" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:320px;margin-top:12px;"></div>
    <div id="memoryStatus" style="margin-top:14px;font-weight:800;">---</div>
    <button onclick="setupMemory()">Restart</button>
  `;
}

let memoryCards=[];
let memoryFlipped=[];
let memoryMatched=0;

function setupMemory(){
  const icons=["🌸","🌸","⭐","⭐","🍓","🍓","🐧","🐧","🌙","🌙","💎","💎","🎀","🎀","🍀","🍀"];
  memoryCards=icons.sort(()=>Math.random()-0.5);
  memoryFlipped=[];
  memoryMatched=0;

  const board=document.getElementById("memoryBoard");
  const status=document.getElementById("memoryStatus");
  board.innerHTML="";
  status.innerText="Start matching!";

  memoryCards.forEach((icon,i)=>{
    const btn=document.createElement("button");
    btn.style.height="70px";
    btn.style.fontSize="22px";
    btn.innerText="❓";
    btn.onclick=()=>flipMemory(i,btn);
    board.appendChild(btn);
  });
}

function flipMemory(i,btn){
  if(memoryFlipped.length===2) return;
  if(btn.innerText!=="❓") return;

  btn.innerText=memoryCards[i];
  memoryFlipped.push({i,btn});
  playClickSound(620);

  if(memoryFlipped.length===2){
    const a=memoryFlipped[0];
    const b=memoryFlipped[1];

    if(memoryCards[a.i]===memoryCards[b.i]){
      memoryMatched+=2;
      memoryFlipped=[];
      document.getElementById("memoryStatus").innerText="Matched!";
      if(memoryMatched===memoryCards.length){
        document.getElementById("memoryStatus").innerText="You won!";
        emy("You completed memory game!");
      }
    }else{
      document.getElementById("memoryStatus").innerText="Try again...";
      setTimeout(()=>{
        a.btn.innerText="❓";
        b.btn.innerText="❓";
        memoryFlipped=[];
      },700);
    }
  }
}

/* ---------- Dice ---------- */
function diceHTML(){
  return `
    <button onclick="rollDice()">Roll Dice 🎲</button>
    <h2 id="diceResult" style="margin-top:14px;">---</h2>
  `;
}
function rollDice(){
  const num=Math.floor(Math.random()*6)+1;
  document.getElementById("diceResult").innerText="You rolled: "+num;
  playClickSound(780);
}

/* ---------- Coin ---------- */
function coinHTML(){
  return `
    <button onclick="flipCoin()">Flip Coin 🪙</button>
    <h2 id="coinResult" style="margin-top:14px;">---</h2>
  `;
}
function flipCoin(){
  const result=Math.random()>0.5?"Heads":"Tails";
  document.getElementById("coinResult").innerText=result;
  playClickSound(780);
}

/* ---------- Guess Number ---------- */
let secretNum=0;
function guessHTML(){
  return `
    <p style="opacity:0.8;">Guess between 1 and 50</p>
    <input id="guessInput" placeholder="Type number..." />
    <button onclick="submitGuess()">Guess</button>
    <div id="guessResult" style="margin-top:14px;font-weight:800;">---</div>
  `;
}
function setupGuess(){
  secretNum=Math.floor(Math.random()*50)+1;
}
function submitGuess(){
  const val=parseInt(document.getElementById("guessInput").value);
  const box=document.getElementById("guessResult");

  if(!val){box.innerText="Enter a number."; return;}
  if(val===secretNum){box.innerText="Correct! 🎉"; playClickSound(900);}
  else if(val>secretNum){box.innerText="Too high!";}
  else{box.innerText="Too low!";}
}

/* ---------- Typing Speed ---------- */
let typingStart=0;
function typingHTML(){
  return `
    <p style="opacity:0.8;">Type this sentence as fast as possible:</p>
    <h3 id="typingSentence">NeuraLib OS is a futuristic aesthetic dashboard.</h3>
    <textarea id="typingBox" style="height:120px;"></textarea>
    <button onclick="checkTyping()">Finish</button>
    <div id="typingResult" style="margin-top:14px;font-weight:800;">---</div>
  `;
}
function setupTyping(){
  typingStart=Date.now();
}
function checkTyping(){
  const target=document.getElementById("typingSentence").innerText;
  const typed=document.getElementById("typingBox").value.trim();
  const end=Date.now();
  const seconds=((end-typingStart)/1000).toFixed(1);

  if(typed===target){
    document.getElementById("typingResult").innerText="Perfect! Time: "+seconds+" sec";
    playClickSound(900);
  }else{
    document.getElementById("typingResult").innerText="Not exact. Try again.";
  }
}

/* ---------- Hangman ---------- */
let hangWord="";
let hangHidden="";
function hangmanHTML(){
  return `
    <p style="opacity:0.8;">Guess the word</p>
    <h2 id="hangDisplay">---</h2>
    <input id="hangInput" placeholder="Type a letter..." maxlength="1" />
    <button onclick="guessLetter()">Guess Letter</button>
    <div id="hangResult" style="margin-top:14px;font-weight:800;">---</div>
  `;
}
function setupHangman(){
  const words=["CYAN","ROSE","PENGUIN","WIKIPEDIA","NEURALIB","DASHBOARD"];
  hangWord=words[Math.floor(Math.random()*words.length)];
  hangHidden="_".repeat(hangWord.length);
  document.getElementById("hangDisplay").innerText=hangHidden;
}
function guessLetter(){
  const letter=document.getElementById("hangInput").value.toUpperCase();
  if(!letter) return;

  let newHidden="";
  for(let i=0;i<hangWord.length;i++){
    if(hangWord[i]===letter) newHidden+=letter;
    else newHidden+=hangHidden[i];
  }
  hangHidden=newHidden;
  document.getElementById("hangDisplay").innerText=hangHidden;

  if(!hangHidden.includes("_")){
    document.getElementById("hangResult").innerText="You won!";
    emy("Hangman completed!");
    playClickSound(900);
  }
}

/* ---------- Reaction Time ---------- */
let reactionStart=0;
function reactionHTML(){
  return `
    <p style="opacity:0.8;">Wait until button turns READY then click.</p>
    <button id="reactionBtn" onclick="reactionClick()">WAIT...</button>
    <div id="reactionResult" style="margin-top:14px;font-weight:800;">---</div>
  `;
}
function setupReaction(){
  const btn=document.getElementById("reactionBtn");
  btn.innerText="WAIT...";
  btn.dataset.ready="false";

  setTimeout(()=>{
    btn.innerText="READY!";
    btn.dataset.ready="true";
    reactionStart=Date.now();
  },Math.random()*3000+1500);
}
function reactionClick(){
  const btn=document.getElementById("reactionBtn");
  const box=document.getElementById("reactionResult");

  if(btn.dataset.ready!=="true"){
    box.innerText="Too early!";
    return;
  }

  const time=Date.now()-reactionStart;
  box.innerText="Reaction time: "+time+" ms";
  playClickSound(850);
}

/* ---------- Math Challenge ---------- */
let mathAns=0;
function mathHTML(){
  return `
    <h3 id="mathQuestion">---</h3>
    <input id="mathInput" placeholder="Answer..." />
    <button onclick="submitMath()">Submit</button>
    <div id="mathResult" style="margin-top:14px;font-weight:800;">---</div>
  `;
}
function setupMath(){
  const a=Math.floor(Math.random()*20)+1;
  const b=Math.floor(Math.random()*20)+1;
  mathAns=a+b;
  document.getElementById("mathQuestion").innerText=`${a} + ${b} = ?`;
}
function submitMath(){
  const val=parseInt(document.getElementById("mathInput").value);
  if(val===mathAns){
    document.getElementById("mathResult").innerText="Correct!";
    playClickSound(900);
  }else{
    document.getElementById("mathResult").innerText="Wrong. Try again.";
  }
}

/* ---------- Color Match ---------- */
let correctColor="";
function colorHTML(){
  return `
    <p style="opacity:0.8;">Pick the correct color name.</p>
    <h2 id="colorWord">---</h2>
    <button onclick="chooseColor('cyan')">Cyan</button>
    <button onclick="chooseColor('rose')">Rose</button>
    <button onclick="chooseColor('purple')">Purple</button>
    <div id="colorResult" style="margin-top:14px;font-weight:800;">---</div>
  `;
}
function setupColorGame(){
  const colors=["cyan","rose","purple"];
  correctColor=colors[Math.floor(Math.random()*colors.length)];
  document.getElementById("colorWord").innerText=correctColor.toUpperCase();
}
function chooseColor(c){
  if(c===correctColor){
    document.getElementById("colorResult").innerText="Correct!";
    playClickSound(900);
  }else{
    document.getElementById("colorResult").innerText="Wrong!";
  }
  setupColorGame();
}

/* ===============================
   CREDITS
   =============================== */
function creditsHTML(){
  return `
    <div style="text-align:center;margin-top:60px;">
      <h1 style="font-weight:950;letter-spacing:2px;">Created by Saanvi</h1>
      <p style="opacity:0.7;margin-top:10px;">NeuraLib OS v8</p>
    </div>
  `;
}

emy("Welcome. Tap a box to open an app.");
