document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
<<<<<<< Updated upstream
  const phoneInput = document.querySelector('input[type="number"]');

  // Cancel button functionality
  if (cancelButton) {
    cancelButton.addEventListener("click", function (event) {
      event.preventDefault();
      form.reset();
    });
  }

  // Phone number validation
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      let value = phoneInput.value.replace(/\D/g, "");
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
      phoneInput.value = value;
    });
  }

  // Fetch stored users
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let editIndex = localStorage.getItem("editIndex");

=======
  const cancelButton = document.getElementById("cancelButton");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let editIndex = localStorage.getItem("editIndex");

  // If editing, load existing user data into the form
>>>>>>> Stashed changes
  if (editIndex !== null) {
    editIndex = parseInt(editIndex);
    const user = users[editIndex];

<<<<<<< Updated upstream
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

  // Form submit event
=======
    document.getElementById("fullName").value = user.fullName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phone;
    document.getElementById("birthDate").value = user.birthDate;
    document.querySelector(
      `input[name="gender"][value="${user.gender}"]`
    ).checked = true;
    document.getElementById("address").value = user.address;
    document.getElementById("country").value = user.country;
    document.getElementById("city").value = user.city;
  }

  // Function to handle form submission
>>>>>>> Stashed changes
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form refresh

<<<<<<< Updated upstream
    if (phoneInput.value.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    }

    const formData = {
      fullName: document
        .querySelector('input[placeholder="Enter full name"]')
        .value.trim(),
      lastName: document
        .querySelectorAll('input[placeholder="Enter full name"]')[1]
        .value.trim(),
      email: document
        .querySelector('input[placeholder="Enter email address"]')
        .value.trim(),
      phone: phoneInput.value.trim(),
      birthDate: document.querySelector('input[type="date"]').value.trim(),
      gender:
        form.querySelector('input[name="gender"]:checked')?.value ||
        "Not specified",
      address: document
        .querySelector('input[placeholder="Enter street address"]')
        .value.trim(),
      country: document.querySelector(".select-box select").value.trim(),
      city: document
        .querySelector('input[placeholder="Enter your city"]')
        .value.trim(),
    };

    if (editIndex !== null) {
      users[editIndex] = formData; // Update existing user
      localStorage.removeItem("editIndex");
    } else {
      users.push(formData); // Add new user
    }

    localStorage.setItem("users", JSON.stringify(users));
    // Redirect to index.html
    window.location.href = "index.html";
=======
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
>>>>>>> Stashed changes
  });
});
