# Feedback on the exercise

- The API returns business outcomes such as "User exists!" and "User not found!" in the response body while using HTTP 200. Calling this out in the API documentation would make the expected assertions clearer.
- The payment success message is transient and is followed by navigation. A note explaining which message should be checked, and at what point, would remove some ambiguity.
- It would help to say whether the test environment is expected to be continuously available. That would make the skip-versus-fail decision clearer.
