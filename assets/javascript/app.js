var time = 0;                                   // time in seconds for timer
var intermission = 0                            // to know what kind of content is being displayed, and set the appropriate wait time
var wins = 0
var losses = 0
var questionNumber = 1;                         // current question
var intervalId;                                 // id for setInterval timer
var waitForUser = 14                            // seconds to wait for user to respond
var waitForMessage = 2                          // duration [s] for message in-between questions (correct or wrong answer)
var lastAnswer = ''

// initial call; loads start button, waits for user
$(document).ready(function() { promptStart() });

// fnc for start button and initial display, awaiting user to click to begin the game
function promptStart() { displayStart("How about playing some trivia, and finding out?", "assets/images/bender-electric.gif", "Start Game") }

// fnc for game over, loads play-again btn
function gameOver() {
   head = "Game Over. Let's see how you did: " + wins + "right & " + losses + " wrong!"
   displayStart(head, "assets/images/bender-dancing.gif", "Play Again")
}

// reset variables for new game
function resetGame() {
   time = 0
   wins = 0
   losses = 0
   questionNumber = 1
}

// display card header content
function displayHeader(head) {
   var cardHeader = $(".card-header")
   cardHeader.empty()
   var qDiv = $("<h3>")
   qDiv.text(head)
   cardHeader.append(qDiv)
}

// display image in card body
function displayImage(image) {
   var cardBody = $(".card-body")
   cardBody.empty()
   imgBody = $('<img>',{id:'theImg',src: image})
   imgBody.addClass("img-fluid")
   cardBody.prepend(imgBody)
}

// loads content for game start and game over (message, btn, gif)
function displayStart(head, image, footer) {
   displayHeader(head)
   displayImage(image)
   var cardFooter = $(".card-footer")
   cardFooter.empty()
   var strBtn = $("<button>")
   strBtn.addClass("btn").addClass("btn-primary").text(footer)
   strBtn.on( "click", function(event) {
       resetGame()
       displayQuestion(questionNumber)
   });
   cardFooter.append(strBtn)
}

// fnc to load html w/ question and answers unto page; resets, starts timer
function displayQuestion(questionNumber) {
   intermission = 0
   curruentQuestion = String(questionNumber)
   displayHeader(trivia[curruentQuestion].question)
   var cardBody = $(".card-body")
   cardBody.empty()
   var answerArray = trivia[curruentQuestion].answers
   for (i = 0; i < answerArray.length; i++) {
       var ansDiv = $("<div>")
       ansDiv.addClass("alert").addClass("possible-answer").text(answerArray[i])
       ansDiv.on( "click", function(event) {
           verifyResponse($(this)[0].innerText)
       });
       cardBody.append(ansDiv)
   }
   timer.reset(waitForUser)
   timer.start()
}
// loads html content for in-between questions, with approproate message (win, loss, timeout) and gif
function displayIntermission(head, image) {
    displayHeader(head)
    displayImage(image)
 }
 
 // verify if user answered correctly or not at all, display correct answer, call to display meesage/gif for win, lose
 function verifyResponse(answerText) {
    if (answerText) {
        timer.stop()
        lastAnswer = answerText
    }
    else {
        lastAnswer = ''
    }
    intermission = 1
    timer.reset(waitForMessage+1)
    var theCorrectAnswer = "The correct answer was: " + trivia[String(questionNumber)].correct + "!"
    displayIntermission(theCorrectAnswer, trivia[String(questionNumber)].gif)
    timer.start()
 }
 
 // display message for win, lose
 function flagScore(answerText) {
    if (answerText) {
        if (answerText == trivia[String(questionNumber)].correct) {
            wins++
            displayIntermission("You got it right!", "assets/images/bender-high-fives-self.gif")
        } else {
            losses++
            displayIntermission("You got it wrong", "assets/images/bender-crying.gif")
        }
    }
    else {
        displayIntermission("You ran out of :mantelpiece_clock:", "assets/images/bender-you-stink.gif")
        losses++
    }
    timer.reset(waitForMessage)
    timer.start()
 }
 
 // timer obj
 var timer = {
    reset: function(resetTime) {
        time = resetTime
        if (!intermission) { displayTime(time) }
    },
    stop: function() {
        clearInterval(intervalId);
    },
    count: function() {
        time--
        if (intermission == 1) {
            timer.checkCorrect()
        }
        else if (intermission == 2) {
            timer.checkIntermission()
        }
        else {
            displayTime(time)
            timer.check()
        }
    },
    start: function() {
        intervalId = setInterval(timer.count, 1000);
    },
    check: function() {
        if (time <= 0) {
            timer.stop()
            verifyResponse()
        }
    },
    checkIntermission: function() {
        if (time <= 0) {
            timer.stop()
            timer.reset(waitForUser)
            ++questionNumber
            if (questionNumber > 10) {
                gameOver()
            }
            else {
                displayQuestion(questionNumber)
            }
        }
    },
    checkCorrect: function() {
        if (time <= 0) {
            timer.stop()
            timer.reset(waitForMessage)
            ++intermission
            flagScore(lastAnswer)
        }
    },
 }
 // function to add inner html to card footer w info on time remaining
