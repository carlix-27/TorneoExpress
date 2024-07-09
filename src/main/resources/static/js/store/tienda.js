
function fetchArticles() {
    /*
    * <div class="product-item">
                <img src="/img/penal.webp" alt="Product 1">
                <h3>Penal</h3>
                <p>25 puntos</p>
                <button>Comprar</button>
            </div>
    */
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
          productList.innerHTML = `
          <p>No hay ventajas disponibles</p>`;
        } else {
          articles.forEach(article => {
              const divItem = document.createElement("div");
              divItem.className = "product-item";
              const {
                  name: articleName,
                  description: articleDescription,
                  price: articlePrice,
              } = article;

              divItem.innerHTML = `
                 <h3>${articleName}</h3>
                 <p>Precio: ${articlePrice}</p>
                 <button>Comprar</button>
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