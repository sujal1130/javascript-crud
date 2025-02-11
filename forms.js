document.addEventListener("DOMContentLoaded", function () {
  const cancelButton = document.getElementById("cancelButton");
  const form = document.querySelector(".form");
  const phoneInput = document.querySelector('input[type="number"]');

  // Cancel button functionality
  cancelButton.addEventListener("click", function (event) {
    event.preventDefault();
    form.reset();
  });

  // Phone number validation
  phoneInput.addEventListener("input", function () {
    let value = phoneInput.value.replace(/\D/g, "");
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    phoneInput.value = value;
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (phoneInput.value.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    }

    // Fetching form values correctly using querySelector
    const formData = {
      fullName: document.querySelector('input[placeholder="Enter full name"]').value.trim(),
      lastName: document.querySelectorAll('input[placeholder="Enter full name"]')[1].value.trim(),
      email: document.querySelector('input[placeholder="Enter email address"]').value.trim(),
      phone: phoneInput.value.trim(),
      birthDate: document.querySelector('input[type="date"]').value.trim(),
      gender: form.querySelector('input[name="gender"]:checked')?.value || "Not specified",
      address: document.querySelector('input[placeholder="Enter street address"]').value.trim(),
      country: document.querySelector('.select-box select').value.trim(),
      city: document.querySelector('input[placeholder="Enter your city"]').value.trim(),
    };

    // Store data in localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(formData);
    localStorage.setItem("users", JSON.stringify(users));

    // Redirect to index.html
    window.location.href = "index.html";
  });
});
