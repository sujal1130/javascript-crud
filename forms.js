document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const cancelButton = document.getElementById("cancelButton");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let editIndex = localStorage.getItem("editIndex");

  // If editing, load existing user data into the form
  if (editIndex !== null) {
    editIndex = parseInt(editIndex);
    const user = users[editIndex];

    if (user) {
      document.getElementById("fullName").value = user.fullName;
      document.getElementById("lastName").value = user.lastName;
      document.getElementById("email").value = user.email;
      document.getElementById("phone").value = user.phone;
      document.getElementById("birthDate").value = user.birthDate;

      // Ensure gender field exists before setting value
      const genderInput = document.querySelector(
        `input[name="gender"][value="${user.gender}"]`
      );
      if (genderInput) genderInput.checked = true;

      document.getElementById("address").value = user.address;
      document.getElementById("country").value = user.country;
      document.getElementById("city").value = user.city;
    }
  }

  // Function to handle form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form refresh

    // Get form values
    const fullName = document.getElementById("fullName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const birthDate = document.getElementById("birthDate").value;
    const gender =
      document.querySelector("input[name='gender']:checked")?.value || "";
    const address = document.getElementById("address").value;
    const country = document.getElementById("country").value;
    const city = document.getElementById("city").value;

    // Validation
    if (
      !fullName ||
      !lastName ||
      !email ||
      !phone ||
      !birthDate ||
      !gender ||
      !address ||
      !country ||
      !city
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const user = {
      fullName,
      lastName,
      email,
      phone,
      birthDate,
      gender,
      address,
      country,
      city,
    };

    if (editIndex !== null) {
      // Update existing user
      users[editIndex] = user;
      localStorage.removeItem("editIndex"); // Remove edit flag
    } else {
      // Add new user
      users.push(user);
    }

    localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "index.html"; // Redirect back
  });

  // Cancel button functionality
  cancelButton.addEventListener("click", function () {
    localStorage.removeItem("editIndex"); // Remove edit flag
    window.location.href = "index.html"; // Redirect back
  });
});
