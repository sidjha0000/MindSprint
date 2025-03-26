var brandCode;
document.addEventListener("DOMContentLoaded", function () {
    brandCode = sessionStorage.getItem("brandCode"); // Match the key with homepage.js

    if (brandCode == null) {
        document.body.innerHTML = "";
        document.body.style.background = "white";
        swal("Unauthorized User!", "Please sign in to access the dashboard.", "warning");
        return;
    }

    const brandNameElement = document.getElementById("brand-name");
    brandNameElement.innerText = "Welcome " + brandCode;

    // Ensure that subjects are loaded from localStorage on page load
    const storedSubjects = localStorage.getItem(brandCode + "_allSubject");
    if (storedSubjects) {
        allSubject = JSON.parse(storedSubjects); // Parse the subjects if found
    }

    // Render the subjects on page load
    renderSubjects();

    // Populate the subject dropdown
    chooseSubjectFunc();
});


var logoutBtn = document.querySelector("#logout-btn");
if (logoutBtn) {
    logoutBtn.onclick = function () {
        this.innerHTML = "please wait...";
        logoutBtn.disabled = true;
        this.style.background = "#0a6524";
        setTimeout(function () {
            window.location = "../company/company.html";
            sessionStorage.removeItem("signinBrandCode");
        }, 2000);
    };
}

var visiblesubject = document.querySelector(".visible-subject");
var subjectBtn = document.querySelector(".subject-btn");
var subjectEl = document.querySelector(".subject");
var allSubject = [];

// Function to Add a New Subject
subjectBtn.onclick = function (e) {
    e.preventDefault();

    if (subjectEl.value.trim() !== "") {
        const newSubject = { subjectName: subjectEl.value.trim() };
        allSubject.push(newSubject); // Add new subject to the array

        // Save updated subjects to localStorage
        localStorage.setItem(brandCode + "_allSubject", JSON.stringify(allSubject));

        subjectEl.value = ""; // Clear the input field
        renderSubjects(); // Re-render subjects to include new subject
    } else {
        swal("Subject is empty!", "Please enter a subject", "warning");
    }
};

// Function to Render Subjects Dynamically
const renderSubjects = () => {
    visiblesubject.innerHTML = ""; // Clear previous subjects

    // Check if there are subjects to render
    if (allSubject.length > 0) {
        allSubject.forEach((subject, index) => {
            visiblesubject.innerHTML += `
            <div class="d-flex subject-box justify-content-between align-items-center">
                <h3>${subject.subjectName}</h3>
                <div>
                    <li class="fa fa-edit edit-btn mx-2" style="font-size: 22px;" data-index="${index}"></li>
                    <li class="fa fa-save save-btn mx-2 d-none" style="font-size: 22px;" data-index="${index}"></li>
                    <li class="fa fa-trash del-btn mx-2" style="font-size: 22px;" data-index="${index}"></li>
                </div>
            </div>
            `;
        });
    } else {
        visiblesubject.innerHTML = "<p>No subjects available.</p>"; // Display message if no subjects exist
    }

    // Add event listeners for edit and delete buttons after rendering
    addSubjectEventListeners();
};

// Function to Add Event Listeners for Edit and Delete Buttons
const addSubjectEventListeners = () => {
    const deleteButtons = document.querySelectorAll(".del-btn");
    const editButtons = document.querySelectorAll(".edit-btn");

    deleteButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            deleteSubject(index);
        });
    });

    editButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            editSubject(index);
        });
    });
};

// Function to Delete a Subject
const deleteSubject = (index) => {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this subject!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            allSubject.splice(index, 1); // Remove the subject from the array

            // Save updated subjects to localStorage
            localStorage.setItem(brandCode + "_allSubject", JSON.stringify(allSubject));

            renderSubjects(); // Re-render the updated subjects
            swal("Your subject has been deleted!", {
                icon: "success",
            });
        } else {
            swal("Your subject is safe!");
        }
    });
};

// Function to Edit a Subject
const editSubject = (index) => {
    const subjectBox = visiblesubject.querySelectorAll(".subject-box")[index];
    const h3 = subjectBox.querySelector("h3");
    const editBtn = subjectBox.querySelector(".edit-btn");
    const saveBtn = subjectBox.querySelector(".save-btn");

    h3.contentEditable = true;
    h3.focus();

    editBtn.classList.add("d-none");
    saveBtn.classList.remove("d-none");

    saveBtn.addEventListener("click", () => {
        h3.contentEditable = false;
        allSubject[index].subjectName = h3.textContent.trim(); // Update subject name

        // Save updated subjects to localStorage
        localStorage.setItem(brandCode + "_allSubject", JSON.stringify(allSubject));

        saveBtn.classList.add("d-none");
        editBtn.classList.remove("d-none");

        renderSubjects(); 

        swal("Success!", "Subject name has been updated!", "success");
    });
};

