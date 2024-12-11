document.addEventListener("DOMContentLoaded", function () {
    const teamId = getTeamIdFromURL();
    const userId = localStorage.getItem("userId");

    if (!teamId || !userId) {
        console.error("Team ID or User ID not found");
        return;
    }

    fetchPlayersOfTeam(teamId, userId);

    fetchArticlesOfTeam(teamId);

    function fetchPlayersOfTeam(teamId, userId) {
        fetch(`/api/teams/all/${teamId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch players of team: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(players => {
                renderPlayers(teamId, players, userId);
            })
            .catch(error => console.error('Error:', error));
    }

    function fetchArticlesOfTeam(teamId) {
        fetch(`/api/teams/${teamId}/articles`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch players of team: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(articles => {
                renderArticles(articles);
            })
            .catch(error => console.error('Error:', error));
    }

    function renderPlayers(teamId, players, userId) {
        fetchTeamDetails(teamId)
            .then(team => {
                const playersTableBody = document.querySelector("#playersTable tbody");
                playersTableBody.innerHTML = ''; // Clear previous data

                // Update the header dynamically with team name
                const playersHeader = document.querySelector("h2");
                playersHeader.textContent = `Jugadores del Equipo: ${team.name}`;

                players.forEach(player => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${player.name}</td>
                        <td>
                            ${userId == team.captainId && player.id != userId ? `<button class="action-button remove-button" data-player-id="${player.id}">Expulsar</button>` : ''}
                        </td>
                    `;
                    playersTableBody.appendChild(row);
                });

                document.querySelectorAll('.remove-button').forEach(button => {
                    button.addEventListener('click', handleRemovePlayer);
                });

            })
            .catch(error => {
                console.error('Error fetching team details:', error);
            });
    }

    function renderArticles(articles) {
        const articlesDiv = document.getElementById("articles");
        articlesDiv.innerHTML = ``;

        if (articles.length === 0) {
            articlesDiv.innerHTML = `
            <p class="no-articles">No posee beneficios para este equipo</p>
        `;
            return;
        }

        // Create a map to count occurrences of each article
        const articleCounts = articles.reduce((acc, article) => {
            acc[article.article_name] = (acc[article.article_name] || 0) + 1;
            return acc;
        }, {});

        // Convert the map back to an array of articles with counts
        const uniqueArticles = Object.keys(articleCounts).map(articleName => {
            return {
                article_name: articleName,
                article_description: articles.find(article => article.article_name === articleName).article_description,
                count: articleCounts[articleName]
            };
        });

        uniqueArticles.forEach(article => {
            const div = document.createElement("div");
            div.innerHTML = `
                <h3 class="article-title">${article.article_name} (x${article.count})</h3>
                <p class="article-description">${article.article_description}</p>
            `;
            articlesDiv.appendChild(div);
        });
    }

    function handleRemovePlayer(event) {
        const playerId = event.target.getAttribute('data-player-id');

        fetch(`/api/teams/${teamId}/${playerId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to remove player: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(() => {
                sendExpulsionNotification(teamId, playerId);
                displayFeedbackMessage('Jugador expulsado', true);
                fetchPlayersOfTeam(teamId, userId);
            })
            .catch(error => {
                console.error('Error:', error);
                displayFeedbackMessage('Failed to remove player', false);
            });
    }

    function displayFeedbackMessage(message, success) {
        const feedbackMessage = document.getElementById("feedbackMessage");
        feedbackMessage.textContent = message;
        feedbackMessage.style.color = success ? 'green' : 'red';
        feedbackMessage.style.display = "block";

        setTimeout(() => {
            feedbackMessage.style.display = "none";
        }, 3000);
    }

    function getTeamIdFromURL() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('id');
    }
});

function fetchTeamDetails(teamId) {
    return fetch(`/api/teams/${teamId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch team details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        });
}

function sendExpulsionNotification(teamId, playerId) {
    fetchTeamDetails(teamId)
        .then((team) => {
            const teamName = team.name;
            const message = `Has sido expulsado del equipo ${teamName}.`;
            const url = "no-redirect";

            return fetch(`/api/notifications/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    toId: playerId,
                    message: message,
                    redirectUrl: url,
                }),
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to create expulsion notification: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error sending expulsion notification:', error);
        });
}

function goBack() {
    window.history.back();
}

