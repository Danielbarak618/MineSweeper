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

function renderCell(i, j, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function initTimer() {
  var elTimer = document.getElementById('timer');
  elTimer.innerText = '00 : 00';
}

function startTimer() {
  if (!gTimerIntervalId) {
    gStartTimer = getTime();
    gTimerIntervalId = setInterval(renderTimer, 10);
  }
}

function getTime() {
  return Date.now();
}

function renderTimer() {
  var delta = getTime() - gStartTimer;
  var time = timeFormatter(delta);
  var elTimer = document.getElementById('timer');
  elTimer.innerText = time;
}

function timeFormatter(timeInMilliseconds) {
  var time = new Date(timeInMilliseconds);
  var minutes = time.getMinutes().toString();
  var seconds = time.getSeconds().toString();
  var milliseconds = time.getMilliseconds().toString();

  if (minutes.length < 2) {
    minutes = '0' + minutes;
  }

  if (seconds.length < 2) {
    seconds = '0' + seconds;
  }

  while (milliseconds.length < 3) {
    milliseconds = '0' + milliseconds;
  }

  return minutes + ' : ' + seconds;
}
