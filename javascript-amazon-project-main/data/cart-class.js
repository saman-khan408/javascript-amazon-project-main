import { validDeliveryOption } from "./deliveryOptions.js";

class Cart {
  cartItems = undefined;
  #localStorageKey = undefined;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
    
  }
  #loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));
    if (!this.cartItems) {
      this.cartItems = [
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOptionId: "1",
        },
        {
          productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          quantity: 1,
          deliveryOptionId: "2",
        },
      ];
    }
  }

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }
  addToCart(productId, quantity = 1) {
    let matchingItem;
    quantity = Number(quantity);

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId,
        quantity,
        deliveryOptionId: "1",
      });
    }
    this.saveToStorage();
  }
  removeFromCart(productId) {
    const newCart = [];

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });
    this.cartItems = newCart;

    this.saveToStorage();
  }
  updateDeliveryOptions(productId, deliveryOptionId) {
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    if (!matchingItem) {
      return;
    }
    if (!validDeliveryOption(deliveryOptionId)) {
      return;
    }
    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }
  cartQuantitySelector(productId) {
    const quantitySelector = document.querySelector(
      `.js-quantity-selector-${productId}`,
    );

    return Number(quantitySelector.value);
  }
  calculateCartQuantity() {
    let cartQuantity = 0;
    this.cartItems.forEach((cartItem) => {
      cartQuantity += Number(cartItem.quantity);
    });
    return cartQuantity;
  }
  updateQuantity(productId, newQuantity) {
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    matchingItem.quantity = Number(newQuantity);
    this.saveToStorage();
  }
}

const cart = new Cart('cart-oop');
const buisnessCart = new Cart('cart-buisness');

console.log(cart);
console.log(buisnessCart);
