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

        const comparePremiumButton = document.getElementById('premium-button');
        if (!user.is_Premium) {
            comparePremiumButton.style.display = 'inline-block';
        } else {
            comparePremiumButton.style.display = 'none';
        }

        const locationInput = document.getElementById('location');
        if (user.location && user.location !== "undefined") {
            const [latitude, longitude] = user.location.split(',');

            reverseGeocode(latitude, longitude, locationInput);
        } else {
            locationInput.placeholder = 'No location provided';
        }
    }

    function reverseGeocode(latitude, longitude, locationInput) {
        if (typeof google === 'object' && google.maps && google.maps.Geocoder) {
            const geocoder = new google.maps.Geocoder();

            const latLng = new google.maps.LatLng(latitude, longitude);

            geocoder.geocode({ location: latLng }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    const placeName = results[0].formatted_address;
                    locationInput.placeholder = placeName || 'No location provided';
                } else {
                    locationInput.placeholder = 'Unable to get location';
                    console.error('Geocode failed due to: ' + status);
                }
            });
        } else {
            console.error('Google Maps API is not loaded');
        }
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
        console.log(latitude);
        const longitude = address.dataset.longitude;
        console.log(longitude);
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
                body: JSON.stringify({ location: newLocation }),
            })
                .then(response => {
                    if (response.ok) {
                        address.placeholder = newLocation;
                        address.readOnly = true;

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

    const comparePremiumButton = document.getElementById('premium-button');
    if (comparePremiumButton) {
        comparePremiumButton.addEventListener('click', () => {
            window.location.href = 'premium.html';
        });
    }
});
