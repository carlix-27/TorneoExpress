function checkPremiumAndRedirect(userId, premiumUrl, nonPremiumUrl) {
    return fetch(`/api/user/${userId}/premium`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.isPremium) {
                window.location.href = premiumUrl;
            } else {
                window.location.href = nonPremiumUrl;
            }
        })
        .catch(error => {
            console.error('Error checking premium status:', error);
        });
}

function redirectToCreateTournament() {
    const userId = localStorage.getItem("userId");
    checkPremiumAndRedirect(userId, "crearTorneo.html", "premium.html");
}

