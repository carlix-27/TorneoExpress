function showToast() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('success') === 'true') {
        const successMessage = document.getElementById('success-toast');
        successMessage.style.display = 'block';

        setTimeout(function() {
            successMessage.style.display = 'none';
        }, 3000);
    }
}

window.onload = showToast;

function closeToast() {
    const successToast = document.getElementById('success-toast');
    successToast.style.display = 'none';

    const errorToast = document.getElementById('error-toast');
    errorToast.style.display = 'none';
}
