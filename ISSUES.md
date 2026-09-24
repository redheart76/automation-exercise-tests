# Issues observed during testing

## Transient payment success message

The payment form briefly reveals #success_message with the text "Your order has been placed successfully!" during submission, then navigates to the order confirmation page. A normal assertion made after the click can miss this element because navigation removes the original DOM.

I found this while implementing TC14 and TC15, and reproduced it in the trace viewer. The payment page watches for the message before the click, passes the text back to the test process, and then checks the persistent Order Placed! confirmation after navigation.

## Environment availability

The exercise's test host may be unavailable or may behave differently from the dev host. This is handled as an environment condition by the fixture rather than reported as an application failure unless REQUIRE_LIVE=1 is set.