function displayTime(time) {
    var cardFooter = $(".card-footer")
    cardFooter.empty()
    var timeRemaining = "<p>Time Remaining: <span>"+time+"</span> seconds</p>"
    cardFooter.html(timeRemaining)
 }
 
 // obj to store questions and answers, and gifs
 var trivia = {
    '1': {
        question: "Which Dr. Seuss character disabled Joe?",
        answers: ["The Cat in the Hat", "The Lorax", "Horton", "The Grinch"],
        correct: "The Grinch",
        gif: "assets/images/peter.gif"
    },
    '2': {
        question: "What is the title of Brain's novel?",
        answers: ["Faster Than Speed of Love", "Phantom of Dreams", "Officers and Companions", "Criminal Withouth a conscience"],
        correct: "Faster Than the Speed of Love",
        gif: "assets/images/Brain.gif"
    },
    '3': {
        question: "Who voices Peter Griffin?",
        answers: ["Dan Catellaneta", "Hank Azaria", "Seth MacFarlane", "Harry Shearer"],
        correct: "Seth MacFarlane",
        gif: "assets/images/Peter-S.gif"
    },
    '4': {
        question: "What street do the Griffins live on?",
        answers: ["Wisteria lane", "Bonanza Street", "Spooner Street", "Evergreen Terrace"],
        correct: "Spooner Street",
        gif: "assets/images/brian-Stewie.gif"
    },
    '5': {
        question: "Which of these is NOT a real Road to episode?",
        answers: ["Road to Rupert", "Road to Atlantic city", "Road to Rhode Island", "Road to the Multiverse"],
        correct: "Road to Atlantic City",
        gif: "assets/images/Stewie-brain.gif"
    },
    '6': {
        question: "Which Star Wars character did Chris play in the Blue Harvest specials?",
        answers: ["Han Solo", "Luke Skywalker ", "Obi Wan Kenobi", "Poe Dameron"],
        correct: "Luke Skywalker",
        gif: "assets/images/Stewies.gif"
    },
    '7': {
        question: "Who voices Lois Griffin?",
        answers: ["Julie Kavner", "Alex Borstein", "Yeardles Smith", "Nancy Cartwright"],
        correct: "Alex Borstein",
        gif: "assets/images/giphy.gif"
    },
    '8': {
        question: "Which character got their own spinoff show?",
        answers: ["Quagmire", "Joe", "Cleveland", "Mort"],
        correct: "Cleveland",
        gif: "assets/images/Peter-n.gif"
    },
    '9': {
        question: "What dessert topping does Stewie mispronounce?",
        answers: ["Aunt Jemima", "Mrs. Butterworth's", "Ambrosia", "Cool Whip"],
        correct: "Cool Whip",
        gif: "assets/images/Peter-banana.gif"
    },
    '10': {
        question: "What town do the Griffins live in?",
        answers: ["Langley Falls", "Sunnydale", "Quahog", "Springield"],
        correct: "Quahog",
        gif: "assets/images/Stewies.gif"
    }
 }












