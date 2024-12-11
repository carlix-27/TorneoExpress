function fetchSports() {
    fetch('/api/sports')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch sports: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(sports => {
            const sportDropdown = document.getElementById('sport');
            sports.forEach(sport => {
                const option = document.createElement('option');
                option.value = sport.sportId;
                option.text = sport.sportName;
                sportDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching sports:', error);
        });
}

function populateSportsDropdown() {
    fetch("/api/sports") // Assuming this endpoint returns the list of sports
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch sports: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(sports => {
            const sportDropdown = document.getElementById("sport");
            sportDropdown.innerHTML = "";

            sports.forEach(sport => {
                const option = document.createElement("option");
                option.value = sport.sportId;
                option.text = sport.sportName;
                sportDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching sports:', error);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    populateSportsDropdown();
});

