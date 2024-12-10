document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");

    fetch(`/api/user/players/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json();
        })
        .then(data => {
            displayUserProfile(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    function displayUserProfile(user) {
        document.getElementById('user-name').textContent = user.name || 'No name provided';
        document.getElementById('email').textContent = user.email || 'No email provided';
        document.getElementById('location').textContent = user.location || 'No location provided';
        document.getElementById('premium').textContent = user.is_Premium ? 'Yes' : 'No';
    }

});