document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");

    fetch(`/api/user/players/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json();
        })
        .then(data => {
            displayUserProfile(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    function displayUserProfile(user) {
        document.getElementById('user-name').textContent = user.name || 'No name provided';
        document.getElementById('email').textContent = user.email || 'No email provided';
        document.getElementById('premium').textContent = user.is_Premium ? 'Yes' : 'No';

        const locationInput = document.getElementById('location');
        locationInput.placeholder = user.location !== "undefined" ? user.location : 'No location provided';
    }

    const editLocationButton = document.getElementById('edit-location-button');
    const saveLocationButton = document.getElementById('save-location');
    const locationInput = document.getElementById('location');

    locationInput.readOnly = true;

    editLocationButton.addEventListener('click', () => {
        locationInput.readOnly = false;
        locationInput.focus();

        editLocationButton.style.display = 'none';
        saveLocationButton.style.display = 'inline-block';

        saveLocationButton.id = 'save-location';
    });

    saveLocationButton.addEventListener('click', () => {
        saveLocation();
    });

    function saveLocation() {

        const address = document.getElementById('location');

        const latitude = address.dataset.latitude;
        const longitude = address.dataset.longitude;

        if (!latitude || !longitude) {
            showErrorToast("Debe seleccionar una ubicación válida.", "error");
            return;
        }

        const newLocation = `${latitude},${longitude}`;

        if (newLocation) {
            fetch(`/api/user/${userId}/location`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: newLocation,
            })
                .then(response => {
                    if (response.ok) {
                        locationInput.placeholder = newLocation;
                        locationInput.readOnly = true;

                        saveLocationButton.style.display = 'none';
                        editLocationButton.style.display = 'inline-block';
                    } else {
                        alert('Failed to save location');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error saving location');
                });
        }
    }
});
