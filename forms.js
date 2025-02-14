document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form"); // Select the form element
  const cancelButton = document.getElementById("cancelButton"); // Select the cancel button

  // Function to get the value of an input field based on a selector
  const getInputValue = (selector) =>
    form.querySelector(selector)?.value.trim() || "";

  // Function to set the value of an input field
  const setInputValue = (selector, value) => {
    const input = form.querySelector(selector);
    if (input) input.value = value;
  };

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

      // Show appropriate success message
      alert(
        editUserIndex !== null
          ? "User Updated Successfully!"
          : "Registration Successful!"
      );

      // Clear stored editing data
      localStorage.removeItem("editUserIndex");
      localStorage.removeItem("editUserData");

      // Reset the form and redirect to the homepage
      form.reset();
      window.location.href = "index.html";
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
    // Check if any field is empty
    if (Object.values(data).some((value) => !value)) {
      alert("Please fill in all required fields.");
      return false;
    }
    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      alert("Invalid email format.");
      return false;
    }
    // Ensure phone number is at least 10 digits
    if (data.phone.length < 10) {
      alert("Phone number must be at least 10 digits.");
      return false;
    }
    return true; // Return true if validation passes
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
