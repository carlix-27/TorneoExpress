function redirectToCreateTournament() {
    const userId = localStorage.getItem("userId");

    fetch(`/api/user/${userId}/premium`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const isPremium = data.isPremium;
            if (isPremium) {
                window.location.href = "crearTorneo.html";
            } else {
                window.location.href = "premium.html";
            }
        })
}
