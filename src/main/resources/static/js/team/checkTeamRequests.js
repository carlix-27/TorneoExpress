function checkTeamRequests() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    fetch(`/api/requests/tournament/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch team requests: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                document.getElementById("request-asterisk").style.display = "inline";
            }
        })
        .catch(error => {
            console.error('Error fetching team requests:', error);
        });
}

document.addEventListener("DOMContentLoaded", checkTeamRequests);