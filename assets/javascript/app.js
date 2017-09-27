//TODO: Night king army++ as defender died
var YTK = YTK || {};

YTK.trivia = (function() {
  var 
  dataObj = [
    {
      question  : 'Who is the pilot of Eva-01?',
      answers   : ['Asuka', 'Shinji', 'Misato', 'Rei'],
      correct   : 1
    },
    {
      question  : 'What is Garen\'s last name in League',
      answers   : ['Crownguard', 'Demacia', 'Santo', 'Chen'],
      correct   : 0
    },
  ],
  currentDataObj,
  currentRoundStat = {
    p1correct : false,
    p2correct : false
  },
  gameStats = {
    mode   : 0,
    total  : 0,
    p1wins : 0,
    p2wins : 0
  },
  timerVal,
  getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  putTimer = function($timer) {
    $timer.html(timerVal);
  },
  resetTimer = function() {
    timerVal = 5;
  },
  updateTimer = function() {
    timerVal--;
  },
  startTimer = function($timer){
    setTimeout(function() {
      updateTimer();
      putTimer($timer);
    }, 1000);
  },
  initPage = function() {
    bindModeSelect();
    bindAISelect();
    initResultBar();
  },
  hideSection = function($element) {
    $element.addClass('hidden');
  },
  showSection = function($element) {
    $element.removeClass('hidden');
  },
  bindModeSelect = function() {
    $('.mode-btn', '#section-1').on('click', function() {
      
      var gameType = $(this).attr("data-type"),
          $aiSelect = $('.ai-select', '#section-1');

      if (gameType == 'vs2p') {
        gameStats.mode = 0;
        startGame(0);
      }
      else {
        $aiSelect.animate({
          opacity: 1
        }, 300, function() {
          $aiSelect.removeClass('no-click');
        });
      }

    });
  },
  bindAISelect = function() {
    var $ai = $('.ai', '#mode-select');

    $ai.on('click', function() {
      var aiID = parseInt($(this).attr('data-id'));
      gameStats.mode = aiID + 1;
      startGame(aiID + 1);
    });
  },
  initResultBar = function() {
    var $resultBar = $('.result-bar'),
        squareHTML = ''

    for(var i = 0; i < 5; i++) {
      squareHTML += '<i class="fa fa-square-o question-' + i + '" aria-hidden="true"></i>';
    }

    $resultBar.empty();
    $resultBar.html(squareHTML);
  },
  popDataFromDataObj = function(index) {
    return dataObj.splice(index, 1);
  },
  putQuestion = function() {
    var $question = $('.question', '#section-2');
    
    $question.html('<p>' + currentDataObj[0].question + '</p>');
  },
  putAnswers = function() {
    $('.answer-0').html(currentDataObj[0].answers[0]);
    $('.answer-1').html(currentDataObj[0].answers[1]);
    $('.answer-2').html(currentDataObj[0].answers[2]);
    $('.answer-3').html(currentDataObj[0].answers[3]);
  },
  putQuestionAnswers = function() {
    currentDataObj = popDataFromDataObj(getRandomInt(0, (dataObj.length)-1));
    putQuestion();
    putAnswers();
  },
  isCorrect = function(ansID) {
    return currentDataObj[0].correct == ansID;
  },
  resetCurrentStat = function() {
    currentRoundStat = {
      p1correct : false,
      p2correct : false
    }
  },
  resetGameStats = function() {
    gameStats = {
      total  : 0,
      p1wins : 0,
      p2wins : 0
    }
  },
  startWait = function(playerID) {
    if (playerID == 0) {
      $('.waiting', '.ui-left').removeClass('hidden');
    }
    else {
     $('.waiting', '.ui-right').removeClass('hidden'); 
    }
  },
  clearWait = function(playerID) {
    if (playerID == 0) {
      $('.waiting', '.ui-left').addClass('hidden');
    }
    else {
     $('.waiting', '.ui-right').addClass('hidden'); 
    }
  },
  bindAnswerBtns = function() {
    $('.answer-btn').off('click').on('click', function() {
      var $this = $(this),
          ansID = parseInt($this.attr('data-type'));

      // player 1
      if ($this.closest('.ui-left').length) {
        currentRoundStat.p1correct = isCorrect(ansID);
        startTurn(1);
      }
      else {
        currentRoundStat.p2correct = isCorrect(ansID);

        updateGameStats();
        updateResultBar();

        if (gameEnded()) {
          displayEndResult();
        }
        else {
          setupResultModal();
          displayResult();  
        }
      }
    });
  },
  gameEnded = function() {
    return gameStats.total == 5 || dataObj.length <= 0;
  },
  updateGameStats = function() {
    gameStats.total ++;
    gameStats.p1wins += currentRoundStat.p1correct;
    gameStats.p2wins += currentRoundStat.p2correct;
  },
  setupResultModal = function() {
    console.log('result', gameStats);
  },
  updateResultBar = function() {
    var resultID = gameStats.total - 1,
        $p1QuestionIcon = $('.question-' + resultID, '.ui-left'),
        $p2QuestionIcon = $('.question-' + resultID, '.ui-right');

    if (currentRoundStat.p1correct) {
      $p1QuestionIcon.addClass('correct');
    }
    else {
      $p1QuestionIcon.addClass('incorrect');
    }

    if (currentRoundStat.p2correct) {
      $p2QuestionIcon.addClass('correct');
    }
    else {
      $p2QuestionIcon.addClass('incorrect');
    }
  },
  displayResult = function() {
    var $resultModal = $('#resultModal');

    $resultModal.modal('show');

    $resultModal.on('shown.bs.modal', function() {
      setTimeout(function() {
        $resultModal.modal('hide');
        startGame(gameStats.mode);
      }, 3000);
    });
  },
  displayEndResult = function() {
    console.log('game ended');
  },
  startTurn = function(playerID){
    if (playerID == 0) {
      startWait(1);
      clearWait(0);  
    }
    else {
      startWait(0);
      clearWait(1);
    }
  },
  startGame = function(mode) {
    putQuestionAnswers();
    bindAnswerBtns();
    startTurn(0);
    hideSection($('#section-1'));
    showSection($('#section-2'));
  };

return {
    initPage : initPage
  }
})();

$(function() {
  YTK.trivia.initPage();
});