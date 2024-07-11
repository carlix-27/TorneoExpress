let map;
let marker;
let geocoder;
let autocomplete;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 4
    });

    marker = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        draggable: true
    });

    geocoder = new google.maps.Geocoder();

    google.maps.event.addListener(marker, 'dragend', function(event) {
        updateAddress(marker.getPosition());
    });

    initAutocomplete();
}

function initAutocomplete() {
    const input = document.getElementById('address');
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            map.setCenter(place.geometry.location);
            marker.setPosition(place.geometry.location);
            document.getElementById('map-container').style.display = 'block';
            document.getElementById('toggle-map-button').textContent = 'Hide Map';
        } else {
            console.error('No details available for input: ' + place.name);
        }
    });
}

function updateAddress(latlng) {
    geocoder.geocode({ 'location': latlng }, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                const addressComponents = results[0].address_components;
                const formattedAddress = formatAddress(addressComponents);
                document.getElementById('address').value = formattedAddress;
            } else {
                console.error('No results found');
            }
        } else {
            console.error('Geocoder failed due to: ' + status);
        }
    });
}

function formatAddress(components) {
    const addressParts = [];
    components.forEach(component => {
        if (component.types.includes('locality') ||
            component.types.includes('administrative_area_level_1') ||
            component.types.includes('country')) {
            addressParts.push(component.long_name);
        }
    });
    return addressParts.join(', ');
}

function toggleMap() {
    const mapContainer = document.getElementById('map-container');
    const toggleButton = document.getElementById('toggle-map-button');

    if (mapContainer.style.display === 'none') {
        mapContainer.style.display = 'block';
        toggleButton.textContent = 'Hide Map';

        // Initialize the map if it hasn't been initialized yet
        if (!map) {
            initMap();
        }
    } else {
        mapContainer.style.display = 'none';
        toggleButton.textContent = 'Show Map';
    }
}

function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const latitude = marker.getPosition().lat();
    const longitude = marker.getPosition().lng();

    const location = `${latitude},${longitude}`;
    console.log("User Location: ", location);

    const formData = {
        name: name,
        email: email,
        location: location,
        password: password
    };

    fetch('/api/auth/submit_registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('User registered successfully:', data);
            window.location.replace("login.html?success=true");
        })
        .catch(error => {
            console.error('Error registering user:', error);
        });
}
