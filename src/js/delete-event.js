const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get("uuid");

document.addEventListener("DOMContentLoaded", async (e) => {
    isLoggedIn();
    try{
        const response = await fetch(URL + "events/" + uuid, {method: "GET"});

        const result = await response.json();

        if (!result.status) {
            return;
        }

        fillInfo(result.data);
    } catch (err) {
        
    }
});

const fillInfo = (data) => {
    document.getElementById("title").innerText = data.title;
    document.getElementById("location").innerText = data.location;
    document.getElementById("description").innerText = data.description || "None";
    document.getElementById("date").innerText = data.start + " " + data.timeStart + " - " + data.end + " " + data.timeEnd;
    document.getElementById("type").innerText = data.type;
    document.getElementById("url").innerText = data.eventUrl || "None";
    document.getElementById("url").href = data.eventUrl || "#";
    document.getElementById("image").src = URL + "img/events/" + data.fileName;
}

document.getElementById("delete-button").addEventListener("click", async (e) => {
    clearError();

    try {
        const response = await fetch(URL + "events/" + uuid, {
            method: "DELETE",
            headers: {
                "x-access-token": getToken()       
            }
        });

        const result = await response.json();

        if ( !result.status ) {
            showError(result.error);
            return;
        } 

        window.location.pathname = "/pages/events.html";
    } catch (err) {

    }
});