let spanCount = document.querySelector(".question-num span");
let bullet = document.querySelector(".quiz .bullets");
let countDownEle = document.querySelector(".quiz .bullets .countdown");
let resultContainer = document.querySelector(".quiz .results");
let spans = document.querySelector(".quiz .bullets .spans");
let quiz_body = document.querySelector(".quiz-body");
let answer_area = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit-button");

let x = 0;
let cAnswers = 0;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questions = JSON.parse(this.responseText);
      let questions_num = questions.length;

      createBullets(questions_num);
      AddQuestionObj(questions[x], questions_num);

      countDown(45, questions_num);

      submitButton.onclick = () => {
        let correctAnswer = questions[x].right_ans;

        x++;
        checkAnswer(correctAnswer, questions_num);

        quiz_body.innerHTML = "";
        answer_area.innerHTML = "";
        AddQuestionObj(questions[x], questions_num);

        manageBullets();
        showResult(questions_num);
      };
    }
  };
  myRequest.open("GET", "questions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  spanCount.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    if (i === 0) {
      span.className = "on";
    }
    spans.appendChild(span);
  }
}
function AddQuestionObj(obj, count) {
  if (x < count) {
    // create question div
    let title = document.createElement("h2");
    let titleText = document.createTextNode(obj.title);
    title.appendChild(titleText);
    quiz_body.appendChild(title);

    // create answer div

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let inputs = document.createElement("input");
      inputs.type = "radio";
      inputs.name = "question";
      inputs.id = `answer_${i}`;
      inputs.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        inputs.checked = true;
      }

      let lables = document.createElement("lable");
      lables.setAttribute("for", `answer_${i}`);
      let lableText = document.createTextNode(obj[`answer_${i}`]);
      lables.appendChild(lableText);

      mainDiv.appendChild(inputs);
      mainDiv.appendChild(lables);

      answer_area.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  console.log(`choosen Answer => ${choosenAnswer}`);
  console.log(`correct Answer => ${rAnswer}`);
  if (rAnswer === choosenAnswer) {
    console.log("perfect");
    cAnswers++;
  }
}
function manageBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let spanArray = Array.from(bulletsSpans);
  spanArray.forEach(function (e, index) {
    if (x === index) {
      e.className = "on";
    }
  });
}

function showResult(count) {
  let result;
  if (x === count) {
    quiz_body.remove();
    answer_area.remove();
    submitButton.remove();
    bullet.remove();

    if (cAnswers > count / 2 && cAnswers < count) {
      result = `<span class="good">GOOD!</span> you scored ${cAnswers} out of ${count}`;
    } else if (cAnswers === count) {
      result = `<span class="Perfect">Perfect!</span> you scored ${cAnswers} out of ${count}`;
    } else {
      result = `<span class="bad">Try Harder!</span> you scored  ${cAnswers} out of ${count}`;
    }
    resultContainer.innerHTML = result;
    resultContainer.style.padding = "10px";
    resultContainer.style.marginTop = "10px";
  }
}
function countDown(duration, count) {
  if (x < count) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownEle.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        quiz_body.remove();
        answer_area.remove();
        submitButton.remove();
        bullet.remove();

        if (cAnswers > count / 2 && cAnswers < count) {
          result = `<span class="good">GOOD!</span> you scored ${cAnswers} out of ${count}`;
        } else if (cAnswers === count) {
          result = `<span class="Perfect">Perfect!</span> you scored ${cAnswers} out of ${count}`;
        } else {
          result = `<span class="bad">Try Harder!</span> you scored  ${cAnswers} out of ${count}`;
        }
        resultContainer.innerHTML = result;
        resultContainer.style.padding = "10px";
        resultContainer.style.marginTop = "10px";
      }
    }, 1000);
  }
}
