//TODO: Night king army++ as defender died
var YTK = YTK || {};

YTK.trivia = (function() {
  var 
  dataObj = [
    {
      question  : 'Who is the primary pilot of Evagelion unit-01?',
      answers   : ['Asuka', 'Shinji', 'Misato', 'Rei'],
      correct   : 1
    },
    {
      question  : 'What is Garen\'s last name in League of Legends?',
      answers   : ['Crownguard', 'Demacia', 'Santo', 'Freeman'],
      correct   : 0
    },
    {
      question  : 'Which of these is not a character from Witcher?',
      answers   : ['Ciri', 'Geralt', 'Ulfric', 'Emhyr'],
      correct   : 2
    },
    {
      question  : 'Which of these is the weakest in Horizon Zero Dawn?',
      answers   : ['Thunderjaw', 'Stormbird', 'Corruptor', 'Grazer'],
      correct   : 3
    },
    {
      question  : 'Who is the protagonist of Horizon Zero Dawn?',
      answers   : ['Aloy', 'Alloy', 'Ashly', 'Pocahontas'],
      correct   : 0
    },
    {
      question  : 'In Witcher 3, which of the following won\'t help you in the battle of Kaer Morhen?',
      answers   : ['Letho', 'Eskel', 'Kiera', 'Dandelion'],
      correct   : 3
    },
    {
      question  : 'Who is not a member of the Lodge of Sorceresses?',
      answers   : ['Triss', 'Ves', 'Keira', 'Ciri'],
      correct   : 1
    },
    {
      question  : 'Who can perform a double-jump in Fortnite?',
      answers   : ['Soldier', 'Constructor', 'Ninja', 'Outlander'],
      correct   : 2
    },
    {
      question  : 'Which of these Overwatch characters is not Asian?',
      answers   : ['D.Va', 'Symmetra', 'Mei', 'Ana'],
      correct   : 3
    },
    {
      question  : 'Which of these characters is not from Starcraft?',
      answers   : ['Muradin', 'Tassadar', 'Zeratul', 'Abathur'],
      correct   : 0
    },
    {
      question  : 'Which of these Leguage of Legends character is from the Shadow Isles?',
      answers   : ['Braum', 'Lux', 'Evelynn', 'Ashe'],
      correct   : 2
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
  timerVal = 7,
  timerInterval,
  getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  putTimer = function($timer) {
    $timer.html('00:0' + timerVal);

    if (timerVal <= 0) {
      resetTimer();

      // mimic an answer btn click
      $('.answer-4', '.active').click();
    }
  },
  pauseTimer = function() {
    clearInterval(timerInterval);
  },
  resetTimer = function() {
    pauseTimer();
    timerVal = 7;
  },
  updateTimer = function() {
    timerVal--;
  },
  startTimer = function($timer){
    putTimer($timer);
    timerInterval = setInterval(function() {
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
    var $ai = $('.ai', '.ai-select');

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
      $('.ui-left').removeClass('active');
    }
    else {
     $('.waiting', '.ui-right').removeClass('hidden'); 
     $('.ui-right').removeClass('active');
    }
  },
  clearWait = function(playerID) {
    if (playerID == 0) {
      $('.waiting', '.ui-left').addClass('hidden');
      $('.ui-left').addClass('active');
    }
    else {
     $('.waiting', '.ui-right').addClass('hidden'); 
     $('.ui-right').addClass('active');
    }
  },
  aiCorrect = function(aiID) {
    var randNum = getRandomInt(1, 10);

    if (aiID == 0) { //60%
      return randNum > 4;
    }
    else if (aiID == 1) { //80%
      return randNum > 2;
    }
    else { //90%
      return randNum > 1;
    }

  },
  aiPlay = function() {
    var aiID = gameStats.mode - 1,
        thinkTime = getRandomInt(1000, 2000),
        correct = aiCorrect(aiID);

    if (correct) {
      setTimeout(function() {
        $('.answer-' + currentDataObj[0].correct, '.active').click();
      }, thinkTime);
    }
    else {
     setTimeout(function() {
        $('.answer-4', '.active').click();
      }, thinkTime); 
    }

  },
  bindAnswerBtns = function() {
    $('.answer-btn').off('click').on('click', function() {
      var $this = $(this),
          ansID = parseInt($this.attr('data-type'));

      pauseTimer();

      // player 1
      if ($this.closest('.ui-left').length) {
        currentRoundStat.p1correct = isCorrect(ansID);
        startTurn(1);

        if (gameStats.mode !== 0) {
          aiPlay();
        }
      }
      else {
        currentRoundStat.p2correct = isCorrect(ansID);

        updateGameStats();
        updateResultBar();

        if (gameEnded()) {
          initEndResult();
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
  setup2PIcon = function($icon) {
    if (gameStats.mode == 0) {
      $icon.addClass('ai-2p');
    }
    else {
      $icon.addClass('ai-' + (gameStats.mode - 1));
    }
  },
  setupResultModal = function() {
    var $titleDiv   = $('.modal-title', '#resultModal'),
        $resultDiv  = $('.result-text', '#resultModal'),
        $p2Icon     = $('.enemy-icon .ai', '#resultModal');

    if (currentRoundStat.p1correct && currentRoundStat.p2correct) {
      $titleDiv.html('You both got it right!')
    }
    else if (currentRoundStat.p1correct) {
      $titleDiv.html('You got it right!')
    }
    else if (currentRoundStat.p2correct) {
      $titleDiv.html('2P got it right!')
    }
    else {
      $titleDiv.html('Nobody got it right!')
    }

    setup2PIcon($p2Icon);

    $resultDiv.html('<p>' + gameStats.p1wins + ' : ' + gameStats.p2wins + '</p>');
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
  bindPlayAgainBtn = function($btn) {
    $btn.on('click', function() {
      window.location.href = "index.html";
    });
  },
  bindShareBtn = function($btn) {
    $btn.on('click', function() {
      window.location.href = "https://www.facebook.com/sharer/sharer.php?u=https://yankwong.github.io/TriviaGame/";
    })
  },
  initEndResult = function() {
    var $titleDiv   = $('.modal-title', '#endModal'),
        $resultDiv  = $('.result-text', '#endModal'),
        $p2Icon     = $('.enemy-icon .ai', '#endModal');

    if (gameStats.p1wins > gameStats.p2wins) {
      $titleDiv.html('Player 1 won the game!');
    }
    else if (gameStats.p2wins > gameStats.p1wins) {
      $titleDiv.html('Player 2 won the game!'); 
    }
    else {
      $titleDiv.html('Draw game!');  
    }
    $resultDiv.html('<p>' + gameStats.p1wins + ' : ' + gameStats.p2wins + '</p>');

    setup2PIcon($p2Icon);
    bindPlayAgainBtn($('.play-again', '#endModal'));
    bindShareBtn($('.btn-fb-share'));

    $('#endModal').on('hidden.bs.modal', function (e) {
      window.location.href = "index.html";
    });
  },
  displayEndResult = function() {
    $('#endModal').modal('show');
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
    resetTimer();
    startTimer($('.timer', '.monitor'));
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