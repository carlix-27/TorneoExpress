function displayErrorMessage(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    errorMessage.className = 'message error show';
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
}

function displaySuccessMessage(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.style.display = "block";
    successMessage.className = 'message success show';
    setTimeout(() => {
        successMessage.style.display = "none";
    }, 3000);
}