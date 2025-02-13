document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.getElementById("addbutton");
  const userTable = document.getElementById("userTable");

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Function to render users in the table
  function renderTable() {
    userTable.innerHTML = "";
    users.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.fullName}</td>
        <td>${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.birthDate}</td>
        <td>${user.gender}</td>
        <td>${user.address}</td>
        <td>${user.country}</td>
        <td>${user.city}</td>
        <td>
          <button class="edit" onclick="editUser(${index})">Edit</button>
          <button class="delete" onclick="deleteUser(${index})">Delete</button>
        </td>
      `;
      userTable.appendChild(row);
    });
  }

  // Function to delete user
  window.deleteUser = function (index) {
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    renderTable();
  };

  // Function to edit user
  window.editUser = function (index) {
    localStorage.setItem("editIndex", index); // Store index in localStorage
    window.location.href = "form.html"; // Redirect to edit form
  };

  // Add button functionality
  addButton.addEventListener("click", function () {
    localStorage.removeItem("editIndex"); // Ensure new user entry
    window.location.href = "form.html";
  });

  renderTable(); // Initial render
});
