// ===== ELEMENTS =====
const coverPage = document.getElementById('cover-page');
const countdownEl = document.getElementById('countdown');
const gameScreen = document.getElementById('game');
const board = document.getElementById('board');

const hiScoreEl = document.getElementById('hi-score');
const currentScoreEl = document.getElementById('current-score');
const timerEl = document.getElementById('timer');
const pointBar = document.getElementById('point-bar');

const finalMsg = document.getElementById('final-msg');
const endMessage = document.getElementById('end-message');

// ===== GAME STATE =====
let tiles = [];
let blackTiles = [];

let score = 0;
let hiScore = Number(localStorage.getItem('hiScore')) || 0;
let gameTime = 10;
let pointValue = 10;

let pointInterval = null;
let timerInterval = null;

hiScoreEl.textContent = hiScore;

// start game on first click
coverPage.addEventListener('click', startCountdown, { once: true });


// ===== COUNTDOWN =====
function startCountdown() {
  coverPage.classList.add('hidden');
  countdownEl.classList.remove('hidden');

  let count = 3;
  countdownEl.textContent = count;
  countdownEl.style.fontSize = '120px';
  countdownEl.style.color = 'rgba(183, 154, 235, 1)';

  const countdownTimer = setInterval(() => {
    count--;

    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      clearInterval(countdownTimer);
      countdownEl.classList.add('hidden');
      startGame();
    }
  }, 1000); // period of 1 second
}


// ===== GAME START =====
function startGame() {
  score = 0;
  gameTime = 10;

  currentScoreEl.textContent = score;
  timerEl.textContent = gameTime;

  gameScreen.classList.remove('hidden');

  createBoard();
  spawnBlackTiles(3);
  startTimer();
  resetPointBar();
}




// ===== BOARD =====
function createBoard() {
  board.innerHTML = '';
  tiles = [];
  blackTiles = [];

  for (let i = 0; i < 16; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.index = i;

    tile.addEventListener('click', tileClicked);

    board.appendChild(tile);
    tiles.push(tile);
  }
}


function spawnBlackTiles(amount) {
  while (blackTiles.length < amount) {
    const index = Math.floor(Math.random() * tiles.length);
    const tile = tiles[index];

    if (!tile.classList.contains('black')) {
      tile.classList.add('black');
      blackTiles.push(index);
    }
  }
}


// ===== TILE CLICK =====
function tileClicked(e) {
  const tile = e.target;
  if (!tile.classList.contains('black')) return;

  score += pointValue;
  currentScoreEl.textContent = score;

  showPoint(tile, pointValue);

  tile.classList.remove('black');
  tile.classList.add('green');
  setTimeout(() => tile.classList.remove('green'), 500);

  const index = Number(tile.dataset.index);
  blackTiles = blackTiles.filter(i => i !== index);

  addNewBlackTile();
  resetPointBar();
}


function addNewBlackTile() {
  const freeTiles = tiles
    .map((_, i) => i)
    .filter(i => !blackTiles.includes(i));

  const index = freeTiles[Math.floor(Math.random() * freeTiles.length)];
  const tile = tiles[index];

  tile.style.opacity = 0;
  tile.classList.add('black');
  blackTiles.push(index);

  let opacity = 0;
  const fade = setInterval(() => {
    opacity += 0.1;
    tile.style.opacity = opacity;
    if (opacity >= 1) clearInterval(fade);
  }, 50);
}


// ===== UI EFFECTS =====
function showPoint(tile, value) {
  const el = document.createElement('div');
  el.className = 'point-text';
  el.textContent = `+${value}`;

  tile.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}


// ===== POINT BAR =====
function resetPointBar() {
  clearInterval(pointInterval);

  pointValue = 10;
  pointBar.style.width = '100%';

  pointInterval = setInterval(() => {
    pointValue--;
    pointBar.style.width = pointValue * 10 + '%';

    if (pointValue <= 0) {
      clearInterval(pointInterval);
    }
  }, 100);
}


// ===== TIMER =====
function startTimer() {
  timerEl.textContent = gameTime;

  timerInterval = setInterval(() => {
    gameTime--;
    timerEl.textContent = gameTime;

    if (gameTime <= 0) {
      endGame();
    }
  }, 1000);
}


// ===== GAME END =====
function endGame() {
  clearInterval(timerInterval);
  clearInterval(pointInterval);

  tiles.forEach(t => t.removeEventListener('click', tileClicked));

  let isNewHighScore = false;

  if (score > hiScore) {
    hiScore = score;
    localStorage.setItem('hiScore', hiScore);
    hiScoreEl.textContent = hiScore;
    isNewHighScore = true;
  }

  endMessage.classList.remove('hidden');

  if (isNewHighScore) {
    finalMsg.textContent = 'New HiScore!';
    confettiEffect();
  } else {
    finalMsg.textContent = 'Time is up!';
  }
}


// ===== CONFETTI =====
function confettiEffect() {
  confetti({
    particleCount: 200,
    spread: 180,
    startVelocity: 45,
    origin: { y: 0.6 }
  });
}
