var knowWords = [],
  strickcount = 0,
  bestStrick = 0,
  currentWord,
  currentTrnslated,
  isSound=1,
  music,
  counter=13;

$(document).ready(() => {
  $("#myModal").modal('show');

  getData();
  initStats();
  buttonsConnect();
  openMusic();

  $("#overlay-word").css("height", $("#text-pic").css("height"));
});

const openMusic=()=>{
  var open = document.getElementById("mscOpen");
  $('#myModal').on('hidden.bs.modal',()=>{
    isSound==1&&open.play();
     music = setTimeout(()=>{
      open.pause();
      newWordToTranslate();
      console.log(music);
      clearInterval(timer);
      counter=13;
    },13000);
  })
};

const buttonsConnect = () => {
  var userAns = $("#myAnswer");
  var check = $("#btnCheck");
  var answer = $("#right-Container");

  $("#btnCheck").click(() => {
    if ($("#btnCheck").val()=='Check') {
      checkAnswer();
    } else {
      nextQuestion()
    }
  });

$('#sound p,#btnQuiet').click(()=>{
  $('#sound p').toggleClass('hide');
  $('audio').trigger("pause");
  clearTimeout(music);
  if ($('#question').text()=="") {
    newWordToTranslate();
  }
  isSound*=-1;
})

  const nextQuestion=()=>{
    currentWord.complited = $("#cup").prop("checked");
    answer.hide(1000);
    userAns.val("");
    check.val("Check");
    userAns.removeClass("red green");
    saveData();
    initStats();
    setTimeout(newWordToTranslate,1000);
  }
  
  const checkAnswer=()=>{
    if (userAns.val().toLowerCase() == currentTrnslated.toLowerCase()) {
      userAns.addClass("green");
      ++strickcount;
      isSound==1&&document.getElementById("mscWin").play();
    } else {
      userAns.addClass("red");
      strickcount = 0;
      isSound==1&&document.getElementById("mscLose").play();
    }
    bestStrick = bestStrick < strickcount ? strickcount : bestStrick;
    $("#strick").text(strickcount);
    $("#bestStrick").text(bestStrick);
    // answer.addClass("show");
  
    answer.show(1000).css({ display: "flex" });
    // check.attr("disabled", "disabled");
    check.val('Next')
    saveData();
  }
};

const initStats = () => {
  $("#progress").text(((knowWords.length * 100) / words.length).toFixed(2));
  $("#bestStrick").text(bestStrick);
};

const getData = () => {
  if (localStorage.IKnow != undefined) {
    knowWords = JSON.parse(localStorage.IKnow);
  }
  if (localStorage.bestStrick != undefined) {
    bestStrick = JSON.parse(localStorage.bestStrick);
  }

  knowWords.map((key)=>{
    words[key].complited=true;
  });
};

const saveData = () => {
  knowWords = [];
  words.map((item, index) => {
    if (item.complited) {
      knowWords.push(index);
    }
  });
  localStorage.bestStrick = JSON.stringify(bestStrick);
  localStorage.IKnow = JSON.stringify(knowWords);
};

const getRandomNumber = () => {
  var rand = Math.random();
  return Math.floor(rand * words.length);
};

const getRandomLanguage = () => {
  return Math.random() > 0.5 ? "heb" : "eng";
};

const newWordToTranslate = () => {
  let index = getRandomNumber();
  let lng = getRandomLanguage();

  currentWord = words[index];
  translate(lng);

  $("#cup").prop("checked", words[index].complited);
};

var wordflick = function (newWord) {
  var part,
    offset = 0,
    skip_count = 0,
    speed = 150;
  var wordsType = setInterval(function () {
    if (offset >= newWord.length) {
      ++skip_count;
    }
    part = newWord.substr(0, offset);
    $("#question").text(part);
    if (skip_count == 0) {
      offset++;
    } else {
      clearInterval(wordsType);
    }
  }, speed);
};

function translate(lng) {
  var sourceText = currentWord.eng;
  var sourceLang = 'en';
  var targetLang = 'he';

  console.log(sourceText);

  var url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
    sourceLang +
    "&tl=" +
    targetLang +
    "&dt=t&q=" +
    encodeURI(sourceText);
  //console.log(url);

  $.getJSON(url, function (data) {
    currentWord.heb = data[0][0][0];

    currentTrnslated = currentWord[lng == "eng" ? "heb" : "eng"];

    $("#translated").text(currentTrnslated);
    wordflick(currentWord[lng]);
  });
}
