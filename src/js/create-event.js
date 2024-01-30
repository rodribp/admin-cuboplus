const imageInput = document.getElementById('image');
const previewImage = document.getElementById('preview');
const uploadButton = document.getElementById('uploadButton');
const checkbox = document.getElementById('checkbox-single-date');
const startDateInput = document.getElementById('date-start');
const endDateInput = document.getElementById('date-end');

document.addEventListener('DOMContentLoaded', function () {
  isLoggedIn();

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

    const elementoOculto = document.getElementById('date2');

      checkbox.addEventListener('change', function () {
        // Changes the property hidden of the element depending by the checkbox
        elementoOculto.hidden = checkbox.checked;
      });
  });

imageInput.addEventListener('change', handleImagePreview);

function handleImagePreview() {
    const file = imageInput.files[0];
    //clears error if exists
    clearError();

    if (file) {
        // Verifies the type and size of the file
        const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10 MB

        if (isValidType && isValidSize) {
          const reader = new FileReader();

          reader.onload = function (e) {
            previewImage.src = e.target.result;
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
  formData.append('image', document.getElementById("image").files[0]);

  for (key in event) {
    formData.append(key, event[key]);
  }

  try{
      const response = await fetch(URL + "events", {
        method: "POST",
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