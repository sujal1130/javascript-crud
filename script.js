document.addEventListener("DOMContentLoaded", () => {
  // Get necessary DOM elements
  const userTable = document.getElementById("userTable"); // Get the table element to display user data
  const addButton = document.getElementById("addButton"); // Get the "Add User" button
  const confirmMessage = document.getElementById("confirmMessage");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");
  const modalContainer = document.querySelector(".modalcontainer");
  const pagination = document.getElementById("pagination");
  const searchInput = document.getElementById("searchInput"); // Define the search input element
  const rowsPerPageSelect = document.getElementById("rowsPerPageSelect"); // Dropdown for rows per page
  const headers = document.querySelectorAll("th.sortable"); // Get sortable headers
  // Initialize variables
  let currentPage = 1;
  let rowsPerPage = 5;
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let sortOrder = 1; // 1 for ascending, -1 for descending
  let currentSortColumn = null;

  // Load user data when the page loads
  loadUserData();

  // Update rowsPerPage when the user selects a new value from the dropdown
  rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    currentPage = 1; // Reset to the first page
    loadUserData();
  });

  // Redirect to the form page when the "Add User" button is clicked
  addButton.addEventListener("click", () => {
    localStorage.removeItem("editUserIndex"); // Clear any stored edit index
    localStorage.removeItem("editUserData"); // Clear any stored edit user data
    window.location.href = "form.html"; // Navigate to the form page
  });

  // Function to load and display user data
  function loadUserData() {
    users = JSON.parse(localStorage.getItem("users")) || [];
    displayUsers(users, currentPage);
    setupPagination(users);
  }

  // Display paginated user data in the table
  function displayUsers(users, page) {
    userTable.innerHTML = ""; // Clear table
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = users.slice(start, end);

    paginatedUsers.forEach((user, index) => {
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
      button.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        showConfirmDialog("Are you sure you want to delete this user?", () =>
          deleteUser(index)
        );
      });
    });

    // Attach event listeners to edit buttons
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", editUser);
    });
  }

  function sortUsers(columnKey) {
    if (currentSortColumn === columnKey) {
      sortOrder *= -1; // Reverse sort order if the same column is clicked again
    } else {
      sortOrder = 1;
      currentSortColumn = columnKey;
    }

    users.sort((a, b) => {
      let valueA = a[columnKey].toString().toLowerCase();
      let valueB = b[columnKey].toString().toLowerCase();

      if (!isNaN(valueA) && !isNaN(valueB)) {
        return (valueA - valueB) * sortOrder; // Numeric sorting
      }
      return valueA.localeCompare(valueB) * sortOrder; // Alphabetical sorting
    });

    localStorage.setItem("users", JSON.stringify(users));
    loadUserData();
  }

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const columnKey = header.dataset.column;
      sortUsers(columnKey);
    });
  });

  // Setup pagination controls
  function setupPagination(users) {
    pagination.innerHTML = "";
    const pageCount = Math.ceil(users.length / rowsPerPage);
    if (pageCount <= 1) return; // No pagination needed for one page

    const createPageButton = (page, text = page) => {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.classList.add("page-btn");
      if (page === currentPage) btn.classList.add("active");

      btn.addEventListener("click", () => {
        currentPage = page;
        loadUserData();
      });
      return btn;
    };

    if (currentPage > 1)
      pagination.appendChild(createPageButton(currentPage - 1, "<"));
    if (currentPage > 2) {
      pagination.appendChild(createPageButton(1));
      if (currentPage > 3)
        pagination.appendChild(document.createTextNode(" ... "));
    }
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(pageCount, currentPage + 1);
      i++
    ) {
      pagination.appendChild(createPageButton(i));
    }
    if (currentPage < pageCount - 1) {
      if (currentPage < pageCount - 2)
        pagination.appendChild(document.createTextNode(" ... "));
      pagination.appendChild(createPageButton(pageCount));
    }
    if (currentPage < pageCount)
      pagination.appendChild(createPageButton(currentPage + 1, ">"));
  }

  // Function to delete a user from the list
  function deleteUser(index) {
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    loadUserData();
    showNotification("User deleted successfully!", "error");
  }

  // Function to edit a user
  function editUser(event) {
    const index = event.target.getAttribute("data-index"); // Get the index of the user to be edited
    localStorage.setItem("editUserIndex", index); // Store the user data and index in local storage for editing
    localStorage.setItem("editUserData", JSON.stringify(users[index]));
    window.location.href = "form.html"; // Navigate to the form page for editing
  }

  // Show confirmation dialog for delete action
  function showConfirmDialog(message, callback) {
    confirmMessage.textContent = message;
    modalContainer.classList.add("show");
    confirmYes.onclick = () => {
      callback();
      closeModal();
    };
    confirmNo.onclick = closeModal;
    // Close modal when clicking outside
    modalContainer.addEventListener("click", (event) => {
      if (event.target === modalContainer) closeModal();
    });
  }

  // Close modal dialog
  function closeModal() {
    modalContainer.classList.remove("show");
  }

  // Show notification message
  function showNotification(message, type) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `toast ${type}`;
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.display = "none";
    }, 6000);
  }

  // Search functionality
  searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    const rows = userTable.getElementsByTagName("tr");
    for (let row of rows) {
      const cells = row.getElementsByTagName("td");
      row.style.display = [...cells].some((cell) =>
        cell.textContent.toLowerCase().includes(filter)
      )
        ? ""
        : "none";
    }
  });
});
