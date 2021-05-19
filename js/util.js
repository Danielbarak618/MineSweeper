function createMat(SIZE) {
  var mat = [];
  for (var i = 0; i < SIZE; i++) {
    var row = [];
    for (var j = 0; j < SIZE; j++) {
      row.push('');
    }
    mat.push(row);
  }
  return mat;
}

function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

function getNearCellsLocation(board, cellI, cellJ) {
  var coords = [];

  for (let i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;

    for (let j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === cellI && j === cellJ) continue;

      coords.push({ i, j });
    }
  }

  return coords;
}

function getClassLocation(cellClass) {
  var splitting = cellClass.split('-');
  var location = {
    i: splitting[1],
    j: splitting[2],
  };

  return location;
}

function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function shuffle(array) {
  var j, x, i;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
  return array;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
