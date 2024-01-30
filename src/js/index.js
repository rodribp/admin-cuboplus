document.addEventListener("DOMContentLoaded", async (e) => {
    const response = await fetch(URL + "auth/firstUser", {method: "GET"});

    const result = await response.json();

    if ( result.verify && !result.status ) {
        window.location.pathname = "/pages/signup.html";
        return;
    }
    
    isNotLoggedIn();
});

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    });

    const response = await fetch(URL + "auth/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: form
    })

    const result = await response.json();

    if (!result.status) {
        showError(result.error);
        return;
    }

    saveToken(result.data.token);

    window.location.href = "pages/events.html";
});