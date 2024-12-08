function showSuccessToast(message) {
    const successToast = document.getElementById('success-toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;

    successToast.style.display = 'block';

    setTimeout(function() {
        successToast.style.display = 'none';
    }, 3000);
}

function showErrorToast(message) {
    const errorToast = document.getElementById('error-toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;

    errorToast.style.display = 'block';

    setTimeout(function() {
        errorToast.style.display = 'none';
    }, 3000);
}

function closeToast() {
    const successToast = document.getElementById('success-toast');
    successToast.style.display = 'none';

    const errorToast = document.getElementById('error-toast');
    errorToast.style.display = 'none';
}
