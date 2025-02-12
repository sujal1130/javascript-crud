document.addEventListener("DOMContentLoaded", function () {
  const cancelButton = document.getElementById("cancelButton");
  const form = document.querySelector(".form");
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

  // Form submit event
  form.addEventListener("submit", function (event) {
    event.preventDefault();

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
  });
});
