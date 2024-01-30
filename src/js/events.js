document.addEventListener("DOMContentLoaded", async (e) => {
    isLoggedIn();

    const response = await fetch(URL + "events", {method: 'GET'});

    const result = await response.json();

    if ( !result.status ) {
        showError(result.error);
        return;
    }

    fillTable(result.data);
});

const fillTable = (data) => {
    let html = "";

    data.map((event) => {
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

    if(data.length === 0) {
        html = `
        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            No events created yet
        </tr>
    `
    }


    document.getElementById("table").innerHTML = html;
}

document.getElementById("logout-button").addEventListener("click", (e) => {
    destroyToken();
    window.location.pathname = "/";
});