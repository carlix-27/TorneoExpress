// Function to fetch sports from backend
async function fetchSports() {
    try {
        const response = await fetch('/api/sports');
        if (!response.ok) {
            throw new Error(`Failed to fetch sports: ${response.status} ${response.statusText}`);
        }
        const sports = await response.json();
        return sports;
    } catch (error) {
        console.error('Error fetching sports:', error);
        return []; // Return empty array if there's an error
    }
}

// Function to populate select element with sports
// Function to fetch and populate sports dropdown
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
            sportDropdown.innerHTML = ""; // Clear existing options

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

// Call the function to populate sports dropdown when the page loads
document.addEventListener("DOMContentLoaded", function() {
    populateSportsDropdown();
});

