let autocomplete;

function loadGoogleMapsAPI(apiKey) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsAPI`;
        script.async = true;
        script.defer = true;
        script.onerror = function() {
            reject("Error loading Google Maps API");
        };
        window.initGoogleMapsAPI = () => resolve();
        document.head.appendChild(script);
    });
}

function initializeAutocomplete(inputId) {
    const input = document.getElementById(inputId);
    if (!input) {
        console.error(`No input element with ID '${inputId}' found.`);
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

function reverseGeocode(latitude, longitude) {
    return new Promise((resolve, reject) => {
        if (typeof google === 'object' && google.maps && google.maps.Geocoder) {
            const geocoder = new google.maps.Geocoder();
            const latLng = new google.maps.LatLng(latitude, longitude);

            geocoder.geocode({ location: latLng }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    const components = results[0].address_components;
                    const city = components.find(c => c.types.includes('locality'))?.long_name || '';
                    const state = components.find(c => c.types.includes('administrative_area_level_1'))?.short_name || '';
                    const country = components.find(c => c.types.includes('country'))?.long_name || '';

                    let readableAddress = `${city ? city + ', ' : ''}${state ? state + ', ' : ''}${country}`;
                    readableAddress = readableAddress.replace(/^, /, '').trim();

                    resolve(readableAddress || 'No location provided');
                } else {
                    reject('Unable to get location');
                    console.error('Geocode failed due to: ' + status);
                }
            });
        } else {
            reject('Google Maps API is not loaded');
            console.error('Google Maps API is not loaded');
        }
    });
}


function fetchAndLoadGoogleMapsAPI() {
    return fetch('/api/googleMapsApiKey')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch API key');
            return response.text();
        })
        .then(apiKey => loadGoogleMapsAPI(apiKey));
}
