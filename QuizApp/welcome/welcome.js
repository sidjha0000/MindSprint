// global variable
var selectSubjectEl = document.querySelector("#select-subject-el");
var startQuizBtn = document.querySelector(".start-quiz-btn");
var brandCode = sessionStorage.getItem("brandCode");
var allSubject = [];
// reading subject from local storage

if(localStorage.getItem(brandCode+"_allSubject") != null){
    allSubject = JSON.parse(localStorage.getItem(brandCode+"_allSubject"));
    allSubject.forEach((subject,index)=>{
        selectSubjectEl.innerHTML +=`
        <option>${subject.subjectName}</option>
        `;
    })
}

startQuizBtn.onclick = function(){
    if(selectSubjectEl.value != "choose subject"){
        var subject = selectSubjectEl.value;
        sessionStorage.setItem("subject",subject);
        window.location = "../QuizPage/quiz.html"
    }else{
        swal("Select Subject !","please select subject first !","warning");
    }
}