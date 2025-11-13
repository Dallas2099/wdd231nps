// params.js

const products = [
  { id: 1, name: "Product 1", price: 3, image: "https://placehold.co/300" },
  { id: 2, name: "Product 2", price: 5, image: "https://placehold.co/300" },
  { id: 3, name: "Product 3", price: 1, image: "https://placehold.co/300" }
];

console.log(window.location);

function getParam(key) {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(key);
  return value === null ? null : value;
}

function productTemplate(product) {
  const price = Number(product.price).toFixed(2);
  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-media">
        <img src="${product.image}" alt="${product.name} image">
      </div>
      <div class="product-body">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">$${price}</p>
        <div class="product-actions">
          <a class="btn" href="index.html">Back to products</a>
        </div>
      </div>
    </article>
  `;
}

function renderNotice(title, body) {
  return `
    <div class="notice">
      <p><strong>${title}</strong></p>
      <p>${body}</p>
    </div>
  `;
}

function getProductDetails() {
  const slot = document.getElementById("product-slot");
  if (!slot) return;

  const idParam = getParam("productId");
  if (!idParam) {
    slot.innerHTML = renderNotice(
      "No product selected.",
      `Try choosing one from the <a href="index.html">Featured Products</a>.`
    );
    return;
  }

  const id = Number(idParam);
  if (Number.isNaN(id)) {
    slot.innerHTML = renderNotice(
      "Invalid product id.",
      `Return to the <a href="index.html">Featured Products</a> and try again.`
    );
    return;
  }

  const product = products.find((item) => item.id === id);
  if (!product) {
    slot.innerHTML = renderNotice(
      "Product not found.",
      `Please select another item from the <a href="index.html">Featured Products</a>.`
    );
    return;
  }

  slot.innerHTML = productTemplate(product);
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("product-slot")) {
    getProductDetails();
  }
});
