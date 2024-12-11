function showSuccessToast(message) {
    const successToast = document.getElementById('success-toast');
    const toastMessage = document.getElementById('success-toast-message');
    toastMessage.textContent = message;

    successToast.style.display = 'block';

    setTimeout(function() {
        successToast.style.display = 'none';
    }, 3000);
}

function showErrorToast(message) {
    const errorToast = document.getElementById('error-toast');
    const toastMessage = document.getElementById('error-toast-message');
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

function handleToastFromQuery(paramName, successMessage, errorMessage) {
    const params = new URLSearchParams(window.location.search);
    const queryValue = params.get(paramName);

    if (queryValue === "true") {
        showSuccessToast(successMessage);
    } else if (queryValue === "false" && errorMessage) {
        showErrorToast(errorMessage);
    }

    if (queryValue) {
        const url = new URL(window.location.href);
        url.searchParams.delete(paramName);
        window.history.replaceState({}, document.title, url);
    }
}

