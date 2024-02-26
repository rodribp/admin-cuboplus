var imgDeletedArray = [];
var chargedImages = [];
var imagesToUpload = [];
var uploadedImages = [];
const uploadButton = document.getElementById('uploadButton');
const checkbox = document.getElementById('checkbox-single-date');
const startDateInput = document.getElementById('date-start');
const endDateInput = document.getElementById('date-end');
const elementoOculto = document.getElementById('date2');
const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get("uuid");

const fillFields = (data) => {
  let html = "";

    const dateStart = new Date(data.start).toISOString().split("T")[0];
    const dateEnd = new Date(data.end).toISOString().split("T")[0];


    if (dateStart === dateEnd) {
        document.getElementById("date-start").value = dateStart;
        checkbox.checked = true;
        elementoOculto.hidden = true;
    } else {
        document.getElementById("date-start").value = dateStart;
        document.getElementById("date-end").value = dateEnd;
    }

    document.getElementById("title").value = data.title;
    document.getElementById("location").value = data.location;
    document.getElementById("time-start").value = data.timeStart;
    document.getElementById("time-end").value = data.timeEnd;
    document.getElementById("url").value = data.eventUrl;
    document.getElementById("type").value = data.type;
    document.getElementById("description").value = data.description;

    chargedImages = data.files;
    generateImagePreviews(chargedImages, uploadedImages);
}

document.addEventListener('DOMContentLoaded', async function () {

  isLoggedIn();

    const response = await fetch(URL + "events/" + uuid, {
        method: "GET"
    });

    const result = await response.json();

    if (result.status) fillFields(result.data);

    startDateInput.addEventListener('input', function () {
      // Clear error message if exists
      clearError();

      // Get the dates as Date objects
      const startDate = new Date(startDateInput.value + 'T00:00:00');
      const endDate = new Date(endDateInput.value + 'T00:00:00');
      const dateToday = new Date();

      dateToday.setHours(0, 0, 0, 0);

      // Verify if the starting date is more than the current date
      if (startDate < dateToday) {
        // Shows message error
        showError("The starting date can't be less than the current date");
        // Clear starting date input
        startDateInput.value = '';
      }

      // Verify if the starting date is less than the ending date
      if (startDate > endDate) {
        // Shows an error message
        showError("The starting date can't be more than the ending date");
        // Clears the starting date input
        startDateInput.value = '';
      }
    });

    endDateInput.addEventListener('input', function () {
      // Clears error if exists
      clearError();

      // Getting the dates in Date objects
      const startDate = new Date(startDateInput.value + 'T00:00:00');
      const endDate = new Date(endDateInput.value + 'T00:00:00');
      const dateToday = new Date();

      dateToday.setHours(0, 0, 0, 0);

      // Verify if the ending date of the event is more than the current date
      if (endDate < dateToday) {
        // Shows an error message
        showError("The ending date can't less than the current date");
        // Clears ending date input
        endDateInput.value = '';
      }

      // Verify if the ending date is more than the starting date
      if (startDate > endDate) {
        // Shows an error message
        showError("The ending date can't be less than the starting date");
        // Clears ending date input
        endDateInput.value = '';
      }
    });


      checkbox.addEventListener('change', function () {
        // Changes the property hidden of the element depending by the checkbox
        elementoOculto.hidden = checkbox.checked;
      });
  });

function handleImagePreview(id) {
  let html = "";
  let element = document.getElementById(id);

  const file = element.files[0];
  //clears error if exists
  clearError();

  if (file) {
      // Verifies the type and size of the file
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10 MB

      if (isValidType && isValidSize) {
          const reader = new FileReader();

          reader.onload = function (e) {
              // Agrega la imagen al array de imágenes cargadas
              uploadedImages.push(e.target.result);
              imagesToUpload.push(file);

              // Genera las vistas previas para todas las imágenes cargadas
              
              chargedImages.forEach((imageUrl, index) => {
                if (URL !== null && imageUrl !== null ) {
                  html += `<div class="block w-48 align-middle">
                  <img src="${URL + "img/events/" + imageUrl}">
                  <button type="button" onclick="deleteSvImage(${index})" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"><svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6m0 12L6 6"/>
                    </svg>
                  </button>
              </div>`;
          
                }
              });

              uploadedImages.forEach((imageUrl, index) => {
                html += `<div class="block w-48 align-middle">
                    <img src="${imageUrl}">
                    <button type="button" onclick="deleteImage(${index})" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"><svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6m0 12L6 6"/>
                      </svg>
                    </button>
                </div>`;
            });

              // If 10 images haven't been uploaded, add a new input to add more
              if (chargedImages.length + uploadedImages.length < 10) {
                  html += `<div class="flex items-center justify-center w-48">
                      <label for="image${chargedImages.length}" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                          <div class="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                              </svg>
                              
                              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span></p>
                              <p class="text-xs text-gray-500 dark:text-gray-400">JPG, PNG or WEBP (MAX. 10MB)</p>
                          </div>
                          <input id="image${chargedImages.length}" onchange="handleImagePreview('image${chargedImages.length}')" accept="image/jpeg, image/jpg, image/png, image/webp" type="file" class="hidden" />
                      </label>
                  </div>`;
              }

              document.getElementById("gallery").innerHTML = html;
          };

          reader.readAsDataURL(file);
          uploadButton.disabled = false;
      } else {
          // Shows an error message
          showError('Please select a valid format image (JPEG, PNG o WebP) weight less than 10MB.');
          imageInput.value = ''; // Clears the input
          uploadButton.disabled = true;
      }
  }
}

