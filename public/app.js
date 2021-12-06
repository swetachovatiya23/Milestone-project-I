// take variable for questions, quiz options, check the answers, if wanted to start over so play again,
// to show final result, to show correct score, total questions.

const _questions = document.getElementById('questions');
const _options = document.querySelector('.game-options');
const _checkButton = document.getElementById('check-answer');
const _playAgainButton = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestions = document.getElementById('total-questions');

//variables for correct answer, correct score,total question.

let correctAnswer = "", correctScore = askedQue = 0, totalQuestions = 10;

    
// loading questions from API
async function loadingQuestions(){
    // if (document.getElementById("books") == "books") {
    //    const APIUrl = 'https://opentdb.com/api.php?amount=10&category=10';
    // }
    const APIUrl = 'https://opentdb.com/api.php?amount=10&category=10';
    const result = await fetch(`${APIUrl}`)
    const data = await result.json();
    _result.innerHTML = "";
    showQue(data.results[0]);

}

// event listeners for checkanswer and play again button
function eventListeners(){
    _checkButton.addEventListener('click', checkAnswer);
    _playAgainButton.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function(){
    loadingQuestions();
    eventListeners();
    _totalQuestions.textContent = totalQuestions;
    _correctScore.textContent = correctScore;
});

// display questions and options
function showQue(data){
    _checkButton.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    // console.log(correctAnswer);

    
    _questions.innerHTML = `(${askedQue +1}) ${data.question} <br><span class = "category"> ${data.category} </span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}


// options selection
function selectOption(){
    _options.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// answer checking
function checkAnswer(){
    _checkButton.disabled = true;
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            correctScore++;

            //for correct answer display
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            //for incorrect answer display
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        checkCount();
        
        //for not selecting any option
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        _checkButton.disabled = false;
    }
}

// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}


function checkCount(){
    askedQue++;
    setCount();
    if(askedQue == totalQuestions){
        setTimeout(function(){
            console.log("");
        }, 5000);


        _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        _playAgainButton.style.display = "block";
        _checkButton.style.display = "none";
    } else {
        setTimeout(function(){
            loadingQuestions();
        }, 300);
       
    }
}

function setCount(){
    _totalQuestions.textContent = totalQuestions;
    _correctScore.textContent = correctScore;
}

//for restarting the quiz
function restartQuiz(){
    correctScore = askedQue = 0;
    _playAgainButton.style.display = "none";
    _checkButton.style.display = "block";
    _checkButton.disabled = false;
    setCount();
    loadingQuestions();
}


