import { renderOrderSummary } from "./checkout/orderSummery.js";
import { renderPaymentSummary } from "./checkout/paymentSummery.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import '../data/cart-class.js'

renderCheckoutHeader();
renderOrderSummary();
renderPaymentSummary();