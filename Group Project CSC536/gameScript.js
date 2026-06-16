const questions = [
	{
		question: "Which of these animals is a mammal?",
		answers: [
			{ text: "Crocodile", correct: false},
			{ text: "Tiger", correct: true},
			{ text: "Salmon", correct: false},
			{ text: "Eagle", correct: false},
			
		]
	},
	{
		question: "Which of the following is a feature of all mammals?",
		answers: [
			{ text: "Laying eggs", correct: false},
			{ text: "Having feathers", correct: false},
			{ text: "Producing milk", correct: true},
			{ text: "Breathing through gills", correct: false},
		]
	},
	{
		question: "Which of these animals is a reptile?",
		answers: [
			{ text: "Frog", correct: false},
			{ text: "Snake", correct: true},
			{ text: "Dolphin", correct: false},
			{ text: "Parrot", correct: false},
		]
	},
	{
		question: "Reptiles are: ",
		answers: [
			{ text: "Cool-blooded", correct: true},
			{ text: "Warm-blooded", correct: false},
			{ text: "Amphibious", correct: false},
			{ text: "Feathered", correct: false},
		]
	},
	{
		question: "Which of the following is a fish?",
		answers: [
			{ text: "Octopus", correct: false},
			{ text: "Seahorse", correct: true},
			{ text: "Crab", correct: false},
			{ text: "Seal", correct: false},
		]
	},
	{
		question: "Fish are usually covered in:",
		answers: [
			{ text: "Fur", correct: false},
			{ text: "Feathered", correct: false},
			{ text: "Scales", correct: true},
			{ text: "Skin", correct: false},
		]
	},
	{
		question: "Which of the following birds cannot fly?",
		answers: [
			{ text: "Sparrow", correct: false},
			{ text: "Eagle", correct: false},
			{ text: "Hawk", correct: false},
			{ text: "Ostrich", correct: true},
		]
	},
	{
		question: "Birds breathe using:",
		answers: [
			{ text: "Gills", correct: false},
			{ text: "Skin", correct: false},
			{ text: "Lungs", correct: true},
			{ text: "Spiracles", correct: false},
		]
	},
	{
		question: "Which of these is an amphibian?",
		answers: [
			{ text: "Salamander", correct: true},
			{ text: "Penguin", correct: false},
			{ text: "Alligator", correct: false},
			{ text: "Turtle", correct: false},
		]
	},
	{
		question: "Amphibian breathe through their skin and:",
		answers: [
			{ text: "Lungs", correct: false},
			{ text: "Gills", correct: false},
			{ text: "Wings", correct: false},
			{ text: "Both lungs and gills", correct: true},
		]
	},
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0; 
let userAnswers = [];

function startQuiz(){
	currentQuestionIndex =  0;
	score = 0;
	userAnswers = []; // Clear previous answers

	document.getElementById("review-container").style.display = "none"; // Hide review
	document.getElementById("review-container").innerHTML = ""; // Clear review content

	nextButton.innerHTML = "Next";
	showQuestion();
}



function showQuestion(){
	resetState();
	let currentQuestion = questions[currentQuestionIndex];
	let questionNo = currentQuestionIndex + 1;
	questionElement.innerHTML = questionNo + ". " + currentQuestion.question;
	nextButton.innerHTML = "Next";
	
	currentQuestion.answers.forEach(answers => {
		const button = document.createElement("button");
		button.innerHTML = answers.text;
		button.classList.add("btn");
		answerButtons.appendChild(button);	
		if(answers.correct){
			button.dataset.correct = answers.correct;
		}
		button.addEventListener("click", selectAnswer);
	});
}

function resetState(){
	nextButton.style.display = "none";
	while(answerButtons.firstChild){
		answerButtons.removeChild(answerButtons.firstChild);
	}
}

function selectAnswer(e){
	const selectedBtn = e.target;
	const isCorrect = selectedBtn.dataset.correct == "true";
	
	const correctSound = document.getElementById("correctSound");
	const wrongSound = document.getElementById("wrongSound");

	if(isCorrect){
		selectedBtn.classList.add("correct");
		score++;
		correctSound.play();
	}else{
		selectedBtn.classList.add("incorrect");
		wrongSound.play();
	}
	
	// Store user's selected answer
	userAnswers.push({
		question: questions[currentQuestionIndex].question,
		selected: selectedBtn.innerText,
		correctAnswer: questions[currentQuestionIndex].answers.find(a => a.correct).text,
		isCorrect: isCorrect,
		explanation: getExplanation(currentQuestionIndex)
	});
	
	Array.from(answerButtons.children).forEach(button => {
		if(button.dataset.correct == "true"){
			button.classList.add("correct");
		}
		button.disabled = true;
	});
	nextButton.style.display = "block";
}



function handleNextButton(){
	currentQuestionIndex++;
	if(currentQuestionIndex < questions.length){
		showQuestion();
	}else{
		showScore();
	}
}

nextButton.addEventListener("click", ()=>{
	if(currentQuestionIndex < questions.length){
		handleNextButton();
	}else{
		startQuiz();
	}
});

startQuiz();

function getExplanation(index) {
	const explanations = [
		"Tigers are mammals because they give birth to live young and produce milk.",
		"Mammals produce milk to feed their young — a key trait of the group.",
		"Snakes are reptiles — they have scales and lay eggs or give live birth.",
		"Reptiles are cold-blooded, meaning their body temperature depends on their environment.",
		"Seahorses are bony fishes, living in shallow coastal waters.",
		"Most fish are covered in scales for protection and mobility in water.",
		"Ostriches are birds, but they have lost the ability to fly due to size and adaptation.",
		"Birds breathe using lungs — unlike fish which use gills.",
		"Salamanders are amphibians — they live both in water and on land.",
		"Amphibians breathe through skin and lungs or gills depending on their stage of life."
	];
	return explanations[index];
}

function showReview() {
	const reviewContainer = document.getElementById("review-container");
	reviewContainer.innerHTML = "<h3>Review of Questions:</h3>";

	questions.forEach((question, index) => {
		const user = userAnswers[index];

		const reviewBox = document.createElement("div");
		reviewBox.style.backgroundColor = "#f9f9f9";
		reviewBox.style.padding = "15px";
		reviewBox.style.marginBottom = "15px";
		reviewBox.style.borderRadius = "10px";
		reviewBox.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";

		let answerListHTML = "<ul style='list-style-type: none; padding-left: 0;'>";

		question.answers.forEach(answer => {
			let color = "#000"; // default text color
			let prefix = "";

			if (answer.text === user.correctAnswer) {
				color = "green";
				prefix = "✔️ ";
			}

			if (answer.text === user.selected && !user.isCorrect) {
				color = "red";
				prefix = "❌ ";
			}

			answerListHTML += `<li style="margin: 5px 0; color: ${color};">${prefix}${answer.text}</li>`;
		});

		answerListHTML += "</ul>";

		reviewBox.innerHTML = `
			<strong>Q${index + 1}: ${question.question}</strong><br><br>
			${answerListHTML}
			Explanation: <em>${user.explanation}</em>
		`;

		reviewContainer.appendChild(reviewBox);
	});

	reviewContainer.style.display = "block";
}


function showScore() {
	resetState();
	questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
	nextButton.innerHTML = "Play Again";
	nextButton.style.display = "block";
	showReview(); // 🔥 Show review after score
}