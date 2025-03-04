document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form"); // Select the form element
  const cancelButton = document.getElementById("cancelButton"); // Select the cancel button
  const notification = document.getElementById("notification"); // Select the toast notification element

  // Function to show toast notification
  const showToast = (message, type = "success") => {
    notification.textContent = message;
    notification.className = `toast ${type}`;
    notification.style.display = "block";

    setTimeout(() => {
      notification.style.display = "none";
    }, 7000);
  };

  // Function to get the value of an input field based on a selector
  const getInputValue = (selector) =>
    form.querySelector(selector)?.value.trim() || "";

  // Function to set the value of an input field
  const setInputValue = (selector, value) => {
    const input = form.querySelector(selector);
    if (input) input.value = value;
  };

  const phoneInput = form.querySelector(
    "input[placeholder='Enter phone number']"
  );
  if (phoneInput) {
    phoneInput.addEventListener("input", (event) => {
      // Allow only digits in the phone number field
      event.target.value = event.target.value.replace(/\D/g, "");
    });
  }
  // Function to get the selected gender radio button value
  const getSelectedGender = () =>
    document.querySelector("input[name='gender']:checked")?.value || "";

  // Function to set the selected gender radio button
  const setSelectedGender = (gender) => {
    const genderInput = form.querySelector(
      `input[name="gender"][value="${gender}"]`
    );
    if (genderInput) genderInput.checked = true;
  };

  // Check if user is editing an existing entry
  const editUserIndex = localStorage.getItem("editUserIndex");
  if (editUserIndex !== null) {
    const editUserData = JSON.parse(localStorage.getItem("editUserData"));
    if (editUserData) {
      // Populate form fields with existing user data
      setInputValue(
        "input[placeholder='Enter first name']",
        editUserData.firstName
      );
      setInputValue(
        "input[placeholder='Enter last name']",
        editUserData.lastName
      );
      setInputValue(
        "input[placeholder='Enter email address']",
        editUserData.email
      );
      setInputValue(
        "input[placeholder='Enter phone number']",
        editUserData.phone
      );
      setInputValue("input[type='date']", editUserData.birthDate);
      setSelectedGender(editUserData.gender);
      setInputValue(
        "input[placeholder='Enter street address']",
        editUserData.address
      );

      // Set selected country
      const countrySelect = form.querySelector("select");
      if (countrySelect) {
        countrySelect.value = editUserData.country;
      }
    }
  }

  // Handle Form Submission
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission

    // Collect form data into an object
    const formData = {
      firstName: getInputValue("input[placeholder='Enter first name']"),
      lastName: getInputValue("input[placeholder='Enter last name']"),
      email: getInputValue("input[placeholder='Enter email address']"),
      phone: getInputValue("input[placeholder='Enter phone number']"),
      birthDate: getInputValue("input[type='date']"),
      gender: getSelectedGender(),
      address: getInputValue("input[placeholder='Enter street address']"),
      country: form.querySelector("select")?.value || "",
    };

    // Validate form data before proceeding
    if (validateForm(formData)) {
      saveUserData(formData); // Save data to local storage

      // Show appropriate success message using toast
      showToast(
        editUserIndex !== null
          ? "User updated successfully!"
          : "Registration successful!",
        "success"
      );

      // Clear stored editing data
      localStorage.removeItem("editUserIndex");
      localStorage.removeItem("editUserData");

      // Reset the form and redirect to the homepage after delay
      setTimeout(() => {
        form.reset();
        window.location.href = "index.html";
      }, 2000);
    }
  });

  // Handle Cancel Button Click
  cancelButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default action
    localStorage.removeItem("editUserIndex"); // Remove editing index
    localStorage.removeItem("editUserData"); // Remove editing data
    window.location.href = "index.html"; // Redirect to home page
  });

  // Form Validation Function
  function validateForm(data) {
    // Trim all string values to remove extra spaces
    for (const key in data) {
      if (typeof data[key] === "string") {
        data[key] = data[key].trim();
      }
    }

    // Field-wise validation
    if (!data.firstName) {
      showToast("First Name is required.", "error");
      return false;
    }

    if (!data.lastName) {
      showToast("Last Name is required.", "error");
      return false;
    }

    if (!data.email) {
      showToast("Email Address is required.", "error");
      return false;
    }

    // Validate email format (stricter regex)
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
      showToast("Invalid email format. Example: example@gmail.com", "error");
      return false;
    }

    if (!data.phone) {
      showToast("Phone Number is required.", "error");
      return false;
    }

    // Ensure phone number contains only digits and is exactly 10 characters
    if (!/^\d{10}$/.test(data.phone)) {
      showToast("Phone number must be exactly 10 digits.", "error");
      return false;
    }

    if (!data.birthDate) {
      showToast("Birth Date is required.", "error");
      return false;
    }

    if (!data.gender) {
      showToast("Gender is required.", "error");
      return false;
    }

    if (!data.address) {
      showToast("Address is required.", "error");
      return false;
    }

    // Validate address (minimum 5 characters)
    if (data.address.length < 5) {
      showToast(
        "Please enter a valid address (minimum 5 characters).",
        "error"
      );
      return false;
    }

    if (Object.values(data).some((value) => !value)) {
      showToast("Country is required.", "error");
      return false;
    }

    return true; // Return true if all validations pass
  }

  // Function to Save User Data in Local Storage
  function saveUserData(data) {
    let users = JSON.parse(localStorage.getItem("users")) || []; // Get existing users
    if (editUserIndex !== null) {
      users[editUserIndex] = data; // Update existing user
    } else {
      users.push(data); // Add new user
    }
    localStorage.setItem("users", JSON.stringify(users)); // Store updated users list
  }
});
