document.addEventListener("DOMContentLoaded", function () {
  const userTable = document.getElementById("userTable");
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Clear existing table rows before populating
  //Function to render the table
  function renderTable() {
    userTable.innerHTML = "";

    if (users.length === 0) {
      userTable.innerHTML = `<tr><td colspan="10">No data available</td></tr>`;
      return;
    }

    users.forEach((user, index) => {
      let row = document.createElement("tr");
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
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
      userTable.appendChild(row);
    });

    // Attach event listeners to delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        users.splice(index, 1); // Remove user from array
        localStorage.setItem("users", JSON.stringify(users)); // Update localStorage
        renderTable(); // Re-render table
      });
    });
  }

  // Initial render
  renderTable();

  //  Fix: Make "Add" button button click event work correctly
  const addButton = document.getElementById("addbutton");
  if (addButton) {
    addButton.addEventListener("click", function () {
      window.location.href = "form.html"; // Redirects to the registration form
    });
  }
});
