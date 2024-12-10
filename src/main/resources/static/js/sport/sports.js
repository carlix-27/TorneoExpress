// Function to fetch all sports
function fetchAllSports() {
    fetch('/api/sports')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch sports: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(sports => {
            const sportsList = document.getElementById('sports-list');

            // Clear existing list
            sportsList.innerHTML = '';

            sports.forEach(sport => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h3>${sport.sportName}</h3> 
                    <p>Cantidad de jugadores: ${sport.num_players}</p>
                `;
                sportsList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Function to delete a sport
function deleteSport(sportId) {
    const confirmed = confirm("Are you sure you want to delete this sport?");
    if (confirmed) {
        fetch(`/api/sports/delete/${sportId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete sport: ${response.status} ${response.statusText}`);
                }
                // Reload the sports list after deletion
                fetchAllSports();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to delete sport. Please try again.');
                // Handle error, show message to user
            });
    }
}

// Function to redirect to edit page for a sport
function editSport(sportId) {
    // Redirect to edit page with sport ID in query parameter
    window.location.href = `editSport.html?id=${sportId}`;
}

// Function to handle logout
function logout() {
    // Implement your logout logic, such as clearing local storage
    localStorage.clear();
    // Redirect to login page
    window.location.href = "index.html";
}

// Entry point when the page loads
document.addEventListener("DOMContentLoaded", function() {
    fetchAllSports(); // Fetch all sports when the page loads
});
