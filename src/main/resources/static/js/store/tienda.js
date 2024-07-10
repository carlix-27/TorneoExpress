function fetchArticles() {
    fetch('/api/articles/all')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(articles => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';

            if (articles.length === 0) {
                productList.innerHTML = `<p>No hay ventajas disponibles</p>`;
            } else {
                articles.forEach(article => {
                    // Log the article object to verify its structure
                    console.log(article);

                    const divItem = document.createElement("div");
                    divItem.className = "product-item";
                    const {
                        id: articleId,
                        article_name: articleName,
                        article_description: articleDescription,
                        article_price: articlePrice,
                    } = article;

                    // Log the destructured values to verify they are not undefined
                    console.log('Name:', articleName, 'Price:', articlePrice);

                    divItem.innerHTML = `
            <h3>${articleName}</h3>
            <p>Precio: ${articlePrice}</p>
            <a href="article.html?article-id=${articleId}"><button>Comprar</button></a>
          `;
                    productList.appendChild(divItem);
                });
            }

            document.querySelectorAll('.signup-button').forEach(button => {
                button.addEventListener('click', function () {
                    showSignupModal(this.getAttribute('data-tournament-id'));
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').innerText = 'Error al obtener los torneos activos.';
            document.getElementById('error-message').style.display = 'block';
        });
}

document.addEventListener("DOMContentLoaded", fetchArticles);
