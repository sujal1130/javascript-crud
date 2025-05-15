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

  // Redirect to the form page when the "Add User" button is clicked
  addButton.addEventListener("click", () => {
    localStorage.removeItem("editUserIndex"); // Clear any stored edit index
    localStorage.removeItem("editUserData"); // Clear any stored edit user data
    window.location.href = "form.html"; // Navigate to the form page
  });

  rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    currentPage = 1; // Reset to the first page
    loadUserData();
  });

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

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      sortUsers(header.dataset.column);
    });
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
        <td>${user.firstName || ""}</td>
        <td>${user.lastName || ""}</td>
        <td>${user.email || ""}</td>
        <td>${user.phone || ""}</td>
        <td>${user.birthDate || ""}</td>
        <td>${user.gender || ""}</td>
        <td>${user.address || ""}</td>
        <td>${user.country || ""}</td>
        <td>
          <button class="edit-btn" data-index="${start + index}">Edit</button>
          <button class="delete-btn" data-index="${
            start + index
          }">Delete</button>
        </td>
      `;
      userTable.appendChild(row); // Append the row to the table
    });

    attachEventListeners();
  }

  // Attach event listeners to delete and edit buttons
  function attachEventListeners() {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        localStorage.setItem("editUserIndex", index);
        localStorage.setItem("editUserData", JSON.stringify(users[index]));
        window.location.href = "form.html";
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        showConfirmDialog("Are you sure you want to delete this user?", () =>
          deleteUser(index)
        );
      });
    });
  }

  function sortUsers(columnKey) {
    sortOrder = currentSortColumn === columnKey ? -sortOrder : 1;
    currentSortColumn = columnKey;

    users.sort((a, b) => {
      const valA = a[columnKey]?.toString().toLowerCase() || "";
      const valB = b[columnKey]?.toString().toLowerCase() || "";

      return isNaN(valA) || isNaN(valB)
        ? valA.localeCompare(valB) * sortOrder
        : (parseFloat(valA) - parseFloat(valB)) * sortOrder;
    });

    updateSortIcons();
    localStorage.setItem("users", JSON.stringify(users));
    loadUserData();
  }

  function updateSortIcons() {
    headers.forEach((header) => {
      header.classList.remove("sorted-asc", "sorted-desc");
      if (header.dataset.column === currentSortColumn) {
        header.classList.add(sortOrder === 1 ? "sorted-asc" : "sorted-desc");
      }
    });
  }

  // Setup pagination controls
  function setupPagination(users) {
    pagination.innerHTML = "";
    const pageCount = Math.ceil(users.length / rowsPerPage);

    if (pageCount <= 1) return; // No pagination needed

    const createPageButton = (page, text = page, isDisabled = false) => {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.className = "page-btn";
      if (page === currentPage) {
        btn.classList.add("active");
        btn.disabled = true;
      }
      if (isDisabled) {
        btn.disabled = true;
        btn.classList.add("disabled");
      }
      btn.onclick = () => {
        if (!btn.disabled) {
          currentPage = page;
          loadUserData();
        }
      };
      return btn;
    };

    // < prev
    pagination.appendChild(
      createPageButton(currentPage - 1, "< prev", currentPage === 1)
    );

    // First page + ellipsis
    if (currentPage > 2) {
      pagination.appendChild(createPageButton(1));
      if (currentPage > 3) {
        pagination.appendChild(document.createTextNode(" ... "));
      }
    }

    // Middle page numbers
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(pageCount, currentPage + 1);
      i++
    ) {
      pagination.appendChild(createPageButton(i));
    }

    // Last page + ellipsis
    if (currentPage < pageCount - 1) {
      if (currentPage < pageCount - 2) {
        pagination.appendChild(document.createTextNode(" ... "));
      }
      pagination.appendChild(createPageButton(pageCount));
    }

    // next >
    pagination.appendChild(
      createPageButton(currentPage + 1, "next >", currentPage === pageCount)
    );
  }

  // Function to delete a user from the list
  function deleteUser(index) {
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    loadUserData();
    showNotification("User deleted successfully!", "error");
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
    modalContainer.addEventListener("click", (e) => {
      if (e.target === modalContainer) closeModal();
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
});
