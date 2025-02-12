document.addEventListener("DOMContentLoaded", function () {
  const cancelButton = document.getElementById("cancelButton");
  const form = document.querySelector(".form");
  const phoneInput = document.querySelector('input[type="number"]');
  const submitButton = document.querySelector('button[type="submit"]');

  if (!form || !submitButton) return; // Ensure form and button exist

  // Function to display error message
  function showError(input, message) {
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains("error-message")) {
      errorElement = document.createElement("span");
      errorElement.classList.add("error-message");
      input.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  // Function to clear error message
  function clearError(input) {
    let errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
      errorElement.textContent = "";
    }
  }

  // Function to validate phone number
  function validatePhoneNumber() {
    let value = phoneInput.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    phoneInput.value = value;
  }

  // Cancel button functionality
  if (cancelButton) {
    cancelButton.addEventListener("click", function (event) {
      event.preventDefault();
      form.reset();
      document
        .querySelectorAll(".error-message")
        .forEach((el) => (el.textContent = ""));
    });
  }

  // Attach event listener to phone input
  if (phoneInput) {
    phoneInput.addEventListener("input", validatePhoneNumber);
  }

  // Fetch stored users from local storage
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let editIndex = localStorage.getItem("editIndex");

  // If editing an existing user, prefill the form
  if (editIndex !== null) {
    editIndex = parseInt(editIndex);
    const user = users[editIndex];
    if (user) {
      document.querySelector('input[placeholder="Enter full name"]').value =
        user.fullName;
      document.querySelectorAll(
        'input[placeholder="Enter full name"]'
      )[1].value = user.lastName;
      document.querySelector('input[placeholder="Enter email address"]').value =
        user.email;
      phoneInput.value = user.phone;
      document.querySelector('input[type="date"]').value = user.birthDate;
      document
        .querySelector(`input[name="gender"][value="${user.gender}"]`)
        ?.setAttribute("checked", "checked");
      document.querySelector(
        'input[placeholder="Enter street address"]'
      ).value = user.address;
      document.querySelector(".select-box select").value = user.country;
      document.querySelector('input[placeholder="Enter your city"]').value =
        user.city;
    }
  }

  // Form submission validation and processing
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;
    const requiredFields = [
      {
        input: document.querySelector('input[placeholder="Enter full name"]'),
        message: "Full name is required",
      },
      {
        input: document.querySelectorAll(
          'input[placeholder="Enter full name"]'
        )[1],
        message: "Last name is required",
      },
      {
        input: document.querySelector(
          'input[placeholder="Enter email address"]'
        ),
        message: "Enter a valid email address",
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      },
      {
        input: phoneInput,
        message: "Phone number must be 10 digits",
        validate: (value) => value.length === 10,
      },
      {
        input: document.querySelector('input[type="date"]'),
        message: "Birth date is required",
      },
      {
        input: document.querySelector('input[name="gender"]:checked'),
        message: "Please select a gender",
        isOptional: true,
      },
      {
        input: document.querySelector(
          'input[placeholder="Enter street address"]'
        ),
        message: "Street address is required",
      },
      {
        input: document.querySelector(".select-box select"),
        message: "Please select a country",
      },
      {
        input: document.querySelector('input[placeholder="Enter your city"]'),
        message: "City is required",
      },
    ];

    // Validate required fields
    requiredFields.forEach(({ input, message, validate, isOptional }) => {
      if (!input || !input.value.trim()) {
        if (!isOptional) {
          showError(input, message);
          isValid = false;
        }
      } else if (validate && !validate(input.value.trim())) {
        showError(input, message);
        isValid = false;
      } else {
        clearError(input);
      }
    });

    if (!isValid) return;

    // Collect form data
    const formData = Object.fromEntries(new FormData(form).entries());

    // Update or save user data
    if (editIndex !== null) {
      users[editIndex] = formData;
      localStorage.removeItem("editIndex");
    } else {
      users.push(formData);
    }

    localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "index.html"; // Redirect after submission
  });
});
