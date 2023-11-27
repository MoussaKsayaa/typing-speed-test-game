let levelsObj = {
  Easy: ["Array", "Enum", "Bytes", "Class", "Queue", "Tuple", "String", "Float", "While", "Function", "Index", "Char", "Loop", "Object", "Boolean", "Double", "Value", "Key", "Data", "Variable", "Value", "Key", "Data", "Variable"],
  Normal: ["Method", "Pointer", "Exception", "Interface", "Framework", "Function", "Declaration", "Expression", "Arithmetic", "Assignment", "Increment", "Decrement", "Condition", "Struct", "Pointer", "Constructor", "Destructor", "Instantiation", "Inheritance", "Polymorphism", "Debugger", "Breakpoint"],
  Hard: ["Feature", "Control", "Plugin", "Pointer", "Asynchronous", "Synchronization", "Callback", "Promises", "Lambda", "Recursion", "Prototype", "Metaclass", "Decorator", "Dependency", "Injection", "Middleware", "Model", "Controller", "View", "Router", "Serializer", "Deserializer", "Endpoint"]
};
let LS = window.localStorage;
let randomWord = '';
let theLevel = '';
let score = 0;
let wordsFinishedList = [];
let startGame = document.querySelector('.start-game');
let mainContainer = document.querySelector('.main .container');
let levelElement = document.querySelectorAll('.choosing-level .levels .level');
let levelChoosen = document.querySelector('.your-level .level');
let levelTime = document.querySelector('.your-level .time');
let spcTime = 0;
let choosingLevelElement = document.querySelector('.choosing-level');
let results = document.querySelector('.results');
let emptyLevel = document.createElement('div');
emptyLevel.className = 'empty-level';
emptyLevel.innerHTML = 'Choose The Level First!';

let clearStorage = document.querySelector('.clear-btn');
clearStorage.onclick = () => {
  LS.clear();
  window.location.reload();
}

window.onload = showDetails;

function showDetails() {
  let resultsData = document.querySelector('.results .data');
  if (LS.length > 0) {
    results.style.display = 'block';
    for (let i = 0; i < LS.length; i++) {
      let data = JSON.parse(`{${LS.getItem(`match-${i+1}`)}}`);
      console.log(data);
      let scoreE = document.createElement('div');
      scoreE.className = 'score';
      for (let i of Object.keys(data)) {
        let span = document.createElement('span');
        span.innerHTML = data[i];
        scoreE.appendChild(span);
      }
      resultsData.appendChild(scoreE);
    }
  }
}

levelElement.forEach((lev) => {
  lev.onclick = () => {
    theLevel = lev.firstElementChild.id;
    theLevel === 'Easy'? spcTime = 7 : theLevel === 'Normal'? spcTime = 5 : theLevel === 'Hard'? spcTime = 3 : '';
    levelChoosen.innerHTML = `[ ${theLevel} ]`;
    levelTime.innerHTML = `[ ${spcTime} ]`;
    return [theLevel, spcTime];
  }
});

startGame.onclick = startTheGame;

function startTheGame() {
  if (theLevel !== '') {
    choosingLevelElement.remove();
    startGame.remove();
    results.style.display = 'none';
    chooseRandomWord();
    theHtmlContent()
  } else {
    document.body.appendChild(emptyLevel);
    setTimeout(() => emptyLevel.remove(), 1500);
  }
}

function theHtmlContent() {
  let levelWords = levelsObj[theLevel];
  let currentWordElement = document.createElement('div');
  currentWordElement.className = 'current-word';
  currentWordElement.innerHTML = randomWord;
  mainContainer.appendChild(currentWordElement);
  let inputFiledElement = document.createElement('input');
  inputFiledElement.type = 'text';
  inputFiledElement.className = 'input-field';
  mainContainer.appendChild(inputFiledElement);
  let wordsListElement = document.createElement('div');
  wordsListElement.className = 'words-list';
  levelWords.forEach((word) => {
    if (word !== randomWord) {
      let wordElement = document.createElement('span');
      wordElement.className = 'word';
      wordElement.innerHTML = word;
      wordsListElement.appendChild(wordElement);
    }
  })
  mainContainer.appendChild(wordsListElement);
  timerAndScore();
}

function chooseRandomWord() {
  let randomNum = Math.floor(Math.random() * levelsObj[theLevel].length);
  if (wordsFinishedList.includes(randomNum)) {
    chooseRandomWord();
  } else {
    wordsFinishedList.push(randomNum);
    randomWord = levelsObj[theLevel][randomNum];
    return randomWord;
  }
}

function timerAndScore() {
  let rulesElement = document.createElement('div');
  rulesElement.className = 'rulesElement';
  rulesElement.innerHTML = "<div>Time Left : <span class='timer'></span> Seconds </div> <div>Score: <span class='score'></span></div>"
  mainContainer.appendChild(rulesElement);
  let timerElement = document.querySelector('.rulesElement .timer');
  let scoreElement = document.querySelector('.rulesElement .score');
  theLevel === 'Easy'? spcTime = 10 : theLevel === 'Normal'? spcTime = 8 : theLevel === 'Hard'? spcTime = 6 : '';
  timerElement.innerHTML = spcTime;
  countDown(timerElement);
  scoreElement.innerHTML = score;
}

function countDown(timerElement) {
  timerElement.innerHTML = spcTime;
  let inputElement = document.querySelector('.input-field');
  inputElement.focus();
  let scoreElement = document.querySelector('.rulesElement .score');
  let countDownVal = setInterval(() => {
    if (spcTime > 0) {
      spcTime--;
      timerElement.innerHTML = spcTime;
    } 
    if (spcTime === 0) {
      clearInterval(countDownVal);
      if (inputElement.value.trim() === randomWord.toLowerCase()) {
        score++;
        scoreElement.innerHTML = score;
        score === levelsObj[theLevel].length ? endTheGame() : chooseRandomWord();
        inputElement.value = '';
        document.querySelectorAll('.words-list .word').forEach((word) => {
          word.textContent === randomWord ? word.remove() : '';
        })
        document.querySelector('.current-word').innerHTML = randomWord;
        theLevel === 'Easy'? spcTime = 7 : theLevel === 'Normal'? spcTime = 5 : theLevel === 'Hard'? spcTime = 3 : '';
        countDown(timerElement);
      } else {
        endTheGame();
      }
    }
    }, 1000)
}

function endTheGame() {
  let popup = document.createElement('div');
  popup.className = 'popup';
  let popupH = document.createElement('h1');
  popupH.className = 'popup-heading';
  popupH.innerHTML = score === levelsObj[theLevel].length ? 'Congrats' : 'Game Over';
  popup.appendChild(popupH);
  let result = document.createElement('div');
  result.className = 'popup-result';
  result.innerHTML = `Your Score is ${score} From ${levelsObj[theLevel].length}`;
  popup.appendChild(result);
  let popupBtn = document.createElement('button');
  popupBtn.className = 'popupBtn';
  popupBtn.type = 'button';
  popupBtn.innerHTML = 'New Game';
  popup.appendChild(popupBtn);
  mainContainer.appendChild(popup);
  popupBtn.onclick = () => {
    LS.setItem(`match-${LS.length+1}`, `"level": "${theLevel}", "time": ${theLevel === 'Easy'? "7" : theLevel === 'Normal'? "5" : theLevel === 'Hard'? "3" : ''}, "score": ${score}, "total": "${levelsObj[theLevel].length}"`);
    window.location.reload()
  };
}
