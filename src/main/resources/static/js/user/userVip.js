document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");
    fetchUserInfo(userId);
});

function fetchUserInfo(userId) {
    fetch(`/api/user/players/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(user => {
            console.log(user);
            const nameElement = document.getElementById('user-name');
            nameElement.textContent = user.name;

            if (user.is_Premium) {
                document.getElementById("verified-icon").style.display = "inline";
            }
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });
}
