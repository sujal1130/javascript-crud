document.addEventListener("DOMContentLoaded", () => {
  const userTable = document.getElementById("userTable");
  const addButton = document.getElementById("addButton");

  // Load User Data
  loadUserData();

  // Redirect to Form on Add Button Click
  addButton.addEventListener("click", () => {
    localStorage.removeItem("editUserIndex");
    localStorage.removeItem("editUserData");
    window.location.href = "form.html";
  });

  // Load User Data from Local Storage
  function loadUserData() {
    userTable.innerHTML = "";
    const users = JSON.parse(localStorage.getItem("users")) || [];

    users.forEach((user, index) => {
      const row = document.createElement("tr");

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

      userTable.appendChild(row);
    });

    // Attach Event Listeners
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", deleteUser);
    });

    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", editUser);
    });
  }

  // Delete User Function
  function deleteUser(event) {
    const index = event.target.getAttribute("data-index");
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (confirm("Are you sure you want to delete this user?")) {
      users.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(users));
      loadUserData();
    }
  }

  // Edit User Function
  function editUser(event) {
    const index = event.target.getAttribute("data-index");
    let users = JSON.parse(localStorage.getItem("users")) || [];

    localStorage.setItem("editUserIndex", index);
    localStorage.setItem("editUserData", JSON.stringify(users[index]));

    window.location.href = "form.html";
  }
});
