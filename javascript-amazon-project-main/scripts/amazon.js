import { cart } from "../data/cart-class.js";
import { products, loadProducts } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
loadProducts(renderProductsGrid);

function renderProductsGrid() {
  let productsHTML = "";
  const url = new URL(window.location.href);
  const search = url.searchParams.get("search");
  let filterProducts = products;

  if (search) {
    filterProducts = products.filter((product) => {
      let matchingKeyword = false;
      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(search.toLowerCase())) {
          matchingKeyword = true;
        }
      });
      return matchingKeyword || product.name.toLowerCase().includes(search.toLowerCase());
    });
  }
  filterProducts.forEach((product) => {
    productsHTML += `
    <div class="product-container">
          <div class="product-image-container">
            <img
              class="product-image"
              src="${product.image}"
            />
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img
              class="product-rating-stars"
              src="${product.getStarUrl()}"
            />
            <div class="product-rating-count link-primary">${
              product.rating.count
            }</div>
          </div>

          <div class="product-price">${product.getPrice()}</div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
            ${product.extraInfoHTML()}
          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-msg-${product.id}">
            <img src="images/icons/checkmark.png" />
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${
            product.id
          }">Add to Cart</button>
        </div>
    `;
  });
  function updateCartQuantity() {
    const cartQuantity = cart.calculateCartQuantity();
    document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
  }
  updateCartQuantity();

  document.querySelector(".js-products-grid").innerHTML = productsHTML;
  let addedMessageTimeout = {};
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset;
      const quantity = cart.cartQuantitySelector(productId);
      cart.addToCart(productId, quantity);
      updateCartQuantity();

      const msg = document.querySelector(`.js-added-msg-${productId}`);
      msg.style.opacity = 1;
      if (addedMessageTimeout[productId]) {
        clearTimeout(addedMessageTimeout[productId]);
      }
      addedMessageTimeout[productId] = setTimeout(() => {
        msg.style.opacity = 0;
      }, 2000);
    });
  });
  document.querySelector(".js-search-button").addEventListener("click", () => {
    const search = document.querySelector(".js-search-bar").value;
    window.location.href = `amazon.html?search=${search}`;
  });
    const searchInput = document.querySelector('.js-search-bar');
    searchInput.addEventListener('keydown',(event) => {
      if(event.key === 'Enter'){
        const search = searchInput.value;
        window.location.href = `amazon.html?search=${search}`;
      }
    })
}
