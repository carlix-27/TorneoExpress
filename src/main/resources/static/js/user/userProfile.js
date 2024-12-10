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

    // Initially, location input is readonly
    locationInput.readOnly = true;

    // Edit Location button click event
    editLocationButton.addEventListener('click', () => {
        if (locationInput.readOnly) {
            // Make the location input editable
            locationInput.readOnly = false;
            locationInput.focus();

            // Change button text to 'Save Location'
            editLocationButton.textContent = "Save Location";
            saveLocationButton.style.display = 'inline-block'; // Show the save button
        } else {
            // Save the updated location (You can send the updated location to your server here)
            saveLocation();

            // Make the location input readonly again
            locationInput.readOnly = true;

            // Change button text back to 'Edit Location'
            editLocationButton.textContent = "Edit Location";
            saveLocationButton.style.display = 'none'; // Hide the save button
        }
    });

    // Save Location button click event
    saveLocationButton.addEventListener('click', () => {
        saveLocation();
    });

    function saveLocation() {
        const newLocation = locationInput.value.trim();
        if (newLocation) {
            fetch(`/api/user/players/${userId}/location`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ location: newLocation }),
            })
                .then(response => {
                    if (response.ok) {
                        locationInput.placeholder = newLocation;
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
