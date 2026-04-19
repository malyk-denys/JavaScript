const boardElement = document.getElementById('board');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const goalElement = document.getElementById('goal');
const puzzleIdElement = document.getElementById('puzzle-id');
const statusMessageElement = document.getElementById('status-message');
const newGameButton = document.getElementById('new-game-btn');

const GRID_SIZE = 5;

let puzzles = [];
let currentPuzzleIndex = -1;
let board = [];
let moves = 0;
let timerSeconds = 0;
let timerInterval = null;
let isGameActive = false;

function cloneGrid(grid) {
  return grid.map(row => [...row]);
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    timerSeconds += 1;
    timerElement.textContent = formatTime(timerSeconds);
  }, 1000);
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateStatus(message, isSuccess = false) {
  statusMessageElement.textContent = message;
  statusMessageElement.classList.toggle('status-success', isSuccess);
}

function toggleCell(row, col) {
  if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
    return;
  }

  board[row][col] = board[row][col] === 1 ? 0 : 1;
}

function renderBoard() {
  boardElement.innerHTML = '';

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `cell ${cell === 1 ? 'cell--on' : ''}`;
      button.setAttribute('role', 'gridcell');
      button.setAttribute(
        'aria-label',
        `Рядок ${rowIndex + 1}, стовпець ${colIndex + 1}, стан: ${cell === 1 ? 'увімкнено' : 'вимкнено'}`
      );
      button.addEventListener('click', () => handleCellClick(rowIndex, colIndex));
      boardElement.appendChild(button);
    });
  });
}

function isWin() {
  return board.every(row => row.every(cell => cell === 0));
}

function handleCellClick(row, col) {
  if (!isGameActive) {
    return;
  }

  toggleCell(row, col);
  toggleCell(row - 1, col);
  toggleCell(row + 1, col);
  toggleCell(row, col - 1);
  toggleCell(row, col + 1);

  moves += 1;
  movesElement.textContent = moves;
  renderBoard();

  if (isWin()) {
    isGameActive = false;
    stopTimer();

    const goal = puzzles[currentPuzzleIndex].goal;
    const difference = moves - goal;
    const performanceText = difference === 0
      ? 'Ви досягли мінімальної кількості ходів.'
      : difference < 0
        ? `Ви завершили гру навіть краще за ціль: на ${Math.abs(difference)} хід(и) менше.`
        : `До цілі не вистачило ${difference} хід(и).`;

    updateStatus(
      `Перемога! Час: ${formatTime(timerSeconds)}. Ходів: ${moves}. ${performanceText}`,
      true
    );
  } else {
    updateStatus('Гра триває. Потрібно вимкнути всі клітинки.');
  }
}

function getNextPuzzleIndex() {
  if (puzzles.length === 1) {
    return 0;
  }

  let nextIndex = Math.floor(Math.random() * puzzles.length);
  while (nextIndex === currentPuzzleIndex) {
    nextIndex = Math.floor(Math.random() * puzzles.length);
  }
  return nextIndex;
}

function resetGameState() {
  moves = 0;
  timerSeconds = 0;
  movesElement.textContent = '0';
  timerElement.textContent = '00:00';
  stopTimer();
}

function startNewGame() {
  if (!puzzles.length) {
    updateStatus('Неможливо запустити гру: дані не завантажені.');
    return;
  }

  resetGameState();
  currentPuzzleIndex = getNextPuzzleIndex();

  const puzzle = puzzles[currentPuzzleIndex];
  board = cloneGrid(puzzle.grid);
  goalElement.textContent = String(puzzle.goal);
  puzzleIdElement.textContent = puzzle.id.toUpperCase();

  renderBoard();
  isGameActive = true;
  startTimer();
  updateStatus('Нова гра розпочата. Спробуйте досягти цілі за мінімальну кількість ходів.');
}

async function loadPuzzles() {
  try {
    const response = await fetch('./puzzles.json', { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.puzzles || !Array.isArray(data.puzzles) || data.puzzles.length === 0) {
      throw new Error('Некоректний формат puzzles.json');
    }

    puzzles = data.puzzles;
    startNewGame();
  } catch (error) {
    console.error('Помилка завантаження JSON:', error);
    updateStatus('Не вдалося завантажити ігрові дані з JSON-файлу. Перевірте структуру /puzzles.json.');
    newGameButton.disabled = true;
  }
}

newGameButton.addEventListener('click', startNewGame);
document.addEventListener('DOMContentLoaded', loadPuzzles);
