// Get user data and questions from sessionStorage and localStorage
var subject = sessionStorage.getItem("subject");
var brandCode = sessionStorage.getItem("brandCode");
var studentName = sessionStorage.getItem("name");
var address = sessionStorage.getItem("address");
var fatherName = sessionStorage.getItem("fatherName");
var enrollment = sessionStorage.getItem("enrollment");
var imgUrl = sessionStorage.getItem("imgUrl");

var allQuestion = [];

// Start reading Question from local storage
if(localStorage.getItem(brandCode+"_"+subject+"_question") !== null){
    allQuestion = JSON.parse(localStorage.getItem(brandCode+"_"+subject+"_question"));
    console.log(allQuestion);
}

let index = 0; 
var total = allQuestion.length;
let right = 0; 
let wrong = 0; 
let allUserResult = [];
particularUserResult = [];
let mainBox = document.querySelector(".main");
const questionEl = document.querySelector(".question-el");
const allOptionEl = document.querySelectorAll(".option");
const nextBtn = document.querySelector(".next-btn");

// Function to load the current question dynamically
const getQuestionFunc = () => {
    if (index >= allQuestion.length) {
        endQuiz(); // End the quiz if all questions are answered
        return;
    }

    const data = allQuestion[index]; // Get the current question
    questionEl.innerText = `Q-${index + 1}: ${data.question}`;

    // Dynamically assign labels and values to options
    allOptionEl[0].value = data.optionone;
    allOptionEl[1].value = data.optiontwo;
    allOptionEl[2].value = data.optionthree;
    allOptionEl[3].value = data.optionfour;

    document.querySelector("label[for='option-1']").innerText = data.optionone;
    document.querySelector("label[for='option-2']").innerText = data.optiontwo;
    document.querySelector("label[for='option-3']").innerText = data.optionthree;
    document.querySelector("label[for='option-4']").innerText = data.optionfour;

    // Reset the options for the next question
    allOptionEl.forEach((input) => {
        input.checked = false;
    });
};

// Function to get the selected answer
const getAnswer = () => {
    let answer = null;
    allOptionEl.forEach((input) => {
        if (input.checked) {
            answer = input.value;
        }
    });
    return answer;
};

// Next button click handler
nextBtn.onclick = function () {
    const ans = getAnswer();
    if (ans === null) {
        alert("Please select an answer!");
        return;
    }

    const data = allQuestion[index];
    if (ans === data.answerAnswer) {
        right++; // Increment right answer count
    } else {
        wrong++; // Increment wrong answer count
    }

    index++; // Move to the next question
    getQuestionFunc(); // Load the next question
};

// Function to handle the end of the quiz
const endQuiz = () => {
    mainBox.innerHTML = `
        <h2>Hit Submit to lock in your answers and wrap up your examination!</h2>
        <div align="center">
            <br>
            <button class="btn btn-primary quiz-submit-btn">Submit</button>
        </div>
    `;
    submitFunc();
};

// Function to handle submit action
const submitFunc = () => {
    if(localStorage.getItem(brandCode+"_"+subject+"_result")!=null){
        allUserResult = JSON.parse(localStorage.getItem(brandCode+"_"+subject+"_result"));
    }
    if(localStorage.getItem(brandCode+"_"+enrollment+"_result")!=null){
        particularUserResult = JSON.parse(localStorage.getItem(brandCode+"_"+enrollment+"_result"));
    }
    var submitBtn = document.querySelector(".quiz-submit-btn");
    submitBtn.onclick = function() {
        allUserResultFunc();
        particularUserResultFunc();
        this.innerHTML = "Please Wait..."; 
        this.disabled = true; 
    };
};

// Function to save all user results and redirect to homepage
const allUserResultFunc = () => {
    allUserResult.push({
        name: studentName,
        enrollment: enrollment,
        rightAns: right,
        wrongAns: wrong,
        subject: subject,
        maxMarks : total,
        
    });
    
    // Save results to localStorage
    localStorage.setItem(brandCode+"_"+subject+"_result", JSON.stringify(allUserResult));
    
    setTimeout(function() {
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("address");
        sessionStorage.removeItem("enrollment");
        sessionStorage.removeItem("fatherName");
        sessionStorage.removeItem("brandCode");
        sessionStorage.removeItem("subject");
        window.location = "../homepage/homepage.html"; // Redirect to homepage
    }, 1000);
};

const particularUserResultFunc =  () =>{
    particularUserResult.push({
        name: studentName,
        fatherName : fatherName,
        enrollment: enrollment,
        rightAns: right,
        wrongAns: wrong,
        subject: subject,
        maxMarks : total,
        profilePic : imgUrl,
    });
    localStorage.setItem(brandCode+"_"+enrollment+"_result",JSON.stringify(particularUserResult));
    setTimeout(function() {
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("address");
        sessionStorage.removeItem("enrollment");
        sessionStorage.removeItem("fatherName");
        sessionStorage.removeItem("brandCode");
        sessionStorage.removeItem("subject");
        window.location = "../homepage/homepage.html"; // Redirect to homepage
    }, 1000);
}

// Reset quiz function
const resetQuiz = () => {
    index = 0;
    right = 0;
    wrong = 0;
    nextBtn.disabled = false;
    allOptionEl.forEach((input) => {
        input.checked = false;
    });
    getQuestionFunc();
};

// Initialize the first question
getQuestionFunc();


