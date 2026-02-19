export let cart;
loadFromStorage();
export function loadFromStorage(){
  cart = JSON.parse(localStorage.getItem("cart"));
if (!cart) {
  cart = [
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
export function cartQuantitySelector(productId) {
  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`,
  );

  return Number(quantitySelector.value);
}

export function addToCart(productId, quantity=1) {
  let matchingItem;
    quantity = Number(quantity);

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      deliveryOptionId: "1",
    });
  }
  saveToStorage();
}
export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += Number(cartItem.quantity);
  });
  return cartQuantity;
}
function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;

  saveToStorage();
}
export function updateQuantity(productId, newQuantity) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  matchingItem.quantity = Number(newQuantity);
  saveToStorage();
}

export function updateDeliveryOptions(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  if(!matchingItem){
    return;
  }
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}



