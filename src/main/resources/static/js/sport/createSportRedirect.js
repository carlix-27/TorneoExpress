function createSportRedirect() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        // User is not logged in, redirect to login or handle appropriately
        window.location.href = "index.html"; // Redirect to login page
        return;
    }

    // Send a request to backend to check premium status
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
                window.location.href = "addSport.html"; // Redirect to addSport.html
            } else {
                window.location.href = "premium.html"; // Redirect to premium.html
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, maybe redirect to an error page
        });
}
