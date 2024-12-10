let autocomplete;

function loadGoogleMapsAPI(apiKey, callback) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callback.name}`;
    script.async = true;
    script.defer = true;
    script.onerror = function() {
        console.error("Error loading Google Maps API");
    };
    document.head.appendChild(script);
}

function initializeAutocomplete() {
    const input = document.getElementById('location');
    if (!input) {
        console.error("No input element with ID 'location' found.");
        return;
    }
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            const location = place.geometry.location;
            input.dataset.latitude = location.lat();
            input.dataset.longitude = location.lng();
        } else {
            console.error('No details available for input: ' + place.name);
        }
    });
}

function fetchGoogleMapsApiKey() {
    return fetch('/api/googleMapsApiKey')
        .then(response => {
            if (!response.ok) throw new Error(`Failed to fetch API key: ${response.status} ${response.statusText}`);
            return response.text();
        });
}

function reverseGeocode(latitude, longitude, callback) {
    if (typeof google === 'object' && google.maps && google.maps.Geocoder) {
        const geocoder = new google.maps.Geocoder();
        const latLng = new google.maps.LatLng(latitude, longitude);

        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
                const addressComponents = results[0].address_components;
                let formattedAddress = '';

                const city = addressComponents.find(component => component.types.includes('locality'));
                const state = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
                const country = addressComponents.find(component => component.types.includes('country'));

                if (city) formattedAddress += city.long_name;
                if (state) formattedAddress += `, ${state.long_name}`;
                if (country) formattedAddress += `, ${country.long_name}`;

                callback(null, formattedAddress || 'Location not found');
            } else {
                callback(`Geocode failed due to: ${status}`);
            }
        });
    } else {
        callback('Google Maps API is not loaded');
    }
}

