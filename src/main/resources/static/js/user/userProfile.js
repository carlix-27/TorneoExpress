document.addEventListener("DOMContentLoaded", function() {
    const userId = localStorage.getItem("userId");
    fetchGoogleMapsApiKey()
        .then(apiKey => {
            loadGoogleMapsAPI(apiKey, initializeAutocomplete);
            fetchAndDisplayUserProfile(userId);
        })
        .catch(error => {
            console.error('Error fetching API key:', error);
        });
});

function fetchAndDisplayUserProfile(userId) {
    fetchUserData(userId)
        .then(user => {
            displayUserProfile(user);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

function displayUserProfile(user) {
    document.getElementById('user-name').textContent = user.name || 'No name provided';
    document.getElementById('email').textContent = user.email || 'No email provided';
    document.getElementById('premium').textContent = user.is_Premium ? 'Yes' : 'No';

    const comparePremiumButton = document.getElementById('premium-button');
    comparePremiumButton.style.display = user.is_Premium ? 'none' : 'inline-block';

    const locationInput = document.getElementById('location');
    if (user.location && user.location !== "undefined") {
        const [latitude, longitude] = user.location.split(',');
        reverseGeocode(latitude, longitude, (err, placeName) => {
            locationInput.placeholder = err ? 'Unable to get location' : placeName || 'No location provided';
            if (err) console.error(err);
        });
    } else {
        locationInput.placeholder = 'No location provided';
    }
}

function fetchUserData(userId) {
    return fetch(`/api/user/players/${userId}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch user data');
            return response.json();
        });
}