// Start return subject in Question form
var chooseSubject = document.querySelector("#choose-subject");
var questionForm = document.querySelector(".question-form");
var allQuesInput = questionForm.querySelectorAll("input"); // All question form inputs
var selectSubject = document.querySelector("#select-subject");
var subjectResultEl = document.querySelector("#subject-result-el");
var allQuestion = [];

questionForm.onsubmit = (e) => {
    e.preventDefault();
    insertQuestionFunc();
};

const chooseSubjectFunc = () => {
    chooseSubject.innerHTML = `<option value="choose subject">Choose Subject</option>`; // Default option

    if (localStorage.getItem(brandCode + "_allSubject")) {
        allSubject = JSON.parse(localStorage.getItem(brandCode + "_allSubject"));
    }
    if (allSubject.length > 0) {
        allSubject.forEach((subject) => {
            chooseSubject.innerHTML += `<option value="${subject.subjectName}">${subject.subjectName}</option>`;
            selectSubject.innerHTML += `<option value="${subject.subjectName}">${subject.subjectName}</option>`;
            subjectResultEl.innerHTML += `<option value="${subject.subjectName}">${subject.subjectName}</option>`;

        });
    }
};

function insertQuestionFunc(sub,id,question,opOne,opTwo,opThree,opFour,corAns) {
    if(sub != undefined && id != undefined){
        allQuestion[id] = {
            question: question,
            optionone: opOne,
            optiontwo: opTwo,
            optionthree: opThree,
            optionfour: opFour,
            answerAnswer: corAns
        }
        localStorage.setItem(brandCode+"_"+sub+"_question",JSON.stringify(allQuestion));
        swal("Success!", "Data Updated Successfully!", "success");
    }else{
        if (chooseSubject.value != "choose subject") {
            // Retrieve the current list of questions from localStorage
            let allQuestion = JSON.parse(localStorage.getItem(brandCode + "_" + chooseSubject.value + "_question")) || [];
    
            // Push the new question to the array
            allQuestion.push({
                question: allQuesInput[0].value,
                optionone: allQuesInput[1].value,
                optiontwo: allQuesInput[2].value,
                optionthree: allQuesInput[3].value,
                optionfour: allQuesInput[4].value,
                answerAnswer: allQuesInput[5].value
            });
    
            // Save the updated list of questions back to localStorage
            localStorage.setItem(brandCode + "_" + chooseSubject.value + "_question", JSON.stringify(allQuestion));
    
            // Clear input fields
            allQuesInput.forEach(input => input.value = "");
    
            swal("Success!", "Your question has been saved!", "success");
        } else {
            swal("Choose Subject!", "Please choose a subject", "warning");
        }
    }
    
}

// start returning question from local storage
var newQuestions = [];
var visibleQuestion = document.querySelector(".visible-question");
selectSubject.onchange = () => {
    if(localStorage.getItem(brandCode + "_" + selectSubject.value + "_question") != null) {
        newQuestions = JSON.parse(localStorage.getItem(brandCode + "_" + selectSubject.value + "_question"));
        visibleQuestion.innerHTML = ""; 
        newQuestionFunc();
    }else{
        visibleQuestion.innerHTML = "<b style = 'color: red'> No Data Found! </b>";
    }
}

