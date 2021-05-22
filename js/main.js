'use strict';

// Level Sizes Board

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';
//
var gStartTimer;
var gTimerIntervalId;
var gFirstCellClicked = true;
var gLives = 4;
// Status of the game
var gGame = {
  score: 0,
  isOn: false,
  minesCount: 0,
  shownCount: 0,
  markedCount: 0,
  isWin: false,
};

var gLevel = {
  SIZE: 4,
  MINES: 2,
};

var gBoard;

function init() {
  gBoard = buildBoard();
  gLives = 3;
  gFirstCellClicked = true;
  randomNumbers(gBoard, gLevel.SIZE);
  setMinesCountPrimary(gBoard);
  renderBoard(gBoard);
  closeModal();
  var elSmiley = document.querySelector('.smiley');
  elSmiley.innerHTML = '😎';
  gGame.isOn = true;

  initTimer();
}

function buildBoard() {
  // Create the Matrix
  gBoard = createMat(gLevel.SIZE, gLevel.SIZE);

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };

      // Add created cell to The game board
      gBoard[i][j] = cell;
    }
  }

  console.table(gBoard);
  return gBoard;
}

function renderBoard(gBoard) {
  var strHTML = '<table border="1" ><tbody class="board">\n';
  var className;
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += '<tr>\n';
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      var flag = cell.isMarked ? FLAG : '';
      var symbol = cell.isMine ? MINE : cell.minesAroundCount;
      if (!cell.isShown) {
        className = 'cell cell' + i + '-' + j + ' unchecked';
        strHTML += `<td  oncontextmenu="cellMarked(${i},${j},this,event)" onclick="cellClicked(this,${i},${j})" class="${className}">${flag} </td>\n`;
      } else {
        className = 'cell cell' + i + '-' + j + ' checked';
        strHTML += `<td onclick="cellClicked(this,${i},${j})" class="${className}">${symbol}</td>\n`;
      }
    }
    strHTML += '</tr>\n';
  }
  strHTML += '</tbody></table>';

  var elContainer = document.querySelector('.board-container');
  elContainer.innerHTML = strHTML;
}

function cellClicked(elCell, i, j, e) {
  var cell = gBoard[i][j];
  var elLives = document.querySelector('h4');
  elLives.innerText = `Life left : ${gLives}`;
  startTimer();
  if (cell.isMine && gFirstCellClicked) {
    alert('mine');
    return;
  }
  gFirstCellClicked = false;
  if (cell.isMarked || !gGame.isOn) return;
  var elContainer = document.querySelector('.board-container');

  if (cell.isMine && !gLives) {
    markMines(elCell);
    console.log('You Lost! Game Over');

    gameOver();
    clearInterval(gTimerIntervalId);
    gGame.isOn = false;
    renderBoard(gBoard);
    return;
  }
  if (cell.isMine) {
    gLives--;
  }

  if (!cell.isShown) {
    cell.isShown = true;
    gGame.shownCount++;
  }

  if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) {
    blowUpNegs(i, j, gBoard);
  }

  checkVictory(gBoard);
  renderBoard(gBoard);
}

function setMinesCountPrimary(gBoard) {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      setMinesNegsCount(gBoard, i, j);
    }
  }
}

function setMinesNegsCount(gBoard, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      var currCell = gBoard[i][j];
      if (currCell.isMine) {
        gBoard[cellI][cellJ].minesAroundCount++;
      }
    }
  }
}

function randomNumbers(gBoard, size) {
  for (var i = 0; i < gLevel.MINES; i++) {
    var Iidx = getRandomInt(0, size - 1);
    var jidx = getRandomInt(0, size - 1);
    console.log(gBoard[Iidx][jidx]);
    gBoard[Iidx][jidx].isMine = gBoard[Iidx][jidx].isMine ? i-- : true;
  }
}

function difficulty(elBtn) {
  if (elBtn.innerText === 'Easy') {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
  } else if (elBtn.innerText === 'Medium') {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
  } else if (elBtn.innerText === 'Hard') {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
  }
  clearInterval(gTimerIntervalId);
  gTimerIntervalId = null;
  init();
}

function blowUpNegs(cellI, cellJ, board) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= board[i].length) continue;
      var currNeighbour = board[i][j];
      if (currNeighbour.symbol === MINE || currNeighbour.isMarked) continue;
      // if (currNeighbour.isMarked) continue;

      if (!currNeighbour.isShown && !currNeighbour.isMine) {
        currNeighbour.isShown = true;
      }
    }
  }
}

function gameOver() {
  var elHeading = document.querySelector('.modal-heading');
  var elSmiley = document.querySelector('.smiley');
  elSmiley.innerHTML = '😥';
  elHeading.style.display = 'block';
  elHeading.innerText = 'You Lost :(';
  clearInterval(gTimerIntervalId);
  gGame.isOn = false;
}

function cellMarked(cellI, cellJ, elCell, event) {
  startTimer();
  event.preventDefault();
  var cell = gBoard[cellI][cellJ];
  if (cell.isShown) return true;

  console.log(cell);
  cell.isMarked = cell.isMarked ? false : true;
  if (cell.isMarked) {
    elCell.innerText = '';
    gGame.markedCount++;
  } else {
    gGame.markedCount--;
  }
  renderBoard(gBoard);
  checkVictory(gBoard);
}

function restart(elBtn) {
  clearInterval(gTimerIntervalId);
  gTimerIntervalId = null;
  init();
}

function closeModal() {
  var elHeading = document.querySelector('.modal-heading');
  elHeading.style.display = 'none';
}

function checkVictory(gBoard) {
  var victoryCounter = 0;

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      if (cell.isMarked && cell.isMine) {
        victoryCounter++;
      }
    }
  }

  if (victoryCounter === gLevel.MINES) {
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerHTML = '🤩';
    var elHeading = document.querySelector('.modal-heading');
    elHeading.innerText = 'You wooon!!!';
    elHeading.style.display = 'block';

    clearInterval(gTimerIntervalId);
    gGame.isOn = false;
  }
}

function markMines(elCell) {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var currCell = gBoard[i][j];
      if (currCell.isMine) {
        currCell.isShown = true;
        elCell.classList.remove('unchecked');
      }
    }
  }
}
