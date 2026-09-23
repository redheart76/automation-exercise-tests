import { test } from '../../src/fixtures/account-fixtures';
import { environment } from '../../config/environment';
import { createPaymentDetails } from '../../src/data/payment';
import { createHomePage } from '../../src/pages/home-page';
import { createProductPage } from '../../src/pages/product-page';
import { createCartPage } from '../../src/pages/cart-page';
import { createAccountPage } from '../../src/pages/account-page';
import { createCheckoutPage } from '../../src/pages/checkout-page';
import { createPaymentPage } from '../../src/pages/payment-page';

test.describe('Checkout', () => {
  test.setTimeout(60_000);

  test('TC14: register while checking out', async ({
    page,
    unregisteredUser: user,
  }) => {
    const home = createHomePage(page, environment.baseUrl);
    const products = createProductPage(page, environment.baseUrl);
    const cart = createCartPage(page);
    const account = createAccountPage(page);
    const checkout = createCheckoutPage(page);
    const payment = createPaymentPage(page);

    await home.navigateToHomePage();
    await home.navigateToProducts();
    const items = [await products.addProduct(1), await products.addProduct(2)];
    await home.navigateToCart();
    await cart.expectItems(items);
    await cart.proceedToCheckout();
    await cart.registerFromCheckout();
    await account.register(user);
    await home.navigateToCart();
    await cart.expectItems(items);
    await cart.proceedToCheckout();
    await checkout.expectOrder(user, items);
    await checkout.placeOrder('Please leave this test order at reception.');
    await payment.pay(createPaymentDetails(user.name));
    await payment.expectOrderPlaced();
    await home.deleteAccount();
  });

  test('TC15: register before checking out', async ({
    page,
    unregisteredUser: user,
  }) => {
    const home = createHomePage(page, environment.baseUrl);
    const products = createProductPage(page, environment.baseUrl);
    const cart = createCartPage(page);
    const account = createAccountPage(page);
    const checkout = createCheckoutPage(page);
    const payment = createPaymentPage(page);

    await home.navigateToHomePage();
    await account.openSignup();
    await account.register(user);
    await home.navigateToProducts();
    const items = [await products.addProduct(1), await products.addProduct(2)];
    await home.navigateToCart();
    await cart.expectItems(items);
    await cart.proceedToCheckout();
    await checkout.expectOrder(user, items);
    await checkout.placeOrder('Please leave this test order at reception.');
    await payment.pay(createPaymentDetails(user.name));
    await payment.expectOrderPlaced();
    await home.deleteAccount();
  });
});
