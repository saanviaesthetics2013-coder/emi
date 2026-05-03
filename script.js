const clock = document.getElementById("clock");
const panel = document.getElementById("panel");
const panelTitle = document.getElementById("panelTitle");
const panelContent = document.getElementById("panelContent");
const emyBubble = document.getElementById("emyBubble");
const appsDiv = document.getElementById("apps");

function emy(text){
  emyBubble.innerText = text;
}

function updateClock(){
  clock.innerText = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
setInterval(updateClock, 1000);
updateClock();

/* THEME */
function toggleTheme(){
  if(document.documentElement.getAttribute("data-theme") === "light"){
    document.documentElement.removeAttribute("data-theme");
    emy("Neon Dark theme activated.");
  } else {
    document.documentElement.setAttribute("data-theme","light");
    emy("Light Neon theme activated.");
  }
}

/* APPS LIST */
const apps = [
  {id:"games", title:"🎮 Games Hub", desc:"Play 12 mini games inside NeuraLib OS.", badge:"Gaming"},
  {id:"crafts", title:"🦋 Craft Studio", desc:"Explore paper crafts with steps.", badge:"Creative"},
  {id:"encyclopedia", title:"📚 Encyclopedia", desc:"Search topics using Wikipedia API.", badge:"Knowledge"},
  {id:"worldclock", title:"🌍 World Clock", desc:"Check live time in many countries.", badge:"Live"},
  {id:"paint", title:"🎨 Paint App", desc:"Draw with brush size + colors.", badge:"Canvas"},
  {id:"notes", title:"📝 Notes", desc:"Write notes saved automatically.", badge:"Storage"},
  {id:"voice", title:"🎤 Voice Detector", desc:"Speech recognition in browser.", badge:"Speech"},
  {id:"fakenews", title:"📰 Fake News Detector", desc:"Analyze headlines with Wikipedia support.", badge:"AI"},
  {id:"credits", title:"🌸 Credits", desc:"Final system page.", badge:"End"}
];

function renderApps(){
  appsDiv.innerHTML = "";
  apps.forEach(app=>{
    const card = document.createElement("div");
    card.className = "app";
    card.onclick = ()=>openPanel(app.id);

    card.innerHTML = `
      <h2>${app.title}</h2>
      <p>${app.desc}</p>
      <span class="badge">${app.badge}</span>
    `;
    appsDiv.appendChild(card);
  });
}
renderApps();

/* PANEL */
function openPanel(app){
  panel.classList.remove("hidden");

  if(app==="games"){
    panelTitle.innerText = "Games Hub";
    panelContent.innerHTML = gamesHTML();
    emy("Welcome to Games Hub. Choose a game.");
  }

  if(app==="crafts"){
    panelTitle.innerText = "Craft Studio";
    panelContent.innerHTML = craftsHTML();
    emy("Choose a craft to view steps.");
  }

  if(app==="encyclopedia"){
    panelTitle.innerText = "Encyclopedia";
    panelContent.innerHTML = encyclopediaHTML();
    emy("Search anything. Wikipedia will answer.");
  }

  if(app==="worldclock"){
    panelTitle.innerText = "World Clock";
    panelContent.innerHTML = worldClockHTML();
    setupWorldClock();
    emy("Choose a city to view time.");
  }

  if(app==="paint"){
    panelTitle.innerText = "Paint App";
    panelContent.innerHTML = paintHTML();
    setupPaint();
    emy("Paint freely with neon vibes.");
  }

  if(app==="notes"){
    panelTitle.innerText = "Notes";
    panelContent.innerHTML = notesHTML();
    setupNotes();
    emy("Notes auto-save. Write anything.");
  }

  if(app==="voice"){
    panelTitle.innerText = "Voice Detector";
    panelContent.innerHTML = voiceHTML();
    emy("Start listening and speak.");
  }

  if(app==="fakenews"){
    panelTitle.innerText = "Fake News Detector";
    panelContent.innerHTML = fakeNewsHTML();
    emy("Paste a headline and I will analyze it.");
  }

  if(app==="credits"){
    panelTitle.innerText = "Credits";
    panelContent.innerHTML = creditsHTML();
    emy("Thank you for exploring NeuraLib OS.");
  }
}

function closePanel(){
  panel.classList.add("hidden");
  emy("Choose another app from the dashboard.");
}

/* ================================
   CRAFT STUDIO
================================ */
const craftsDB = [
  { title:"Paper Butterfly", steps:["Fold paper","Draw wings","Cut carefully","Decorate","Hang with thread"] },
  { title:"Paper Plane", steps:["Fold in half","Fold corners","Fold nose","Fold wings","Fly it"] },
  { title:"Origami Heart", steps:["Fold diagonally","Fold corners","Shape top","Flatten","Decorate"] },
  { title:"Paper Star", steps:["Cut strips","Tie knot","Fold sides","Inflate gently","Shape star"] },
  { title:"Mini Paper Box", steps:["Fold square","Crease edges","Open folds","Form box","Decorate"] },
  { title:"Paper Rose", steps:["Cut spiral","Roll tightly","Glue base","Add leaves","Display"] },
  { title:"Paper Lantern", steps:["Fold sheet","Cut lines","Open cylinder","Glue edges","Hang"] },
  { title:"Origami Crane", steps:["Fold square base","Form wings","Fold neck","Pull tail","Shape"] },
  { title:"Paper Fan", steps:["Accordion fold","Tie base","Open fan","Decorate","Use"] },
  { title:"Paper Snowflake", steps:["Fold triangle","Cut shapes","Unfold carefully","Hang","Enjoy"] },
  { title:"Paper Crown", steps:["Cut strip","Make spikes","Decorate jewels","Glue ends","Wear"] },
  { title:"Bookmark Corner", steps:["Fold triangle","Fold corners","Decorate face","Fit on page","Done"] }
];

function craftsHTML(){
  return `
    <h3>Select a craft:</h3>
    ${craftsDB.map((c,i)=>`
      <div style="margin-top:12px;padding:14px;border-radius:18px;
      background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);
      cursor:pointer;" onclick="showCraft(${i})">
        <b>${c.title}</b>
      </div>
    `).join("")}
    <div id="craftSteps" style="margin-top:18px;">---</div>
  `;
}

