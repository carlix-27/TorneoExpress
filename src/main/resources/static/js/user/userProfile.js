document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");
    fetchAndLoadGoogleMapsAPI()
        .then(() => {
            fetchAndDisplayUserProfile(userId);
            initializeAutocomplete('location')
        })
        .catch(error => {
            console.error('Error fetching API key:', error);
        });
});

function fetchAndDisplayUserProfile(userId) {
    fetchUserData(userId)
        .then(user => {
            displayUserProfile(user, userId);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

function displayUserProfile(user, userId) {
    document.getElementById('user-name').textContent = user.name || 'No name provided';
    document.getElementById('email').textContent = user.email || 'No email provided';
    document.getElementById('premium').textContent = user.is_Premium ? 'Yes' : 'No';

    const comparePremiumButton = document.getElementById('premium-button');
    comparePremiumButton.style.display = user.is_Premium ? 'none' : 'inline-block';
    if (comparePremiumButton) {
        comparePremiumButton.addEventListener('click', () => {
            window.location.href = 'premium.html';
        });
    }

        const locationInput = document.getElementById('location');

        if (user.location && user.location !== "undefined") {
            const [latitude, longitude] = user.location.split(',');
            reverseGeocode(latitude, longitude, locationInput);
        } else {
            locationInput.placeholder = 'No location provided';
        }

        const editLocationButton = document.getElementById('edit-location-button');
        const saveLocationButton = document.getElementById('save-location');

        locationInput.readOnly = true;

        editLocationButton.addEventListener('click', () => {

            locationInput.readOnly = false;
            locationInput.focus();

            editLocationButton.style.display = 'none';
            saveLocationButton.style.display = 'inline-block';
        });

        saveLocationButton.addEventListener('click', () => {
            saveLocation(userId);
        });
}

function fetchUserData(userId) {
    return fetch(`/api/user/players/${userId}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch user data');
            return response.json();
        });
}

function saveLocation(userId) {
    const address = document.getElementById('location');
    const latitude = address.dataset.latitude;
    const longitude = address.dataset.longitude;

    if (!latitude || !longitude) {
        showErrorToast("Debe seleccionar una ubicación válida.", "error");
        return;
    }

    const newLocation = `${latitude},${longitude}`;

    // Send the new location to the server
    fetch(`/api/user/${userId}/location`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: newLocation,
    })
        .then(response => {
            if (response.ok) {
                address.placeholder = newLocation;
                address.readOnly = true;

                const saveLocationButton = document.getElementById('save-location');
                const editLocationButton = document.getElementById('edit-location-button');
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