const newQuestionFunc = () => {
    visibleQuestion.innerHTML = ""; // Clear the current questions before re-rendering

    newQuestions.forEach((question, index) => {
        visibleQuestion.innerHTML += `
        <div class="mb-5" data-index="${index}">
            <br>
            <div class="d-flex justify-content-between">
                <h3>${index + 1}) ${question.question}</h3>
                <div>
                    <i class="fa fa-pencil-alt Editbtn mx-3"></i>
                    <i class="fa fa-save Savebtn d-none mx-3"></i>
                    <i class="fa fa-trash-alt deletebtn mx-3"></i>
                </div>
            </div>
            <br>
            <div>
                <span>1) ${question.optionone}</span>
                <br><br>
                <span>2) ${question.optiontwo}</span>
                <br><br>
                <span>3) ${question.optionthree}</span>
                <br><br>
                <span>4) ${question.optionfour}</span>
                <br><br>
                <span class="bg-info text-white p-3">${question.answerAnswer}</span>
                <br><br>
            </div>
        </div>
        `;
    });

    // Delete functionality
    var allDelBtn = visibleQuestion.querySelectorAll(".deletebtn");
allDelBtn.forEach(delBtn => {
    delBtn.onclick = (e) => {
        let parent = e.target.closest('.mb-5');
        let index = parseInt(parent.getAttribute("data-index"), 10); // Ensure the index is an integer

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this question!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                newQuestions.splice(index, 1); // Remove the question from the array
                localStorage.setItem(brandCode + "_" + selectSubject.value + "_question", JSON.stringify(newQuestions));
                parent.remove();  // Remove the question div from the DOM
                swal("The question has been deleted!", {
                    icon: "success",
                });
            } else {
                swal("Your question is safe!");
            }
        });
    };
});


    // Edit functionality
    var allEditBtn = visibleQuestion.querySelectorAll(".Editbtn");
allEditBtn.forEach(editBtn => {
    editBtn.onclick = function () {
        let parent = this.closest('.mb-5');
        let index = parseInt(parent.getAttribute("data-index"), 10); // Ensure the index is an integer
        let saveBtn = parent.querySelector(".Savebtn");
        let h3 = parent.querySelector("h3");
        let span = parent.querySelectorAll("span");

        this.classList.add("d-none");
        saveBtn.classList.remove("d-none");

        h3.contentEditable = true;
        h3.focus();
        span.forEach(s => {
            s.contentEditable = true;
            s.style.border = "2px solid red";
        });

        saveBtn.onclick = function () {
            let question = h3.innerText.replace(`${index + 1})`, "").trim();
            let opOne = span[0].innerText.replace("1)", "").trim();
            let opTwo = span[1].innerText.replace("2)", "").trim();
            let opThree = span[2].innerText.replace("3)", "").trim();
            let opFour = span[3].innerText.replace("4)", "").trim();
            let corAns = span[4].innerText.trim();

            swal({
                title: "Are you sure?",
                text: "Once Updated, you will not be able to recover this Question!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willUpdate) => {
                if (willUpdate) {
                    // Update the question array and local storage
                    newQuestions[index] = {
                        question: question,
                        optionone: opOne,
                        optiontwo: opTwo,
                        optionthree: opThree,
                        optionfour: opFour,
                        answerAnswer: corAns
                    };

                    localStorage.setItem(brandCode + "_" + selectSubject.value + "_question", JSON.stringify(newQuestions));

                    // Re-render only the updated question rather than the entire list
                    parent.querySelector('h3').innerHTML = `${index + 1}) ${question}`;
                    parent.querySelectorAll('span')[0].innerHTML = `1) ${opOne}`;
                    parent.querySelectorAll('span')[1].innerHTML = `2) ${opTwo}`;
                    parent.querySelectorAll('span')[2].innerHTML = `3) ${opThree}`;
                    parent.querySelectorAll('span')[3].innerHTML = `4) ${opFour}`;
                    parent.querySelectorAll('span')[4].innerHTML = `${corAns}`;

                    // Hide save button and show edit button
                    editBtn.classList.remove("d-none");
                    saveBtn.classList.add("d-none");

                    h3.contentEditable = false;
                    span.forEach(s => {
                        s.contentEditable = false;
                        s.style.border = "none";
                    });

                    swal("The question has been updated!", {
                        icon: "success",
                    });
                } else {
                    swal("Your Question is not updated!");
                }
            });
        };
    };
});

};

// Registration function

// Ensure brandCode is defined before use, if not define it here
var brandCode = 'yourBrandCode'; // Set the actual brand code here

// Select the registration form elements
var registrationForm = document.querySelector(".registration-form");
var allRegInput = registrationForm.querySelectorAll("input");
var userType = registrationForm.querySelector("select");
var address = registrationForm.querySelector("textarea");
var registrationDataEl = document.querySelector(".registration-data");
var uploadInput = document.getElementById("upload-input"); // Ensure this is correctly defined
var modalImgUrl = '';  // To store uploaded image URL

// Retrieve the registration data from localStorage, or initialize as empty array if no data is found
var registrationData = JSON.parse(localStorage.getItem(brandCode + 'registrationData')) || [];

