#### Payment Integration Tree
```
├── models/
│   ├── CustomerPaymentMethod.ts       # Stripe payment method references
│   └── CustomerPaymentMethod.spec.ts  # Payment method validation
├── services/
│   ├── StripeService.ts              # Core Stripe integration
│   ├── StripeService.spec.ts         # Stripe service testing
│   ├── CustomerPaymentMethodService.ts    # Payment method management
│   └── CustomerPaymentMethodService.spec.ts # Service testing
├── controllers/
│   ├── StripeController.ts           # Payment and webhook endpoints
│   └── StripeController.spec.ts      # Payment API testing
├── config/
│   └── stripe.config.ts              # Stripe configuration
└── test/
    └── __mocks__/
        └── payment.mock.ts           # Payment method test data
```

### Endpoint Design
```
// ... existing endpoints ...

Stripe Integration:
- POST   /stripe/webhook           # Stripe webhook handler
- POST   /payment-methods          # Add payment method
- GET    /payment-methods          # List user's payment methods
- PATCH  /payment-methods/:id      # Update payment method (set default)
- DELETE /payment-methods/:id      # Remove payment method
``` 