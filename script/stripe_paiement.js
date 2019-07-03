function stripe_paiement(balance, stripe_price) {
  if (stripe_price > balance) {
    <script
    src = "https://checkout.stripe.com/checkout.js"
    class = "stripe-button"
    data-key = "pk_live_vRwyhWo7Dyv2vDGcWP7kYL34"
    data-name = "Price of course"
    data-description = "this is the payment"
    data-currency = "eur"
    data-locale = "auto"
    data-amount = stripe_price
    ></script>
    return false;
  }
  else {
    return true;
  }
}
