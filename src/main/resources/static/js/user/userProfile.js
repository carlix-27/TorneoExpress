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

    // Initially disable editing the location
    locationInput.readOnly = true;

    // Add event listener to "Edit Location" button
    editLocationButton.addEventListener('click', () => {
        locationInput.readOnly = false;  // Enable input for editing
        locationInput.focus();  // Focus on the input field
        editLocationButton.textContent = 'Save Location';  // Change button text to "Save Location"
    });

    // Add event listener to "Save Location" button (optional)
    saveLocationButton.addEventListener('click', () => {
        saveLocation();
    });

    // Function to save the new location
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
                        locationInput.placeholder = newLocation;  // Update placeholder with the new location
                        locationInput.readOnly = true;  // Disable editing after saving
                        editLocationButton.textContent = 'Edit Location';  // Reset button text
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
