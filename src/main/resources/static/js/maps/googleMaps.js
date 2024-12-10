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

function fetchAndLoadGoogleMapsAPI() {
    return fetch('/api/googleMapsApiKey')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch API key');
            return response.text();
        })
        .then(apiKey => loadGoogleMapsAPI(apiKey));
}
