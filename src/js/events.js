const eventsPerPage = 10;
let currentPage = 1;
let eventsData = [];

document.addEventListener("DOMContentLoaded", async (e) => {
    isLoggedIn();

    const response = await fetch(URL + "events", {method: 'GET'});

    const result = await response.json();

    if ( !result.status ) {
        showError(result.error);
        return;
    }

    eventsData = result.data;

    displayEvents();
});

// Función para ir a la página anterior
const previousPage = () => {
    if (currentPage > 1) {
        currentPage--;
        displayEvents();
    }
}

// Función para ir a la página siguiente
const nextPage = () => {
    const totalPages = Math.ceil(eventsData.length / eventsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayEvents();
    }
}


const displayEvents = () => {
    document.getElementById("table").innerHTML = "";
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const eventsToShow = eventsData.slice(startIndex, endIndex);

    let html = "";

    eventsToShow.map((event) => {
        html += `
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    ${event.title}
                </th>
                <td class="px-6 py-4">
                    ${event.location}
                </td>
                <td class="px-6 py-4">
                    ${event.type}
                </td>
                <td class="px-6 py-4">
                    ${event.start.split(" ")[0]} ${event.timeStart} - ${event.end.split(" ")[0]} ${event.timeEnd}
                </td>
                <td class="px-6 py-4 block lg:flex items-center justify-between">
                    <a href="edit-event.html?uuid=${event.uuid}" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    <a href="delete-event.html?uuid=${event.uuid}" class="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</a>
                </td>
            </tr>
        `;
    });

    if(eventsData.length === 0) {
        html = `
        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            No events created yet
        </tr>
    `
        
    }

    document.getElementById("table").innerHTML = html;
    document.getElementById('total').innerText = eventsData.length;
    document.getElementById('num1').innerText = startIndex + 1;
    document.getElementById('num2').innerText = endIndex;
}

document.getElementById("logout-button").addEventListener("click", (e) => {
    destroyToken();
    window.location.pathname = "/";
});

document.getElementById("prev").addEventListener("click", (e) => {
    previousPage();
});
document.getElementById("next").addEventListener("click", (e) => {
    nextPage();
});

document.getElementById("default-search").addEventListener("change", async (e) => {
    let url = URL + "events/search/" + e.target.value;

    if (!e.target.value) {
        url = URL + "events"
    }

    const response = await fetch(url, {method: 'GET'});

    const result = await response.json();

    if ( !result.status ) {
        showError(result.error);
        return;
    }

    eventsData = result.data;

    displayEvents();
    return;
});