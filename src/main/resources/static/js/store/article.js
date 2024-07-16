function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('article-id');

    fetch(`/api/articles/article/${articleId}`)
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
                    
                    <p id="prestige-points"></p>
                    
                    <div id="purchase-button">
                        <button id="buy-button">Comprar</button>
                    </div>
                    
                    <div id="successMessage" style="display: none; color: green; margin-top: 10px;">
                    
                    </div>
                    
                    <div id="errorMessage" style="display: none; color: red; margin-top: 10px;">
                    
                    </div>
                    
                </div>
            `;

            fetchMyTeams(article);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function fetchMyTeams(article) {
    const userId = localStorage.getItem("userId");

    fetch(`/api/teams/user/${userId}`) // Assuming this endpoint returns the list of teams
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const { teamsAsCaptain } = data;
            const teamDropDown = document.getElementById('my-teams');
            const points = document.getElementById("prestige-points");

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
                        prestigePoints,
                    } = team;

                    const option = document.createElement('option');
                    option.value = teamId;
                    option.text = name;
                    teamDropDown.appendChild(option);
                });

                teamDropDown.addEventListener('change', () => {
                    const selectedTeamId = teamDropDown.value;
                    const selectedTeam = teamsAsCaptain.find(t => t.id == selectedTeamId);
                    points.innerHTML = `Sus puntos de prestigio: ${selectedTeam ? selectedTeam.prestigePoints : 0}`;
                });

                const buyButton = document.getElementById("buy-button");
                buyButton.addEventListener('click', () => {
                    const selectedTeamId = teamDropDown.value;
                    const selectedTeam = teamsAsCaptain.find(t => t.id == selectedTeamId);

                    if (selectedTeam) {
                        validateTransaction(article.article_price, selectedTeam.prestigePoints, article.id, selectedTeamId);
                    } else {
                        displayErrorMessage("Seleccione un equipo válido");
                    }
                });
            }

            // Trigger change event to set initial button state
            teamDropDown.dispatchEvent(new Event('change'));
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function validateTransaction(price, prestigePoints, articleId, teamId) {
    console.log("validando transaccion");
    if (prestigePoints >= price) {
        handleTransaction(articleId, teamId);
    } else {
        displayErrorMessage("No tiene suficientes puntos");
    }
}

function displaySuccessMessage(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.style.display = "block";
    setTimeout(() => {
        successMessage.style.display = "none";
    }, 3000);
}

function displayErrorMessage(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
}

function handleTransaction(articleId, teamId) {
    fetch(`/api/teams/${teamId}/purchase/${articleId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Transaccion exitosa");
            displaySuccessMessage("Artículo comprado con éxito");
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.addEventListener("DOMContentLoaded", loadArticle);
