function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('article-id');

    fetch(`/api/articles/${articleId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch article: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(article => {
            const articleSection = document.getElementById("article");

            const {
                id: articleId,
                article_name: articleName,
                article_description: articleDescription,
                article_price: articlePrice,
            } = article;

            /* Choose a team that user is captain of. Then choose tournament. */
            articleSection.innerHTML = `
                <div id="article-result">
                    <h2>${articleName}</h2>
                    <p>Descripcion: ${articleDescription}</p>
                    <p>Precio: ${articlePrice}</p>
                    
                    <label for="my-teams">Equipo:</label>
                    <select id="my-teams" name="my-teams" required>
                        <option value="-1">Seleccione un equipo</option>
                    </select> <br>
                    
                    <label for="tournaments-for-team"> Torneo: </label>
                    <select id="tournaments-for-team" name="tournaments-for-team" required>
                        <option value="-1">Seleccione un torneo</option>
                    </select>
                    
                    <p>Sus puntos en el torneo: </p>
                </div>
            `;

            fetchMyTeams();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function fetchMyTeams() {
    const userId = localStorage.getItem("userId");

    fetch(`/api/teams/user/${userId}`) // Assuming this endpoint returns the list of teams
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const { teamsAsCaptain, teamsAsMember } = data;
            const teamDropDown = document.getElementById('my-teams');

            if (teamsAsCaptain.length === 0) {
                const option = document.createElement('option');
                option.value = -1;
                option.text = "No posee equipos";
                teamDropDown.appendChild(option);
            } else {
                teamsAsCaptain.forEach(team => {
                    const {
                        id: teamId,
                        name,
                    } = team;

                    const option = document.createElement('option');
                    option.value = teamId;
                    option.text = name;
                    teamDropDown.appendChild(option);
                });
            }

            // Add event listener to fetch tournaments when a team is selected
            teamDropDown.addEventListener('change', fetchTournamentsForTeam);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function fetchTournamentsForTeam() {
    const teamDropDown = document.getElementById('my-teams');
    const teamId = teamDropDown.value;
    const tournamentDropDown = document.getElementById('tournaments-for-team');
    tournamentDropDown.innerHTML = '<option value="-1">Seleccione un torneo</option>'; // Clear existing options

    if (teamId && teamId !== "-1") {
        fetch(`/api/tournaments/teams/${teamId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch tournaments: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                data.forEach(tournament => {
                    const {
                        id: tournamentId,
                        name: tournamentName,
                    } = tournament;

                    const option = document.createElement('option');
                    option.value = tournamentId;
                    option.text = tournamentName;
                    tournamentDropDown.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

document.addEventListener("DOMContentLoaded", loadArticle);
