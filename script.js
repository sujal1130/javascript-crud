document.addEventListener("DOMContentLoaded", function () {
    const userTable = document.getElementById("userTable");
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Clear existing table rows before populating
    userTable.innerHTML = "";
  
    if (users.length === 0) {
      userTable.innerHTML = `<tr><td colspan="9">No data available</td></tr>`;
      return;
    }
  
    users.forEach((user) => {
      let row = `<tr>
        <td>${user.fullName}</td>
        <td>${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.birthDate}</td>
        <td>${user.gender}</td>
        <td>${user.address}</td>
        <td>${user.country}</td>
        <td>${user.city}</td>
      </tr>`;
      userTable.innerHTML += row;
    });
  
    //  Fix: Make "Add" button work correctly
    const addButton = document.getElementById("addbutton");
    if (addButton) {
      addButton.addEventListener("click", function () {
        window.location.href = "form.html"; // Redirects to the registration form
      });
    }
  });
  