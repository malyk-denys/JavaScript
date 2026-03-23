const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("startBtn");

const colorBlock = document.getElementById("colorBlock");
const imageBlock = document.getElementById("imageBlock");

const colorInput = document.getElementById("pixelColor");
const imageInput = document.getElementById("pixelImage");

const timeSpan = document.getElementById("time");
const scoreSpan = document.getElementById("score");
const message = document.getElementById("message");
const gameArea = document.getElementById("gameArea");

const modeRadios = document.querySelectorAll('input[name="mode"]');

const settings = {
  easy: {
    time: 30,
    size: 60
  },
  medium: {
    time: 20,
    size: 35
  },
  hard: {
    time: 10,
    size: 20
  }
};

let score = 0;
let timeLeft = 0;
let timerId = null;
let pixel = null;
let gameActive = false;
let currentImageURL = null;

function getSelectedMode() {
  return document.querySelector('input[name="mode"]:checked').value;
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

function clearOldImageURL() {
  if (currentImageURL) {
    URL.revokeObjectURL(currentImageURL);
    currentImageURL = null;
  }
}

function resetGameArea() {
  gameArea.innerHTML = "";
  pixel = null;
}

function resetGameState() {
  clearInterval(timerId);
  timerId = null;
  gameActive = false;
  resetGameArea();
  clearOldImageURL();
}

function setMessage(text) {
  message.textContent = text;
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
    const file = imageInput.files[0];

    if (!file) {
      setMessage("Для режиму картинки потрібно вибрати файл.");
      return false;
    }

    clearOldImageURL();
    currentImageURL = URL.createObjectURL(file);

    pixel.style.backgroundImage = `url("${currentImageURL}")`;
    pixel.style.backgroundSize = "cover";
    pixel.style.backgroundPosition = "center";
    pixel.style.backgroundRepeat = "no-repeat";
    pixel.style.backgroundColor = "transparent";
  }

  pixel.addEventListener("click", function () {
    if (!gameActive) return;

    score++;
    scoreSpan.textContent = score;

    movePixel(size);
  });

  gameArea.appendChild(pixel);
  return true;
}

function movePixel(size) {
  if (!pixel) return;

  const maxX = gameArea.clientWidth - size;
  const maxY = gameArea.clientHeight - size;

  const randomX = Math.floor(Math.random() * (maxX + 1));
  const randomY = Math.floor(Math.random() * (maxY + 1));

  pixel.style.left = randomX + "px";
  pixel.style.top = randomY + "px";
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

function startTimer() {
  timerId = setInterval(function () {
    timeLeft--;
    timeSpan.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function startGame() {
  resetGameState();

  const difficulty = difficultySelect.value;
  const level = settings[difficulty];

  score = 0;
  timeLeft = level.time;

  scoreSpan.textContent = score;
  timeSpan.textContent = timeLeft;

  const created = createPixel(level.size);
  if (!created) {
    timeSpan.textContent = 0;
    return;
  }

  movePixel(level.size);

  gameActive = true;
  setMessage("Гра розпочалась. Натискайте на піксель.");

  startTimer();
}

modeRadios.forEach(function (radio) {
  radio.addEventListener("change", updateModeBlocks);
});

startBtn.addEventListener("click", startGame);

updateModeBlocks();
