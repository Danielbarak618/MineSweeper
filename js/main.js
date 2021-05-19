'use strict';

// Level Sizes Board
const BEGINNER = 4;
const MEDIUM = 8;
const EXPERT = 12;
const MINE = '💣';
const FLAG = '🚩';
//
const CLOSED = '';
const OPEN = 'OPEN';

// Status of the game
var gGame = {
  score: 0,
  isOn: false,
  markedCount: 0,
};

var gLevel = {
  SIZE: BEGINNER,
  MINES: 2,
};

var epmtyCells;
var gBoard;

function init() {
  console.log('hello');
  gBoard = buildBoard();
  randomNumbers(gBoard, gLevel.SIZE);
  setMinesCountPrimary(gBoard);
  renderBoard(gBoard);
  gGame.isOn = true;
}

function buildBoard() {
  // Create the Matrix
  gBoard = createMat(BEGINNER, BEGINNER);

  // Put FLOOR everywhere and WALL at edges
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      // Put FLOOR in a regular cell
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

  // Place the Balls (currently randomly chosen positions)
  // board[3][8].gameElement = BALL;
  // board[7][4].gameElement = BALL;

  console.table(gBoard);
  return gBoard;
}

function renderBoard(gBoard) {
  var strHTML = '<table border="1" cellpadding="10"><tbody class="board">\n';
  var className;
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += '<tr>\n';
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];

      var symbol = cell.isMine ? MINE : cell.minesAroundCount;
      if (!cell.isShown) {
        className = 'cell cell' + i + '-' + j + ' unchecked';
        strHTML += `<td onclick="cellClicked(this,${i},${j})" class="${className}"> </td>\n`;
      } else {
        className = 'cell cell' + i + '-' + j + ' unchecked';
        strHTML += `<td onclick="cellClicked(this,${i},${j})" class="${className}">${symbol}</td>\n`;
      }
    }
    strHTML += '</tr>\n';
  }
  strHTML += '</tbody></table>';
  // console.log(strHTML);
  var elContainer = document.querySelector('.board-container');
  elContainer.innerHTML = strHTML;
}

function cellClicked(elCell, i, j) {
  var elContainer = document.querySelector('.board-container');
  gBoard[i][j].isShown = true;
  renderBoard(gBoard, elContainer);
}

function setMinesCountPrimary(gBoard) {
  console.log(gBoard.length);
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
  console.log(gBoard[0][0]);
}

function randomNumbers(gBoard, size) {
  for (var i = 0; i < gLevel.MINES; i++) {
    var Iidx = getRandomInt(0, size - 1);
    var jidx = getRandomInt(0, size - 1);
    console.log(gBoard[Iidx][jidx]);
    gBoard[Iidx][jidx].isMine = true;
  }
}

function cellMarked(elEvent, cellI, cellJ) {
  window.oncontextmenu = (e) => {
    e.preventDefault();
  };
  var cell = gBoard[cellI][cellJ];
  cell.isMarked = cell.isMarked ? false : true;
  if (cell.isMarked) {
    gGame.markedCount++;
  } else {
    gGame.markedCount--;
  }
  renderBoard(gBoard);
}

// function expendShown(gBoard, elCell, i, j) {
//   // function showCellsAround(board, elCell, i, j) {
//   var cellsAround = getNearCellsLocation(gBoard, cellI, cellJ);

//   var hidden = getNoneMinesLocation(cellsAround, board);
//   if (!hidden.length) return;
//   for (var i = 0; i < hidden.length; i++) {
//     var currCell = hidden[i];
//     board[currCell.i][currCell.j].isShown = true;
//     renderCell(currCell, board[currCell.i][currCell.j].minesAroundCount);
//   }
// }

function getNoneMinesLocation(locArr, board) {
  var res = [];
  for (var i = 0; i < locArr.length; i++) {
    var currLocation = locArr[i];
    var currCell = board[currLocation.i][currLocation.j];
    if (!currCell.isShown && !currCell.isMine) {
      res.push(currLocation);
    }
  }

  return res;
}

// function cellsCountUpdate() {
//   for (var i = 0; i < gBoard.length; i++) {
//     for (var j = 0; j < gBoard[0].length; j++) {
//       var currCellCount = setMinesNegsCount(gBoard, { i, j });
//       gBoard[i][j].minesAroundCount = currCellCount;
//     }
//   }
// }

// function cellMark(elCell) {
//   elCell.classList.add('mark');
// }

// function minesExplsion(board, elCell, i, j) {
//   board[i][j].isShown = true;
//   elCell.innerHTML = MINE;
// }

// function countMinesAround(board, location) {
//   var count = 0;
//   for (var i = location.i - 1; i <= location.i + 1; i++) {
//     if (i === 0 || i >= board.length) continue;
//     for (var j = location.j - 1; j <= location.j + 1; j++) {
//       if (j < 0 || j >= board[i].length) continue;
//       if (i === location.i && j === location.j) continue;
//       var currCell = board[i][j];
//       if (currCell.isMine) {
//         count++;
//       }
//     }
//   }
//   return count;
// }
