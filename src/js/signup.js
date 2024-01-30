document.addEventListener("DOMContentLoaded", async (e) => {
    const response = await fetch(URL + "auth/firstUser", {method: "GET"});

    const result = await response.json();

    if ( result.verify && result.status ) {
        window.location.pathname = "/";
    }
});

document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();

    if (document.getElementById("password1").value !== document.getElementById("password2").value) {
        showError("Passwords don't match");
        return;
    }

    const body = JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password1").value
    })

    const response = await fetch(URL + "auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    });

    const result = await response.json();

    if ( !result.status ) {
        showError(result.error);
        return;
    }

    window.location.pathname = "/";
})