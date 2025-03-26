// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Form toggle buttons and boxes
    var signupBtn = document.querySelector(".signup-btn");
    var loginBtn = document.querySelector(".login-btn");
    var loginBox = document.querySelector(".login-box");
    var signupBox = document.querySelector(".signup-box");

    // Toggle between signup and login forms
    if (signupBtn && loginBtn) {
        signupBtn.onclick = function () {
            signupBox.classList.add("active");
            loginBox.classList.remove("active");
            signupBtn.classList.add("d-none");
            loginBtn.classList.remove("d-none");
        };

        loginBtn.onclick = function () {
            signupBox.classList.remove("active");
            loginBox.classList.add("active");
            loginBtn.classList.add("d-none");
            signupBtn.classList.remove("d-none");
        };
    } 

    // Signup form logic
    var registerForm = document.querySelector(".signup-form");

    if (registerForm) {
        // Select all required inputs by their unique IDs
        const brandCodeInput = registerForm.querySelector("#brand-code");
        const brandNameInput = registerForm.querySelector("#brand-name");
        const websiteInput = registerForm.querySelector("#website");
        const contactInput = registerForm.querySelector("#contact");
        const addressInput = registerForm.querySelector("#address");
        const usernameInput = registerForm.querySelector("#s-username");
        const passwordInput = registerForm.querySelector("#s-password");

        registerForm.onsubmit = function (e) {
            e.preventDefault();
            registrationData();
        };

        const registrationData = () => {
            const brandCode = brandCodeInput ? brandCodeInput.value.trim() : "";

            if (!brandCode) {
                swal("Error", "Brand Code is required.", "error");
                return;
            }

            // Check if the Brand Code is already taken
            if (!localStorage.getItem(brandCode + "_brandcode")) { // Added suffix here
                const userData = {
                    brandCode,
                    brandName: brandNameInput ? brandNameInput.value.trim() : "",
                    website: websiteInput ? websiteInput.value.trim() : "",
                    contact: contactInput ? contactInput.value.trim() : "",
                    address: addressInput ? addressInput.value.trim() : "",
                    username: usernameInput ? usernameInput.value.trim() : "",
                    password: passwordInput ? passwordInput.value.trim() : "",
                };

                // Save user data in localStorage
                localStorage.setItem(brandCode + "_brandcode", JSON.stringify(userData)); // Consistent key naming
                registerForm.reset(); // Clear form inputs
                swal("Registration Done!", "Thank you for Registration!", "success");
            } else {
                swal("Change Brand Code", "This Brand Code is already taken.", "error");
            }
        };
    } 

    // Signin form logic
    var signinBtn = document.querySelector(".signin-btn");
    var signinBrandCode = document.querySelector(".login-form #brand-code");
    var signinUsername = document.querySelector(".login-form #username");
    var signinPassword = document.querySelector(".login-form #password");

    if (signinBtn && signinBrandCode && signinUsername && signinPassword) {
        signinBtn.onclick = function (e) {
            e.preventDefault();
            const brandCode = signinBrandCode.value.trim();
            const username = signinUsername.value.trim();
            const password = signinPassword.value.trim();
        
            if (brandCode && username && password) {
                const storedUser = localStorage.getItem(brandCode + "_brandcode");
                console.log("Checking stored data:", storedUser); // Debugging line

                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    console.log("Parsed User Data:", userData); // Debugging line

                    if (userData.username === username && userData.password === password) {
                        signinBtn.innerHTML = "Please wait...";
                        setTimeout(function () {
                            swal("Login Successful!", "Welcome back!", "success")
                                .then(() => window.location.href = "../dashboard/dashboard.html");
                            
                            sessionStorage.setItem("brandCode", brandCode); // Corrected key
                        }, 2000);
                    } else {
                        swal("Login Failed!", "Incorrect Username or Password", "error");
                    }
                } else {
                    swal("Login Failed!", "Brand Code not found", "error");
                }
            } else {
                swal("Empty Field!", "Fill all the details correctly", "warning");
            }
        };
    }
});
