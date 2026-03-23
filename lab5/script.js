const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("startBtn");

const colorBlock = document.getElementById("colorBlock");
const imageBlock = document.getElementById("imageBlock");
const colorInput = document.getElementById("pixelColor");

const timeSpan = document.getElementById("time");
const scoreSpan = document.getElementById("score");
const message = document.getElementById("message");
const gameArea = document.getElementById("gameArea");

const modeRadios = document.querySelectorAll('input[name="mode"]');

const settings = {
  easy: { clickTime: 3, size: 60 },
  medium: { clickTime: 2, size: 35 },
  hard: { clickTime: 1, size: 20 }
};

let score = 0;
let timeLeft = 0;
let timerId = null;
let pixel = null;
let gameActive = false;
let currentSize = 0;
let currentClickTime = 0;

function getSelectedMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

function getSelectedImage() {
  const selected = document.querySelector('input[name="pixelImage"]:checked');
  return selected ? selected.value : "";
}

function updateModeBlocks() {
  const mode = getSelectedMode();

  if (mode === "color") {
    colorBlock.classList.remove("hidden");
    imageBlock.classList.add("hidden");
  } else {
    colorBlock.classList.add("hidden");
    imageBlock.classList.remove("hidden");
  }
}

function setMessage(text) {
  message.textContent = text;
}

function resetGame() {
  clearInterval(timerId);
  timerId = null;
  gameActive = false;

  if (pixel) {
    pixel.remove();
    pixel = null;
  }
}

function createPixel(size) {
  pixel = document.createElement("div");
  pixel.className = "pixel";
  pixel.style.width = size + "px";
  pixel.style.height = size + "px";

  const mode = getSelectedMode();

  if (mode === "color") {
    pixel.style.backgroundColor = colorInput.value;
    pixel.style.backgroundImage = "none";
  } else {
    const selectedImage = getSelectedImage();

    if (!selectedImage) {
      setMessage("Оберіть картинку.");
      return false;
    }

    pixel.style.backgroundImage = `url(${selectedImage})`;
    pixel.style.backgroundColor = "#ddd";
  }

  pixel.addEventListener("click", function () {
    if (!gameActive) return;

    score++;
    scoreSpan.textContent = score;

    movePixel();
    restartSmallTimer();
  });

  gameArea.appendChild(pixel);
  return true;
}

function movePixel() {
  if (!pixel) return;

  const areaWidth = gameArea.clientWidth;
  const areaHeight = gameArea.clientHeight;
  const pixelWidth = pixel.offsetWidth;
  const pixelHeight = pixel.offsetHeight;

  const maxX = areaWidth - pixelWidth;
  const maxY = areaHeight - pixelHeight;

  if (maxX < 0 || maxY < 0) return;

  const x = Math.floor(Math.random() * (maxX + 1));
  const y = Math.floor(Math.random() * (maxY + 1));

  pixel.style.left = x + "px";
  pixel.style.top = y + "px";
}

function endGame() {
  gameActive = false;
  clearInterval(timerId);
  timerId = null;

  if (pixel) {
    pixel.remove();
    pixel = null;
  }

  setMessage(`Час вийшов. Гру завершено. Ваш результат: ${score}`);
}

function restartSmallTimer() {
  clearInterval(timerId);

  timeLeft = currentClickTime;
  timeSpan.textContent = timeLeft;

  timerId = setInterval(function () {
    timeLeft--;
    timeSpan.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function startGame() {
  resetGame();

  const difficulty = difficultySelect.value;
  const level = settings[difficulty];

  currentClickTime = level.clickTime;
  currentSize = level.size;

  score = 0;
  scoreSpan.textContent = score;
  timeSpan.textContent = currentClickTime;

  const created = createPixel(currentSize);
  if (!created) return;

  gameActive = true;
  setMessage("Гра розпочалась. Натискай на піксель до завершення таймера.");

  movePixel();
  restartSmallTimer();
}

modeRadios.forEach(function (radio) {
  radio.addEventListener("change", updateModeBlocks);
});

startBtn.addEventListener("click", startGame);

updateModeBlocks();