// Handle Register Button Click
document.querySelector("#registerBtn").onclick = function (e) {
    e.preventDefault();

    // Check if a user type is selected
    if (userType.value !== "choose type") {
        // Create a new registration object
        const newRegistration = {
            name: allRegInput[0].value,
            fatherName: allRegInput[1].value,
            dob: allRegInput[2].value,
            userType: userType.value,
            mobile: allRegInput[3].value,
            enrollment: allRegInput[4].value,
            password: allRegInput[5].value,
            address: address.value,
            profilePic: "../images/avtar.png"  // Placeholder image
        };

        // Push the new registration data to the array
        registrationData.push(newRegistration);

        // Store the updated data in localStorage
        localStorage.setItem(brandCode + 'registrationData', JSON.stringify(registrationData));

        // Show a success message
        swal("Data Inserted!", "Registration Done Successfully!", "success");

        // Optionally reset the form after submission
        registrationForm.reset();
        updateRegistrationTable();  // Refresh the table with updated data
    } else {
        swal("Choose Type!", "Please select a user type!", "warning");
    }
};

// Ensure the registration data is loaded when the page is refreshed
window.onload = () => {
    // Load the data from localStorage when the page is loaded (including after refresh)
    registrationData = JSON.parse(localStorage.getItem(brandCode + 'registrationData')) || [];
    updateRegistrationTable();  // Call the function to update the table
};

