import { products, getProduct } from "../../data/products.js";
import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOptions,
} from "../../data/cart.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummery.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProducts = getProduct(productId);
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);
    cartSummaryHTML += `
      <div class=" js-cart-item-container js-cart-item-container-${matchingProducts.id}">
              <div class="delivery-date">
                Delivery date: ${dateString}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${matchingProducts.image}">

                <div class="cart-item-details">
                  <div class="product-name js-product-name-${matchingProducts.id}">
                    ${matchingProducts.name}
                  </div>
                  <div class="product-price js-product-price-${matchingProducts.id}">
                    $${formatCurrency(matchingProducts.priceCents)}
                  </div>
                  <div class="product-quantity js-product-quantity-${matchingProducts.id}">
                    <span>
                      Quantity: <span class="quantity-label js-quantity-label-${matchingProducts.id}">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProducts.id}">
                      Update
                    </span>
                    <input type="number" class="quantity-input js-quantity-input-${matchingProducts.id} js-enter-quantity" data-product-id="${matchingProducts.id}">
                        <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProducts.id}">Save</span>
                    <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProducts.id}" data-product-id="${matchingProducts.id}">
                      Delete
                    </span>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${deliveryOptionsHTML(matchingProducts, cartItem)}
                  
                </div>
              </div>
            </div>
      
      `;
  });
  function deliveryOptionsHTML(matchingProducts, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;
      const isCheked = deliveryOption.id === cartItem.deliveryOptionId;
      html += `<div class="delivery-option js-delivery-option js-delivery-option-${matchingProducts.id}-${deliveryOption.id}" data-product-id="${matchingProducts.id}" data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio"
                    ${isCheked ? "checked" : ""}
                      class="delivery-option-input js-delivery-option-input-${matchingProducts.id}-${deliveryOption.id}"
                      name="delivery-option-${matchingProducts.id}">
                    <div>
                      <div class="delivery-option-date">
                        ${dateString}
                      </div>
                      <div class="delivery-option-price">
                        ${priceString} Shipping
                      </div>
                    </div>
                  </div>
                  `;
    });
    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`,
      );
      container.remove();

      updateCartQuantity();

      renderPaymentSummary();
      renderCheckoutHeader();
    });
  });
  function updateCartQuantity() {
    const cartQuantity = calculateCartQuantity();
    document.querySelector(".js-return-to-home-link").innerHTML =
      `${cartQuantity} items`;
  }
  updateCartQuantity();
  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`,
      );
      container.classList.add("is-editing-quantity");
    });
  });
  document.querySelectorAll(".js-save-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`,
      );
      container.classList.remove("is-editing-quantity");

      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`,
      );
      const newQuantity = Number(quantityInput.value);
      if (newQuantity < 0) {
        alert("Quantity must be atleast 0");
        return;
      }
      updateQuantity(productId, newQuantity);

      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`,
      );
      quantityLabel.innerHTML = newQuantity;
      updateCartQuantity();
    });
  });
  document.querySelectorAll(".js-enter-quantity").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const productId = input.dataset.productId;
        const container = document.querySelector(
          `.js-cart-item-container-${productId}`,
        );
        container.classList.remove("is-editing-quantity");

        const quantityInput = document.querySelector(
          `.js-quantity-input-${productId}`,
        );
        const newQuantity = Number(quantityInput.value);
        if (newQuantity < 0) {
          alert("Quantity must be atleast 0");
          return;
        }
        updateQuantity(productId, newQuantity);

        const quantityLabel = document.querySelector(
          `.js-quantity-label-${productId}`,
        );
        quantityLabel.innerHTML = newQuantity;
        updateCartQuantity();
      }
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOptions(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
