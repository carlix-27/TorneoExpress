import { loadTeams } from 'loadTeams.js';


export function showSignupModal(teamId) {
    const modal = document.getElementById("signupModal");
    const closeButton = modal.querySelector(".close");
    const signupButton = modal.querySelector("#sendInviteButton");
    const userId = localStorage.getItem("userId");

    fetchTeamDetails(teamId)
        .then(team => {
            displayTeamDetails(team, signupButton);
            addSignupButtonListener(team, userId, signupButton);
        })
        .catch(error => {
            console.error("Error:", error);
            // Handle error, show message to user
        });

    displayModal(modal, closeButton);
}

function fetchTeamDetails(teamId) {
    return fetch(`/api/teams/${teamId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch team details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        });
}

function displayTeamDetails(team, signupButton) {
    const teamDetails = document.getElementById("teamDetails");
    teamDetails.innerHTML = `
    <h3>${team.name}</h3>
    <p>Ubicación: ${team.location}</p>
    <p>Deporte: ${team.sport.sportName}</p>
    <p>Privacidad: ${team.private? "Privado" : "Público"}</p>
    <p>Jugadores inscritos: ${team.players.length} / ${team.sport.num_players * 2}</p>
  `;

    if (team.private) {
        signupButton.textContent = "Send Request";
        signupButton.setAttribute("data-privacy", "private");
    } else {
        signupButton.textContent = "Sign Up";
        signupButton.setAttribute("data-privacy", "public");
    }
}

function addSignupButtonListener(team, userId, signupButton) {
    signupButton.addEventListener("click", function() {
        if (team.players.length < team.sport.num_players * 2) {
            if (!team.players.includes(userId)) {
                sendInvite(team, userId);
            } else {
                console.log("Player is already part of the team.");
            }
        } else {
            console.log("Maximum number of players reached.");
        }
    });
}

function displayModal(modal, closeButton) {
    modal.style.display = "block";

    closeButton.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

function displaySuccessMessage(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.style.display = "block";
}

document.addEventListener("DOMContentLoaded", loadTeams);