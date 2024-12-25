if (window.location.pathname.)

// Handle the form submission and cancel button in form.html
if (window.location.pathname.endsWith("form.html")) {
 const cancelButton = document.getElementById('cancelButton');
 
 // Handle cancel button
 cancelButton.addEventListener('click', () => {
     window.location.href = "index.html";
 });
}
