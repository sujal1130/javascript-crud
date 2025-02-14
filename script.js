document.addEventListener("DOMContentLoaded", () => {
  const userTable = document.getElementById("userTable"); // Get the table element to display user data
  const addButton = document.getElementById("addButton"); // Get the "Add User" button

  // Load user data when the page loads
  loadUserData();

  // Redirect to the form page when the "Add User" button is clicked
  addButton.addEventListener("click", () => {
    localStorage.removeItem("editUserIndex"); // Clear any stored edit index
    localStorage.removeItem("editUserData"); // Clear any stored edit user data
    window.location.href = "form.html"; // Navigate to the form page
  });

  // Function to load and display user data from local storage
  function loadUserData() {
    userTable.innerHTML = ""; // Clear the table before loading new data
    const users = JSON.parse(localStorage.getItem("users")) || []; // Get user data from local storage or initialize an empty array

    users.forEach((user, index) => {
      const row = document.createElement("tr"); // Create a new row for each user

      // Populate the row with user details
      row.innerHTML = `
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.birthDate}</td>
        <td>${user.gender}</td>
        <td>${user.address}</td>
        <td>${user.country}</td>
        <td>
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </td>
      `;

      userTable.appendChild(row); // Append the row to the table
    });

    // Attach event listeners to delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", deleteUser);
    });

    // Attach event listeners to edit buttons
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", editUser);
    });
  }

  // Function to delete a user from the list
  function deleteUser(event) {
    const index = event.target.getAttribute("data-index"); // Get the index of the user to be deleted
    let users = JSON.parse(localStorage.getItem("users")) || []; // Retrieve users from local storage

    // Ask for confirmation before deleting
    if (confirm("Are you sure you want to delete this user?")) {
      users.splice(index, 1); // Remove the user from the array
      localStorage.setItem("users", JSON.stringify(users)); // Update local storage
      loadUserData(); // Reload the table with updated data
    }
  }

  // Function to edit a user
  function editUser(event) {
    const index = event.target.getAttribute("data-index"); // Get the index of the user to be edited
    let users = JSON.parse(localStorage.getItem("users")) || []; // Retrieve users from local storage

    // Store the user data and index in local storage for editing
    localStorage.setItem("editUserIndex", index);
    localStorage.setItem("editUserData", JSON.stringify(users[index]));

    window.location.href = "form.html"; // Navigate to the form page for editing
  }
});
