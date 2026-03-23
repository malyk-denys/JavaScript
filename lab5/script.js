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
  easy: {
    clickTime: 3,
    size: 60
  },
  medium: {
    clickTime: 2,
    size: 35
  },
  hard: {
    clickTime: 1,
    size: 20
  }
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
  return selected ? selected.value : null;
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

function resetGameArea() {
  gameArea.innerHTML = "";
  pixel = null;
}

function resetGameState() {
  clearInterval(timerId);
  timerId = null;
  gameActive = false;
  resetGameArea();
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
    const selectedImage = getSelectedImage();

    if (!selectedImage) {
      setMessage("Оберіть картинку.");
      return false;
    }

    pixel.style.backgroundImage = `url("${selectedImage}")`;
    pixel.style.backgroundSize = "cover";
    pixel.style.backgroundPosition = "center";
    pixel.style.backgroundRepeat = "no-repeat";
    pixel.style.backgroundColor = "#ddd";
  }

  pixel.addEventListener("click", function () {
    if (!gameActive) return;

    score++;
    scoreSpan.textContent = score;

    movePixel(currentSize);
    restartSmallTimer();
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

function validateSelectedImage(imagePath, onSuccess) {
  const testImage = new Image();

  testImage.onload = function () {
    onSuccess();
  };

  testImage.onerror = function () {
    setMessage("Не вдалося завантажити картинку. Перевір папку images і назву файлу.");
  };

  testImage.src = imagePath;
}

function startGame() {
  resetGameState();

  const difficulty = difficultySelect.value;
  const level = settings[difficulty];

  currentClickTime = level.clickTime;
  currentSize = level.size;

  score = 0;
  scoreSpan.textContent = score;
  timeSpan.textContent = currentClickTime;

  const mode = getSelectedMode();

  if (mode === "image") {
    const selectedImage = getSelectedImage();

    if (!selectedImage) {
      setMessage("Оберіть картинку перед стартом.");
      return;
    }

    validateSelectedImage(selectedImage, function () {
      const created = createPixel(currentSize);
      if (!created) return;

      movePixel(currentSize);
      gameActive = true;
      setMessage("Гра розпочалась. Натискай на піксель до завершення таймера.");
      restartSmallTimer();
    });

    return;
  }

  const created = createPixel(currentSize);
  if (!created) return;

  movePixel(currentSize);
  gameActive = true;
  setMessage("Гра розпочалась. Натискай на піксель до завершення таймера.");
  restartSmallTimer();
}

modeRadios.forEach(function (radio) {
  radio.addEventListener("change", updateModeBlocks);
});

startBtn.addEventListener("click", startGame);

updateModeBlocks();
