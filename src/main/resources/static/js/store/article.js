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
            connectWebSocket();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function fetchMyTeams(article) {
    const userId = localStorage.getItem("userId");

    fetch(`/api/teams/user/${userId}`)
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


function handleTransaction(articleId, teamId) {
    fetch(`/api/teams/${teamId}/purchase/${articleId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to purchase article: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Transaction completed");
            displaySuccessMessage("Compra exitosa");
        })
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage("Fondos insuficientes");
        });
}

function connectWebSocket() {
    let socket = new SockJS('/ws');
    let stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/points', function (message) {
            updatePrestigePoints(JSON.parse(message.body));
        });
    });
}

function updatePrestigePoints(updatedTeam) {
    const teamDropDown = document.getElementById('my-teams');
    const selectedTeamId = teamDropDown.value;
    if (updatedTeam.id == selectedTeamId) {
        const points = document.getElementById("prestige-points");
        points.innerHTML = `Sus puntos de prestigio: ${updatedTeam.prestigePoints}`;

        const selectedTeam = teamsAsCaptain.find(t => t.id == selectedTeamId);
        if (selectedTeam) {
            selectedTeam.prestigePoints = updatedTeam.prestigePoints;
        }
    }
}

function goBack() {
    window.history.back();
}

document.addEventListener("DOMContentLoaded", loadArticle);