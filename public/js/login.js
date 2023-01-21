async function loginFormHandler(event) {
    event.preventDefault();

  // Collect values from the login form
const email = document.querySelector("#email-login").value.trim();
const password = document.querySelector("#password-login").value.trim();

    if (email && password) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // If successful, redirect the browser to the dashboard page
        console.log("logged in");
        document.location.replace("/dashboard");
    } else {
        alert(response.statusText);
        }
    }
};

async function signupFormHandler(event) {
    event.preventDefault();

const username = document.querySelector("#username-register").value.trim();
const email = document.querySelector("#email-register").value.trim();
const password = document.querySelector("#password-register").value.trim();

if (username && email && password) {
    const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
        console.log("signed up");
        document.location.replace("/dashboard");
    } else {
        alert(response.statusText);
        }
    }
};

document
    .querySelector(".login-form")
    .addEventListener("submit", loginFormHandler);

document
    .querySelector(".register-form")
    .addEventListener("submit", signupFormHandler);
