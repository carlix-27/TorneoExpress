let map;
let marker;
let geocoder;

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
        updateMarkerPosition(marker.getPosition());
    });
}

function geocodeAddress() {
    const address = document.getElementById('address').value;
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
        }
    });
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
