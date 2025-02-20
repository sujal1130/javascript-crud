document.addEventListener("DOMContentLoaded", function () {
  const cancelButton = document.getElementById("cancelButton");
  const form = document.querySelector(".form");
  const phoneInput = document.querySelector('input[type="number"]');

  // Cancel button functionality
  cancelButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default behavior
    form.reset(); // Reset form fields
  });

  // Phone number validation
  phoneInput.addEventListener("input", function () {
    let value = phoneInput.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length > 10) {
      value = value.slice(0, 10); // Restrict to 10 digits
    }
    phoneInput.value = value; // Set the cleaned value
  });

  form.addEventListener("submit", function (event) {
    if (phoneInput.value.length !== 10) {
      event.preventDefault(); // Prevent form submission
    }
  });
});
