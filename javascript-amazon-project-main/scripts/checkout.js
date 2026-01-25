import { products } from "../data/products.js";
import { cart, removeFromCart, calculateCartQuantity, updateQuantity } from "../data/cart.js";
import { formatCurrency } from "./utils/money.js";

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProducts;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProducts = product;
    }
  });

  cartSummaryHTML += `
     <div class="cart-item-container js-cart-item-container-${matchingProducts.id}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProducts.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProducts.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProducts.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingProducts.id}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProducts.id}">
                    Update
                  </span>
                  <input type="number" class="quantity-input js-quantity-input-${matchingProducts.id}">
                      <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProducts.id}">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProducts.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProducts.id}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProducts.id}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProducts.id}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    
    `;
});

document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);
    
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();

    updateCartQuantity();
  });
  
});
function updateCartQuantity(){
  const cartQuantity = calculateCartQuantity();
document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
}
updateCartQuantity();
document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.add('is-editing-quantity');
  });
});
document.querySelectorAll('.js-save-link').forEach((link) => {
  link.addEventListener('click',() =>{
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.remove('is-editing-quantity');

    const quantityInput =document.querySelector(`.js-quantity-input-${productId}`);
    const newQuantity = Number(quantityInput.value);
    if(newQuantity<0){
      alert('Quantity must be atleast 0');
      return;
    }
    updateQuantity(productId, newQuantity);
    
    const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
    quantityLabel.innerHTML= newQuantity;
    updateCartQuantity();
  });
});