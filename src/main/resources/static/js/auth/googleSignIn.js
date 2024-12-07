function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    const email = profile.email
    checkIfUserExists(email);
}

async function checkIfUserExists(email) {
    const response = await fetch(`/api/user/${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const exists = await response.json();
    if (!exists) {
        window.location.href = '/register.html';
    }
}