function showCraft(i){
  const box = document.getElementById("craftSteps");
  const craft = craftsDB[i];
  box.innerHTML = `
    <h3 style="margin-top:10px;">${craft.title}</h3>
    <ol style="margin-top:10px;padding-left:20px;line-height:1.8;">
      ${craft.steps.map(s=>`<li>${s}</li>`).join("")}
    </ol>
  `;
  emy("Here are the steps for "+craft.title);
}

/* ================================
   WIKIPEDIA SEARCH
================================ */
function encyclopediaHTML(){
  return `
    <h3>Wikipedia Search</h3>
    <input id="wikiInput" placeholder="plastic, moon, ocean..." />
    <button onclick="wikiSearch()">Search</button>
    <div id="wikiResult" style="margin-top:14px;">---</div>
  `;
}

async function wikiSearch(){
  const input = document.getElementById("wikiInput").value.trim();
  const result = document.getElementById("wikiResult");

  if(!input){
    result.innerText = "Type something first.";
    return;
  }

  result.innerText = "Searching...";

  try{
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(input)}`;
    const res = await fetch(url);
    const data = await res.json();

    if(data.type && data.type.includes("not_found")){
      result.innerText = "No results found.";
      return;
    }

    result.innerHTML = `
      <h3>${data.title}</h3>
      <p style="margin-top:10px;line-height:1.6;">${data.extract}</p>
    `;
  }catch{
    result.innerText = "Wikipedia fetch failed.";
  }
}

/* ================================
   WORLD CLOCK (MORE OPTIONS)
================================ */
function worldClockHTML(){
  return `
    <h3>Select City</h3>
    <select id="tzSelect">
      <option value="Asia/Kolkata">India (Kolkata)</option>
      <option value="Asia/Dubai">UAE (Dubai)</option>
      <option value="Asia/Singapore">Singapore</option>
      <option value="Asia/Tokyo">Japan (Tokyo)</option>
      <option value="Asia/Seoul">Korea (Seoul)</option>
      <option value="Asia/Shanghai">China (Shanghai)</option>
      <option value="Australia/Sydney">Australia (Sydney)</option>
      <option value="Pacific/Auckland">New Zealand (Auckland)</option>

      <option value="Europe/London">UK (London)</option>
      <option value="Europe/Paris">France (Paris)</option>
      <option value="Europe/Rome">Italy (Rome)</option>
      <option value="Europe/Berlin">Germany (Berlin)</option>
      <option value="Europe/Madrid">Spain (Madrid)</option>

      <option value="America/New_York">USA (New York)</option>
      <option value="America/Los_Angeles">USA (Los Angeles)</option>
      <option value="America/Chicago">USA (Chicago)</option>
      <option value="America/Toronto">Canada (Toronto)</option>
      <option value="America/Sao_Paulo">Brazil (São Paulo)</option>

      <option value="Africa/Cairo">Egypt (Cairo)</option>
      <option value="Africa/Johannesburg">South Africa</option>
    </select>

    <div style="margin-top:18px;">
      <h1 id="worldTime" style="font-size:44px;">--:--</h1>
    </div>
  `;
}

function setupWorldClock(){
  const select = document.getElementById("tzSelect");
  const display = document.getElementById("worldTime");

  function tick(){
    display.innerText = new Date().toLocaleTimeString("en-US", {
      timeZone: select.value
    });
  }

  tick();
  setInterval(tick, 1000);
}

/* ================================
   PAINT APP
================================ */
function paintHTML(){
  return `
    <input type="color" id="paintColor" value="#00ffd5" />
    <input type="range" id="paintSize" min="2" max="30" value="7" />
    <button onclick="paintClear()">Clear</button>

    <canvas id="paintCanvas" width="900" height="320"
      style="margin-top:14px;border-radius:18px;background:white;width:100%;"></canvas>
  `;
}

let painting = false;

function setupPaint(){
  const canvas = document.getElementById("paintCanvas");
  const ctx = canvas.getContext("2d");

  canvas.onmousedown = () => painting = true;
  canvas.onmouseup = () => painting = false;

  canvas.onmousemove = (e) => {
    if(!painting) return;

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

function paintClear(){
  const canvas = document.getElementById("paintCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

/* ================================
   NOTES
================================ */
function notesHTML(){
  return `<textarea id="notesBox" style="height:300px;" placeholder="Write your notes..."></textarea>`;
}

function setupNotes(){
  const box = document.getElementById("notesBox");
  box.value = localStorage.getItem("notes") || "";
  box.oninput = () => localStorage.setItem("notes", box.value);
}

/* ================================
   VOICE DETECTOR
================================ */
function voiceHTML(){
  return `
    <button onclick="startVoice()">Start Listening</button>
    <button onclick="stopVoice()">Stop</button>
    <div id="voiceText" style="margin-top:14px;">---</div>
  `;
}

let recognition = null;

function startVoice(){
  const box = document.getElementById("voiceText");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if(!SpeechRecognition){
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

function stopVoice(){
  if(recognition) recognition.stop();
  emy("Stopped listening.");
}

/* ================================
   FAKE NEWS DETECTOR
================================ */
function fakeNewsHTML(){
  return `
    <textarea id="newsInput" style="height:140px;" placeholder="Paste headline or paragraph..."></textarea>
    <button onclick="analyzeNews()">Analyze</button>
    <div id="newsResult" style="margin-top:14px;">---</div>
  `;
}

async function analyzeNews(){
  const input = document.getElementById("newsInput").value.trim();
  const out = document.getElementById("newsResult");

  if(!input){
    out.innerText = "Paste something first.";
    return;
  }

  out.innerText = "Analyzing...";

  let score = 85;
  let reasons = [];

  const clickbait = ["shocking","secret","miracle","breaking","unbelievable","exposed","truth revealed"];
  clickbait.forEach(w=>{
    if(input.toLowerCase().includes(w)){
      score -= 12;
      reasons.push("Clickbait phrase: "+w);
    }
  });

  if((input.match(/!/g)||[]).length >= 2){
    score -= 10;
    reasons.push("Too many exclamation marks.");
  }

  if(input.length < 40){
    score -= 15;
    reasons.push("Too short (low context).");
  }

  try{
    const query = input.split(" ").slice(0,5).join(" ");
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if(data.extract){
      score += 15;
      reasons.push("Wikipedia contains related topic information.");
    } else {
      score -= 15;
      reasons.push("Wikipedia did not confirm this topic.");
    }
  }catch{
    reasons.push("Wikipedia check failed.");
  }

  if(score > 100) score = 100;
  if(score < 0) score = 0;

  let status = "Likely Real";
  if(score < 65) status = "Suspicious";
  if(score < 45) status = "High Fake Risk";

  out.innerHTML = `
    <h3>Trust Score: ${score}/100</h3>
    <p><b>Status:</b> ${status}</p>
    <ul style="margin-top:12px;padding-left:20px;line-height:1.6;">
      ${reasons.map(r=>`<li>${r}</li>`).join("")}
    </ul>
  `;

  emy("Analysis complete.");
}

/* ================================
   GAMES HUB (12 GAMES)
================================ */
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
  const area = document.getElementById("gameArea");

  if(game==="snake"){
    area.innerHTML = snakeHTML();
    setupSnake();
  }

  if(game==="tictactoe"){
    area.innerHTML = ticTacToeHTML();
    setupTicTacToe();
  }

  if(game==="rps"){
    area.innerHTML = rpsHTML();
  }

  if(game==="memory"){
    area.innerHTML = memoryHTML();
    setupMemory();
  }

  if(game==="dice"){
    area.innerHTML = diceHTML();
  }

  if(game==="coin"){
    area.innerHTML = coinHTML();
  }

  if(game==="guess"){
    area.innerHTML = guessHTML();
    setupGuess();
  }

  if(game==="typing"){
    area.innerHTML = typingHTML();
    setupTyping();
  }

  if(game==="hangman"){
    area.innerHTML = hangmanHTML();
    setupHangman();
  }

  if(game==="reaction"){
    area.innerHTML = reactionHTML();
    setupReaction();
  }

  if(game==="math"){
    area.innerHTML = mathHTML();
    setupMath();
  }

  if(game==="color"){
    area.innerHTML = colorHTML();
    setupColorGame();
  }

  emy("Game loaded: " + game);
}

/* --- SIMPLE GAME IMPLEMENTATIONS (same as before but stable) --- */

/* Snake */
function snakeHTML(){
  return `
    <p style="opacity:0.8;">Use arrow keys.</p>
    <canvas id="snakeCanvas" width="400" height="400"
      style="margin-top:14px;border-radius:18px;background:black;width:100%;max-width:420px;"></canvas>
    <div id="snakeScore" style="margin-top:14px;font-weight:800;">Score: 0</div>
  `;
}

let snakeInterval = null;

function setupSnake(){
  const canvas = document.getElementById("snakeCanvas");
  const ctx = canvas.getContext("2d");

  let snake = [{x:200,y:200}];
  let food = {x:100,y:100};
  let dx = 20, dy = 0;
  let score = 0;

  document.onkeydown = (e)=>{
    if(e.key==="ArrowUp" && dy===0){dx=0;dy=-20;}
    if(e.key==="ArrowDown" && dy===0){dx=0;dy=20;}
    if(e.key==="ArrowLeft" && dx===0){dx=-20;dy=0;}
    if(e.key==="ArrowRight" && dx===0){dx=20;dy=0;}
  };

  clearInterval(snakeInterval);

  snakeInterval = setInterval(()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);

    const head = {x:snake[0].x+dx, y:snake[0].y+dy};

    if(head.x<0||head.y<0||head.x>=canvas.width||head.y>=canvas.height||
      snake.some(s=>s.x===head.x&&s.y===head.y)){
      clearInterval(snakeInterval);
      emy("Snake game over.");
      return;
    }

    snake.unshift(head);

    if(head.x===food.x && head.y===food.y){
      score++;
      document.getElementById("snakeScore").innerText = "Score: "+score;
      food.x = Math.floor(Math.random()*20)*20;
      food.y = Math.floor(Math.random()*20)*20;
    } else {
      snake.pop();
    }

    ctx.fillStyle="#00ffd5";
    snake.forEach(s=>ctx.fillRect(s.x,s.y,18,18));

    ctx.fillStyle="#ff4bd6";
    ctx.fillRect(food.x,food.y,18,18);

  },140);
}

/* TicTacToe */
function ticTacToeHTML(){
  return `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:280px;margin-top:10px;" id="tttBoard"></div>
    <div id="tttStatus" style="margin-top:14px;font-weight:800;">Player X turn</div>
    <button onclick="resetTicTacToe()">Reset</button>
  `;
}

let tttState = Array(9).fill("");
let tttPlayer = "X";

function setupTicTacToe(){ renderTTT(); }

function renderTTT(){
  const board = document.getElementById("tttBoard");
  const status = document.getElementById("tttStatus");
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

  const win=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(let p of win){
    const[a,b,c]=p;
    if(tttState[a] && tttState[a]===tttState[b] && tttState[b]===tttState[c]){
      document.getElementById("tttStatus").innerText="Winner: "+tttState[a];
      emy("Winner: "+tttState[a]);
      return;
    }
  }

  if(!tttState.includes("")){
    document.getElementById("tttStatus").innerText="Draw!";
    emy("Draw match.");
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

/* Rock Paper Scissors */
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

  document.getElementById("rpsResult").innerHTML=`You: <b>${user}</b> | CPU: <b>${cpu}</b><br>${result}`;
}

/* Memory */
function memoryHTML(){
  return `
    <p style="opacity:0.8;">Match all pairs.</p>
    <div id="memoryBoard" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:320px;margin-top:12px;"></div>
    <div id="memoryStatus" style="margin-top:14px;font-weight:800;">---</div>
    <button onclick="setupMemory()">Restart</button>
  `;
}

let memoryCards=[], memoryFlipped=[], memoryMatched=0;

function setupMemory(){
  const icons=["⚡","⚡","🎮","🎮","💎","💎","🌸","🌸","🐧","🐧","🔥","🔥","🌙","🌙","🎀","🎀"];
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

  if(memoryFlipped.length===2){
    const a=memoryFlipped[0];
    const b=memoryFlipped[1];

    if(memoryCards[a.i]===memoryCards[b.i]){
      memoryMatched+=2;
      memoryFlipped=[];
      document.getElementById("memoryStatus").innerText="Matched!";
      if(memoryMatched===memoryCards.length){
        document.getElementById("memoryStatus").innerText="You won!";
        emy("Memory game completed!");
      }
    } else {
      document.getElementById("memoryStatus").innerText="Try again...";
      setTimeout(()=>{
        a.btn.innerText="❓";
        b.btn.innerText="❓";
        memoryFlipped=[];
      },700);
    }
  }
}

/* Dice */
function diceHTML(){
  return `<button onclick="rollDice()">Roll Dice 🎲</button><h2 id="diceResult" style="margin-top:14px;">---</h2>`;
}
function rollDice(){
  document.getElementById("diceResult").innerText="You rolled: "+(Math.floor(Math.random()*6)+1);
}

/* Coin */
function coinHTML(){
  return `<button onclick="flipCoin()">Flip Coin 🪙</button><h2 id="coinResult" style="margin-top:14px;">---</h2>`;
}
function flipCoin(){
  document.getElementById("coinResult").innerText=Math.random()>0.5?"Heads":"Tails";
}

/* Guess */
let secretNum=0;
function guessHTML(){
  return `
    <p style="opacity:0.8;">Guess between 1 and 50</p>
    <input id="guessInput" placeholder="Type number..." />
    <button onclick="submitGuess()">Guess</button>
    <div id="guessResult" style="margin-top:14px;font-weight:800;">---</div>
  `;
}
function setupGuess(){ secretNum=Math.floor(Math.random()*50)+1; }
function submitGuess(){
  const val=parseInt(document.getElementById("guessInput").value);
  const box=document.getElementById("guessResult");
  if(!val){box.innerText="Enter a number.";return;}
  if(val===secretNum) box.innerText="Correct! 🎉";
  else if(val>secretNum) box.innerText="Too high!";
  else box.innerText="Too low!";
}

/* Typing */
let typingStart=0;
function typingHTML(){
  return `
    <p style="opacity:0.8;">Type this sentence exactly:</p>
    <h3 id="typingSentence">NeuraLib OS is a futuristic neon dashboard.</h3>
    <textarea id="typingBox" style="height:120px;"></textarea>
    <button onclick="checkTyping()">Finish</button>
    <div id="typingResult" style="margin-top:14px;font-weight:800;">---</div>
  `;
}
function setupTyping(){ typingStart=Date.now(); }
function checkTyping(){
  const target=document.getElementById("typingSentence").innerText;
  const typed=document.getElementById("typingBox").value.trim();
  const seconds=((Date.now()-typingStart)/1000).toFixed(1);
  document.getElementById("typingResult").innerText =
    (typed===target) ? ("Perfect! Time: "+seconds+" sec") : "Not exact. Try again.";
}

/* Hangman */
let hangWord="", hangHidden="";
function hangmanHTML(){
  return `
    <h2 id="hangDisplay">---</h2>
    <input id="hangInput" placeholder="Type a letter..." maxlength="1" />
    <button onclick="guessLetter()">Guess Letter</button>
    <div id="hangResult" style="margin-top:14px;font-weight:800;">---</div>
  `;
}
function setupHangman(){
  const words=["NEON","CYBER","PENGUIN","DASHBOARD","GAMING","NEURALIB"];
  hangWord=words[Math.floor(Math.random()*words.length)];
  hangHidden="_".repeat(hangWord.length);
  document.getElementById("hangDisplay").innerText=hangHidden;
}
function guessLetter(){
  const letter=document.getElementById("hangInput").value.toUpperCase();
  if(!letter) return;

  let newHidden="";
  for(let i=0;i<hangWord.length;i++){
    newHidden += (hangWord[i]===letter) ? letter : hangHidden[i];
  }
  hangHidden=newHidden;
  document.getElementById("hangDisplay").innerText=hangHidden;

  if(!hangHidden.includes("_")){
    document.getElementById("hangResult").innerText="You won!";
    emy("Hangman completed!");
  }
}

/* Reaction */
let reactionStart=0;
function reactionHTML(){
  return `
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
  if(btn.dataset.ready!=="true"){box.innerText="Too early!";return;}
  box.innerText="Reaction time: "+(Date.now()-reactionStart)+" ms";
}