// Function to Update Registration Table with Data from localStorage
const updateRegistrationTable = () => {
    registrationDataEl.innerHTML = '';  // Clear Existing Data in Table

    // If there is no data, show a message or empty row (optional)
    if (registrationData.length === 0) {
        registrationDataEl.innerHTML = '<tr><td colspan="11">No data available</td></tr>';
    } else {
        // Loop through each registration data and display in the table
        registrationData.forEach((allData, index) => {
            const row = document.createElement('tr');
            row.setAttribute('data-index', index);
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="${allData.profilePic}" width="40" height="40" alt="Profile"></td>
                <td class="text-nowrap">${allData.name}</td>
                <td class="text-nowrap">${allData.fatherName}</td>
                <td class="text-nowrap">${allData.dob}</td>
                <td class="text-nowrap">${allData.userType}</td>
                <td class="text-nowrap">${allData.mobile}</td>
                <td class="text-nowrap">${allData.enrollment}</td>
                <td class="text-nowrap">${allData.password}</td>
                <td class="text-nowrap">${allData.address}</td>
                <td class="text-nowrap">
                    <i class="fa fa-trash del-user mx-3"></i>
                    <i class="fa fa-eye edit-user" data-bs-toggle="modal" data-bs-target="#myModal"></i>
                </td>
            `;
            registrationDataEl.appendChild(row);  // Add New Row to Table
        });
    }

    // Attach Delete and Edit Logic
    attachDeleteAndEditHandlers();
};

// Attach Delete and Edit Handlers
const attachDeleteAndEditHandlers = () => {
    const alldelBtn = registrationDataEl.querySelectorAll(".del-user");
    alldelBtn.forEach(btn => {
        btn.onclick = function () {
            var parent = this.closest('tr');
            var index = parent.getAttribute("data-index");
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this data!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    registrationData.splice(index, 1);  // Remove data from array
                    localStorage.setItem(brandCode + 'registrationData', JSON.stringify(registrationData));  // Update localStorage
                    parent.remove();  // Remove the row from the table
                    swal("Data has been deleted!", { icon: "success" });
                } else {
                    swal("Your data is safe!");
                }
            });
        };
    });

    const allEditBtn = registrationDataEl.querySelectorAll(".edit-user");
    allEditBtn.forEach((btn, index) => {
        btn.onclick = function () {
            openEditModal(index);
        };
    });
};

// Function to Open Edit Modal and Populate with Current Data (No Changes Here)
const openEditModal = (index) => {
    const currentData = registrationData[index];
    const modalInputs = document.querySelectorAll(".modal-form input");
    const modalTextarea = document.querySelector(".modal-form textarea");

    modalInputs[0].value = currentData.name;
    modalInputs[1].value = currentData.fatherName;
    modalInputs[2].value = currentData.dob;
    modalInputs[3].value = currentData.userType;
    modalInputs[4].value = currentData.mobile;
    modalInputs[5].value = currentData.enrollment;
    modalInputs[6].value = currentData.password;
    modalTextarea.value = currentData.address;

    const modalEditBtn = document.querySelector(".modal-edit");
    const modalUpdateBtn = document.querySelector(".modal-update-btn");
    const closeBtn = document.querySelector(".btn-close");

    // Disable inputs initially
    modalInputs.forEach(input => input.disabled = true);
    modalTextarea.disabled = true;
    uploadInput.disabled = true;

    // Set inert on the modal to prevent focus issues while disabled
    const modalForm = document.querySelector(".modal-form");
    modalForm.setAttribute('inert', 'true');

    modalEditBtn.onclick = function () {
        modalInputs.forEach(input => input.disabled = false);
        modalTextarea.disabled = false;
        uploadInput.disabled = false;
        modalEditBtn.classList.add("d-none");
        modalUpdateBtn.classList.remove("d-none");

        // Remove inert to allow interaction when editing
        modalForm.removeAttribute('inert');

        modalUpdateBtn.onclick = function () {
            const updatedData = {
                name: modalInputs[0].value,
                fatherName: modalInputs[1].value,
                dob: modalInputs[2].value,
                userType: modalInputs[3].value,
                mobile: modalInputs[4].value,
                enrollment: modalInputs[5].value,
                password: modalInputs[6].value,
                address: modalTextarea.value,
                profilePic: modalImgUrl || currentData.profilePic // Use the latest image if set
            };

            swal({
                title: "Are you sure?",
                text: "Once updated, you won't be able to revert this data!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willUpdate) => {
                if (willUpdate) {
                    registrationData[index] = updatedData;
                    localStorage.setItem(brandCode + 'registrationData', JSON.stringify(registrationData)); // Update localStorage
                    updateRegistrationTable();
                    this.classList.add("d-none");
                    modalEditBtn.classList.remove("d-none");
                    closeBtn.click();
                    swal("Data Updated Successfully!", { icon: "success" });
                } else {
                    swal("Your data is safe!");
                }
            });
        };
    };
};

// Handle Profile Image Upload
uploadInput.onchange = function () {
    var fReader = new FileReader();
    fReader.onload = function (e) {
        modalImgUrl = e.target.result;
        profileBox.style.backgroundImage = `url(${modalImgUrl})`;
        profileBox.querySelector("img").src = modalImgUrl;
    };
    fReader.readAsDataURL(uploadInput.files[0]);
};

// Handle Register Button Click
document.querySelector("#registerBtn").onclick = function (e) {
    e.preventDefault();

    // Check if a user type is selected
    if (userType.value !== "choose type") {
        // Create a new registration object
        const newRegistration = {
            name: allRegInput[0].value,
            fatherName: allRegInput[1].value,
            dob: allRegInput[2].value,
            userType: userType.value,
            mobile: allRegInput[3].value,
            enrollment: allRegInput[4].value,
            password: allRegInput[5].value,
            address: address.value,
            profilePic: "../images/avtar.png"  // Placeholder image
        };

        // Push the new registration data to the array
        registrationData.push(newRegistration);
        localStorage.setItem(brandCode + 'registrationData', JSON.stringify(registrationData));
        swal("Data Inserted!", "Registration Done Successfully!", "success");
        registrationForm.reset();
        updateRegistrationTable();
    } else {
        swal("Choose Type!", "Please select a user type!", "warning");
    }
};
updateRegistrationTable();

// Start toggler coding
document.addEventListener("DOMContentLoaded", () => {
    const togglerBox = document.querySelector(".toggler-box");
    const openIcon = document.querySelector(".open-icon");
    const closeIcon = document.querySelector(".close-icon");
    const sideNav = document.querySelector(".side-nav");

    // Check if elements exist
    if (!togglerBox || !openIcon || !closeIcon || !sideNav) {
        console.error("One or more elements not found. Check HTML structure.");
        return;
    }

    // Toggle sidebar function
    togglerBox.addEventListener("click", () => {
        const isActive = sideNav.classList.toggle("active");

        if (isActive) {
            openIcon.classList.add("d-none");
            closeIcon.classList.remove("d-none");
        } else {
            closeIcon.classList.add("d-none");
            openIcon.classList.remove("d-none");
        }
    });
});


// start get result coding from database
let allResult = [];
var allUserResultBox = document.querySelector(".subject-related-data");
subjectResultEl.addEventListener('change',()=>{
    allUserResultBox.innerHTML = "";
    if(subjectResultEl.value != "choose subject"){
        if(localStorage.getItem(brandCode+"_"+subjectResultEl.value+"_result")!= null){
            allResult = JSON.parse(localStorage.getItem(brandCode+"_"+subjectResultEl.value+"_result"));
            allResult.forEach((data,index)=>{
                allUserResultBox.innerHTML +=`
                <tr>
                    <td class="text-nowrap" style="width: 8rem;">${index+1}</td>
                    <td class="text-nowrap" style="width: 8rem;">${data.name}</td>
                    <td class="text-nowrap" style="width: 8rem;">${data.enrollment}</td>
                    <td class="text-nowrap" style="width: 8rem;">${data.subject}</td>
                    <td class="text-nowrap" style="width: 8rem;">${data.rightAns}</td>
                    <td class="text-nowrap" style="width: 8rem;">${data.wrongAns}</td>
                    <td class="text-nowrap" style="width: 8rem;">${data.maxMarks}</td>
                </tr>
                `;
            });
        }
    }else{
        swal("Select Subject!", "Please select subject first!", "warning");
    }
});

// start get certificate coding
let closeBtn = document.querySelector(".certificate-close-btn");
let certificateMainBox = document.querySelector(".certificate-main");
let certificateForm = document.querySelector(".certificate-form");
var cirInput = certificateForm.querySelector("input");
var cirBrandName = certificateMainBox.querySelector(".brand-name");
var cirAddress = certificateMainBox.querySelector(".brand-address");
var cirName = certificateMainBox.querySelector(".cir-name");
var cirEnrollment = certificateMainBox.querySelector(".cir-enrollment");
var cirFather = certificateMainBox.querySelector(".cir-father");
var cirData = certificateMainBox.querySelector(".cir-data");
var cirTotal = certificateMainBox.querySelectorAll(".cir-total");
var cirProfile = certificateMainBox.querySelector(".cir-profile");
var finalResultBox = certificateMainBox.querySelector(".final-result-box");
// getting result from DataBase
certificateForm.onsubmit = function(e){
    e.preventDefault();
    getUserResult();
}
const getUserResult = () =>{
     if(cirInput.value != ""){
        cirData.innerHTML = "";
        if(localStorage.getItem(brandCode+"_"+cirInput.value+"_result")!= null){
            var resultData = JSON.parse(localStorage.getItem(brandCode+"_"+cirInput.value+"_result")); 
            certificateMainBox.classList.add("active");
            cirName.innerHTML = resultData[0].name;
            cirEnrollment.innerHTML = resultData[0].enrollment;
            cirFather.innerHTML = resultData[0].fatherName;
            cirProfile.src = resultData[0].profilePic;
            let maxMarks = 0;
            let mark = 0;
            let total = 0;
            resultData.forEach((data,index)=>{
                cirData.innerHTML += `
                <tr>
                    <td>${index+1}</td>
                    <td>${data.subject}</td>
                    <td>${data.maxMarks}</td>
                    <td>${data.rightAns}</td>
                    <td>${data.rightAns}</td>
                </tr>
                `;

                maxMarks += data.maxMarks;
                mark += data.rightAns;
                total += data.rightAns;
            });
            cirTotal[0].innerHTML = maxMarks;
            cirTotal[1].innerHTML = mark;
            cirTotal[2].innerHTML = total;


            let finalResult = (total/maxMarks*100).toFixed(2);
            if(finalResult <=32.99){
                finalResultBox.innerHTML = "FAIL";
            }else{
                finalResult.innerHTML = "PASS";
            }
        }else{
            swal("No result Found!", "There is no result to show!", "warning");
        }
     }else{
        swal("Input Field is Empty!", "Please enter enrollment Key!", "warning");
     }
}


//closing modal coding
closeBtn.onclick = function(){
    certificateMainBox.classList.remove("active");
}

// portfolio coding
document.getElementById('portfolio-item').addEventListener('click', function() {
    window.location.href = '../Portfolio/index.html'; 
  });
// Home page
  document.getElementById('home-page').addEventListener('click', function() {
    window.location.href = '../homepage/homepage.html'; 
  });
// About-Us page
  document.getElementById('about-Us').addEventListener('click', function() {
    window.location.href = '../about/about.html'; 
  });

// developer page
document.getElementById('dev').addEventListener('click', function() {
    window.location.href = '../Developers/dev.html'; 
  });

// manual page
document.getElementById('manual').addEventListener('click', function() {
    window.location.href = '../Manual/manual.html'; 
  });
//sight info page
document.getElementById('info').addEventListener('click', function() {
    window.location.href = '../Info/info.html'; 
  });

// contact page
document.getElementById('contact').addEventListener('click', function() {
    window.location.href = '../contact/contact.html'; 
  });
