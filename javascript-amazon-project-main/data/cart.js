export const cart = [];

 export function cartQuantitySelector(productId){
  const quantitySelector = document.querySelector(
      `.js-quantity-selector-${productId}`,
    );

    return Number(quantitySelector.value);
}

export function addToCart(productId, quantity) {
  let matchingItem;
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
        });
      }
    }
