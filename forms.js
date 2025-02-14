document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  const cancelButton = document.getElementById("cancelButton");

  const getInputValue = (selector) =>
    form.querySelector(selector)?.value.trim() || "";
  const setInputValue = (selector, value) => {
    const input = form.querySelector(selector);
    if (input) input.value = value;
  };

  const getSelectedGender = () =>
    document.querySelector("input[name='gender']:checked")?.value || "";
  const setSelectedGender = (gender) => {
    const genderInput = form.querySelector(
      `input[name="gender"][value="${gender}"]`
    );
    if (genderInput) genderInput.checked = true;
  };

  // Load data if editing an existing user
  const editUserIndex = localStorage.getItem("editUserIndex");
  if (editUserIndex !== null) {
    const editUserData = JSON.parse(localStorage.getItem("editUserData"));
    if (editUserData) {
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

      // Set Country Selection
      const countrySelect = form.querySelector("select");
      if (countrySelect) {
        countrySelect.value = editUserData.country;
      }
    }
  }

  // Handle Form Submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();

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

    if (validateForm(formData)) {
      saveUserData(formData);
      alert(
        editUserIndex !== null
          ? "User Updated Successfully!"
          : "Registration Successful!"
      );
      localStorage.removeItem("editUserIndex");
      localStorage.removeItem("editUserData");
      form.reset();
      window.location.href = "index.html"; // Redirect to home page
    }
  });

  // Handle Cancel Button
  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("editUserIndex");
    localStorage.removeItem("editUserData");
    window.location.href = "index.html";
  });

  // Form Validation
  function validateForm(data) {
    if (Object.values(data).some((value) => !value)) {
      alert("Please fill in all required fields.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      alert("Invalid email format.");
      return false;
    }
    if (data.phone.length < 10) {
      alert("Phone number must be at least 10 digits.");
      return false;
    }
    return true;
  }

  // Save Data to Local Storage
  function saveUserData(data) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (editUserIndex !== null) {
      users[editUserIndex] = data;
    } else {
      users.push(data);
    }
    localStorage.setItem("users", JSON.stringify(users));
  }
});
