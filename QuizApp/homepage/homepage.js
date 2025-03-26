var allBrandKey = [];
for (var i = 0; i < localStorage.length; i++) {
    var allKeys = localStorage.key(i);
    if (allKeys.match("_brandcode")) {
        allBrandKey.push(allKeys.replace("_brandcode", ""));
    }
}

var brandCodeEl = document.querySelector("#brand-code-el");
allBrandKey.forEach((code) => {
    brandCodeEl.innerHTML += `
        <option value="${code}">${code}</option>
    `;
});

// Start login coding
var loginForm = document.querySelector(".login-form");
var allLoginInput = loginForm.querySelectorAll("input");
var loginBtn = loginForm.querySelector("button");
var brandCode;
var allUserData = [];

brandCodeEl.addEventListener('change', () => {
    if (brandCodeEl.value != "choose space code") {
        sessionStorage.setItem("brandCode", brandCodeEl.value);
        allLoginInput[0].disabled = false;
        allLoginInput[1].disabled = false;
        loginBtn.disabled = false;
        brandCode = sessionStorage.getItem("brandCode");
        loginUserFunc();
    } else {
        allLoginInput[0].disabled = true;
        allLoginInput[1].disabled = true;
        loginBtn.disabled = true;
        swal("Please Select Brand!", "Please select brand code First!", "warning");
    }
});

const loginUserFunc = () => {
    if (localStorage.getItem(brandCode + "registrationData") != null) {
        allUserData = JSON.parse(localStorage.getItem(brandCode + "registrationData"));
    }
    console.log(allUserData);
    loginForm.onsubmit = function (e) {
        e.preventDefault();

        const username = allLoginInput[0].value; 
        const password = allLoginInput[1].value;  

        let loginSuccess = false;
        for (let i = 0; i < allUserData.length; i++) {
            const user = allUserData[i];

            if (user.enrollment == username && user.password == password) {
                loginSuccess = true;
                if(allUserData[i].userType == "teacher"){
                    sessionStorage.setItem("brandCode",brandCode);
                    window.location = "../dashboard/dashboard.html";
                } else{
                    sessionStorage.setItem("enrollment",allUserData[i].enrollment);
                    sessionStorage.setItem("name",allUserData[i].name);
                    sessionStorage.setItem("address",allUserData[i].address);
                    sessionStorage.setItem("fatherName",allUserData[i].fatherName);
                    sessionStorage.setItem("brandCode",brandCode);
                    sessionStorage.setItem("imgUrl",allUserData[i].profilePic);
                    window.location = "../welcome/welcome.html";
                    }
                break;
            }
        }
        if (!loginSuccess) {
            swal("Invalid Credentials!", "Username or password is incorrect. Contact your teacher!", "error");
        }
    };
};
