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
            const {teamsAsCaptain, teamsAsMember} = data;
            const teamDropDown = document.getElementById('my-teams');

            if (teamsAsCaptain.length === 0) {
                const option = document.createElement('option');
                option.value = -1;
                option.text = "No posee equipos";
                teamDropDown.appendChild(option);
            } else if (teamsAsCaptain !== 0) {
                teamsAsCaptain.forEach(team => {
                    const {
                        id: teamId,
                        location: teamLocation,
                        sport: teamSport,
                        name,
                        private: isPrivate,
                        players,
                    }
                        = team;

                    console.log(team);
                    const option = document.createElement('option');
                    option.value = teamId; // Assuming id is the ID field in your Team entity
                    option.text = name; // Assuming name is the name field in your Team entity
                    teamDropDown.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user or retry fetch
        });
}

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadArticle);