/* Math */
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
  document.getElementById("mathResult").innerText = (val===mathAns) ? "Correct!" : "Wrong!";
}

/* Color */
let correctColor="";
function colorHTML(){
  return `
    <h2 id="colorWord">---</h2>
    <button onclick="chooseColor('cyan')">Cyan</button>
    <button onclick="chooseColor('pink')">Pink</button>
    <button onclick="chooseColor('purple')">Purple</button>
    <div id="colorResult" style="margin-top:14px;font-weight:800;">---</div>
  `;
}
function setupColorGame(){
  const colors=["cyan","pink","purple"];
  correctColor=colors[Math.floor(Math.random()*colors.length)];
  document.getElementById("colorWord").innerText=correctColor.toUpperCase();
}
function chooseColor(c){
  document.getElementById("colorResult").innerText = (c===correctColor) ? "Correct!" : "Wrong!";
  setupColorGame();
}

/* Credits */
function creditsHTML(){
  return `
    <div style="text-align:center;margin-top:60px;">
      <h1 style="font-weight:950;letter-spacing:2px;">Created by Saanvi</h1>
      <p style="opacity:0.7;margin-top:10px;">NeuraLib OS Neon v9</p>
    </div>
  `;
}

emy("Welcome to NeuraLib OS Neon. Tap an app.");
