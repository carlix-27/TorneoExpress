
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

            articleSection.innerHTML = "";
            articleSection.innerHTML = `
                <div id="article-result">
                    <h2>${article.name}</h2>
                    <p>Descripcion: ${article.description}</p>
                    <p>Price: ${article.price}</p>
                </div>
            `;
        })

        .catch(error => {
            console.error('Error:', error);
        });
}

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadArticle);