function generateImagePreviews(svFiles, files) {
  let html = "";
  // Genera las vistas previas para todas las imágenes cargadas
  svFiles.forEach((file, index) =>  {
    if(file !== null){
      html += `
      <div class="block w-48 relative">
        <img src="${URL + "img/events/" + file}">
        <button type="button" onclick="deleteSvImage(${index})" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"><svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6m0 12L6 6"/>
            </svg>
        </button>
    </div>`;
    }
    
  });

  files.forEach((file, index) =>  {
    if (file !== null) {
      html += `
              <div class="block w-48 relative">
                <img src="${file}">

                <button type="button" onclick="deleteImage(${index})" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"><svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6m0 12L6 6"/>
                    </svg>
                </button>
            </div>`;
    }
      
  });

  // Si aún no se han agregado 10 imágenes, agrega un nuevo input para cargar otra imagen
  if (svFiles.length + files.length < 10) {
      html += `<div class="flex items-center justify-center w-48">
          <label for="image${files.length}" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                  </svg>
                  
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span></p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">JPG, PNG or WEBP (MAX. 10MB)</p>
              </div>
              <input id="image${files.length}" onchange="handleImagePreview('image${files.length}')" accept="image/jpeg, image/jpg, image/png, image/webp" type="file" class="hidden" />
          </label>
      </div>`;
  }

  document.getElementById("gallery").innerHTML = html;
}

function deleteImage(index) {
  uploadedImages.splice(index, 1);
  imagesToUpload.splice(index, 1); // Deletes image from the array
  generateImagePreviews(chargedImages, uploadedImages); // Regenerates previews
}

function deleteSvImage(index) {
  imgDeletedArray.push(index);
  chargedImages.splice(index, 1, null);
  generateImagePreviews(chargedImages, uploadedImages); // Regenerates previews
}

document.querySelector("#submit-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const dateStart = startDateInput.value + " 00:00";
  const dateEnd = endDateInput.value + " 00:00";

  let event = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    location: document.getElementById("location").value,
    start: dateStart,
    timeStart: document.getElementById("time-start").value,
    end: dateEnd,
    timeEnd: document.getElementById("time-end").value,
    type: document.getElementById("type").value,
    eventUrl: document.getElementById("url").value
  }


  if (checkbox.checked) {
    event.end = startDateInput.value + " 00:00";
  }

  const formData = new FormData();
  imagesToUpload.forEach((image) => {
    formData.append('image', image);
  });

  imgDeletedArray.forEach((indicator) => {
    formData.append('deleteIndicator', indicator);
  })


  for (key in event) {
    formData.append(key, event[key]);
  }

  try{
      const response = await fetch(URL + "events/" + uuid, {
        method: "PUT",
        headers: {
          "x-access-token": getToken()
        },
        body: formData
      });

      const result = await response.json();

      if (result.status) { 
        window.location.href = "events.html";
        return;
      }

      showError(result.error);
  } catch (err) {
    console.error(err);
  }
});

document.getElementById("time-start").addEventListener("input", (e) => {
  //clears error if exists
  clearError();

  //getting values and validating if starting time is less than ending
  const timeStart = e.target.value;
  const timeEnd = document.getElementById("time-end").value;

  if ( timeStart > timeEnd && timeEnd.length ) {
    showError("Ending time can't be more than the starting time");
    e.target.value = "";
  } 
});

document.getElementById("time-end").addEventListener("input", (e) => {
  //clears error if exists
  clearError();

  //getting values and validating if starting time is less than ending
  const timeEnd = e.target.value;
  const timeStart = document.getElementById("time-start").value;

  if ( timeStart > timeEnd ) {
    showError("Ending time can't be more than the starting time");
    e.target.value = "";
  } 
});