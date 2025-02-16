#### Payment Integration Tree
```
├── models/
│   └── Organization.ts                # Includes stripeCustomerId
├── services/
│   ├── StripeService.ts              # Core Stripe integration
│   └── StripeService.spec.ts         # Stripe service testing
├── controllers/
│   ├── StripeController.ts           # Payment and webhook endpoints
│   └── StripeController.spec.ts      # Payment API testing
├── config/
│   └── stripe.config.ts              # Stripe configuration
└── test/
    └── __mocks__/
        └── stripe.mock.ts            # Stripe test data
```

### Endpoint Design
```
// ... existing endpoints ...

Stripe Integration:
- POST   /organizations/:organizationId/stripe/webhook           # Stripe webhook handler
- GET    /organizations/:organizationId/stripe/payment-methods   # List organization's payment methods
- POST   /organizations/:organizationId/stripe/payment-methods/default  # Set default payment method
- DELETE /organizations/:organizationId/stripe/payment-methods/:id      # Remove payment method
``` 