
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
            articleSection.innerHTML = "";
            articleSection.innerHTML = `
                <div id="article-result">
                    <h2>${articleName}</h2>
                    <p>Descripcion: ${articleDescription}</p>
                    <p>Precio: ${articlePrice}</p>
                    
                </div>
            `;
        })

        .catch(error => {
            console.error('Error:', error);
        });
}

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadArticle);
