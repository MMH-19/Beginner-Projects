// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const questionElement = document.getElementById('question');
const answersContainer = document.getElementById('answers');
const timerElement = document.getElementById('timer');
const timeTakenElement = document.getElementById('time-taken');
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('total-questions');
const passFailElement = document.getElementById('pass-fail');
const retryBtn = document.getElementById('retry-btn');
const shareFacebookBtn = document.getElementById('share-facebook');
const shareTwitterBtn = document.getElementById('share-twitter');

// Quiz state variables
let currentQuestionIndex = 0;
let score = 0;
let timeStarted;
let timerInterval;
let quizData = [];

// Quiz configuration
const PASS_PERCENTAGE = 70;
const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

// Event listeners
startBtn.addEventListener('click', startQuiz);
retryBtn.addEventListener('click', resetQuiz);
shareFacebookBtn.addEventListener('click', shareOnFacebook);
shareTwitterBtn.addEventListener('click', shareOnTwitter);

// Initialize the app
init();

function init() {
    fetchQuizData();
}

// Fetch quiz data from API
async function fetchQuizData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.response_code === 0) {
            quizData = data.results.map(item => {
                return {
                    question: decodeHTML(item.question),
                    correctAnswer: decodeHTML(item.correct_answer),
                    answers: [...item.incorrect_answers.map(a => decodeHTML(a)), decodeHTML(item.correct_answer)]
                        .sort(() => Math.random() - 0.5)
                };
            });
            
            totalQuestionsElement.textContent = quizData.length;
        } else {
            console.error('Error fetching quiz data');
            // Use fallback data if API fails
            useFallbackQuizData();
        }
    } catch (error) {
        console.error('Error:', error);
        // Use fallback data if API fails
        useFallbackQuizData();
    }
}

// Fallback quiz data if API fails
function useFallbackQuizData() {
    quizData = [
        {
            question: "What is the capital of France?",
            correctAnswer: "Paris",
            answers: ["London", "Berlin", "Madrid", "Paris"]
        },
        {
            question: "Which planet is known as the Red Planet?",
            correctAnswer: "Mars",
            answers: ["Venus", "Mars", "Jupiter", "Saturn"]
        },
        {
            question: "What is the largest mammal?",
            correctAnswer: "Blue Whale",
            answers: ["Elephant", "Giraffe", "Blue Whale", "Hippopotamus"]
        },
        {
            question: "Which language runs in a web browser?",
            correctAnswer: "JavaScript",
            answers: ["Java", "C", "Python", "JavaScript"]
        },
        {
            question: "What does HTML stand for?",
            correctAnswer: "Hyper Text Markup Language",
            answers: ["Hyper Text Markup Language", "High Tech Machine Learning", "Hyper Transfer Markup Language", "Home Tool Markup Language"]
        }
    ];
    
    totalQuestionsElement.textContent = quizData.length;
}

// Start the quiz
function startQuiz() {
    startScreen.classList.add('hide');
    quizScreen.classList.remove('hide');
    
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    
    // Start timer
    timeStarted = new Date();
    startTimer();
    
    // Load first question
    loadQuestion();
}

// Load current question
function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    
    questionElement.textContent = currentQuestion.question;
    
    // Clear previous answers
    answersContainer.innerHTML = '';
    
    // Create answer buttons
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('answer-btn');
        button.addEventListener('click', () => selectAnswer(answer));
        answersContainer.appendChild(button);
    });
}

// Handle answer selection
function selectAnswer(selectedAnswer) {
    const currentQuestion = quizData[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Find the selected button
    const buttons = answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach(button => {
        if (button.textContent === selectedAnswer) {
            button.classList.add('selected');
            button.classList.add(isCorrect ? 'correct' : 'wrong');
        }
        
        // Disable all buttons after selection
        button.disabled = true;
    });
    
    // Update score if correct
    if (isCorrect) {
        score++;
    }
    
    // Move to next question after a short delay
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            endQuiz();
        }
    }, 1000);
}

// End the quiz and show results
function endQuiz() {
    // Stop timer
    clearInterval(timerInterval);
    
    // Calculate time taken
    const timeTaken = new Date() - timeStarted;
    const minutes = Math.floor(timeTaken / 60000);
    const seconds = Math.floor((timeTaken % 60000) / 1000);
    
    // Update results screen
    timeTakenElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    scoreElement.textContent = score;
    
    // Calculate pass/fail
    const percentage = (score / quizData.length) * 100;
    if (percentage >= PASS_PERCENTAGE) {
        passFailElement.textContent = 'You passed!';
        passFailElement.style.color = '#27ae60';
    } else {
        passFailElement.textContent = 'You failed!';
        passFailElement.style.color = '#e74c3c';
    }
    
    // Show results screen
    quizScreen.classList.add('hide');
    resultsScreen.classList.remove('hide');
}

// Reset quiz to start again
function resetQuiz() {
    resultsScreen.classList.add('hide');
    startScreen.classList.remove('hide');
}

// Timer function
function startTimer() {
    let seconds = 0;
    
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Share functions
function shareOnFacebook() {
    const text = `I scored ${score} out of ${quizData.length} on the Quiz App!`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    
    window.open(url, '_blank');
}

function shareOnTwitter() {
    const text = `I scored ${score} out of ${quizData.length} on the Quiz App!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    
    window.open(url, '_blank');
}

// Helper function to decode HTML entities
function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
} 