# Stripe Integration Design

## Overview
This document outlines the integration between our system and Stripe for payment processing, focusing on organization-level billing management using Stripe's pre-built solutions.

## Data Storage Strategy

### Stored in Stripe
- All payment method details (credit cards, bank accounts)
- Customer information
- Transaction history
- Subscription details
- Invoice data
- Payment processing
- Security-sensitive data

### Stored Locally

#### Organization Model Changes
```typescript
@Entity()
class Organization {
    // Existing fields...

    /** Stripe customer ID for organization billing */
    @Column({ type: 'varchar', length: 255, nullable: true })
    stripeCustomerId?: string;

    /** Organization's subscription status */
    @Column({ type: 'varchar', length: 50, nullable: true })
    subscriptionStatus?: string;  // 'active', 'past_due', 'canceled', etc.
}
```

## Service Layer Design

### StripeService
```typescript
@Injectable()
class StripeService {
    private stripe: Stripe;

    constructor(
        private readonly config: ConfigService,
        private readonly organizationService: OrganizationService
    ) {
        this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY')!, {
            apiVersion: '2023-10-16'
        });
    }

    // Customer Management
    async getOrCreateCustomer(organizationId: string): Promise<string>;
    async updateCustomer(organizationId: string, data: Stripe.CustomerUpdateParams): Promise<Stripe.Customer>;

    // Payment Methods
    async listPaymentMethods(organizationId: string): Promise<Stripe.PaymentMethod[]>;
    async setDefaultPaymentMethod(organizationId: string, paymentMethodId: string): Promise<void>;
    async removePaymentMethod(paymentMethodId: string): Promise<void>;

    // Webhook Handling
    async handleWebhookEvent(event: Stripe.Event): Promise<void>;
}
```

## Controller Layer Design

### StripeController
```typescript
@Controller('organizations/:organizationId/stripe')
class StripeController {
    @Post('webhook')
    async handleWebhook(@Headers('stripe-signature') signature: string, @Body() rawBody: Buffer): Promise<void>;

    @Get('payment-methods')
    async listPaymentMethods(@Param('organizationId') organizationId: string): Promise<Stripe.PaymentMethod[]>;

    @Post('payment-methods/default')
    async setDefaultPaymentMethod(
        @Param('organizationId') organizationId: string,
        @Body() data: { paymentMethodId: string }
    ): Promise<void>;

    @Delete('payment-methods/:id')
    async removePaymentMethod(
        @Param('organizationId') organizationId: string,
        @Param('id') paymentMethodId: string
    ): Promise<void>;
}
```

## Frontend Integration

### Stripe Elements Integration
```typescript
function PaymentMethodForm() {
    return (
        <Elements stripe={stripePromise}>
            <PaymentElement 
                options={{
                    // Customize appearance
                    theme: 'flat',
                    variables: {
                        colorPrimary: '#0570de',
                        colorBackground: '#ffffff',
                    }
                }}
            />
        </Elements>
    );
}
```

## Security Considerations

1. **Environment Variables**
   ```typescript
   STRIPE_SECRET_KEY=sk_...
   STRIPE_PUBLISHABLE_KEY=pk_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

2. **Authorization**
   - Only organization admins can manage payment methods
   - Only organization admins can view billing details
   - Organization-level access control

3. **Webhook Verification**
   - Verify Stripe signature on all webhook requests
   - Use raw body buffer for signature verification
   - Implement proper error handling for invalid signatures

## Implementation Phases

### Phase 1: Core Setup
1. Add Stripe dependencies
2. Set up environment variables
3. Add Organization model changes
4. Implement basic StripeService
5. Set up webhook handling

### Phase 2: Frontend Integration
1. Add Stripe Elements components
2. Implement payment method management UI
3. Add proper error handling
4. Implement loading states

### Phase 3: Testing & Security
1. Add comprehensive test coverage
2. Implement proper error handling
3. Add logging and monitoring
4. Security review and hardening

## Testing Strategy

1. **Unit Tests**
   - Service method testing
   - Webhook handler testing
   - Error handling testing

2. **Integration Tests**
   - Stripe API interaction testing
   - Webhook handling testing
   - Payment flow testing

3. **Mock Strategy**
   ```typescript
   // Mock Stripe responses
   const mockStripeCustomer = {
       id: 'cus_123',
       object: 'customer',
       // ...
   };

   // Mock payment method data
   const mockPaymentMethod = {
       id: 'pm_123',
       type: 'card',
       card: {
           brand: 'visa',
           last4: '4242'
       }
   };
   ```

## Error Handling

1. **Stripe Errors**
   - Card declined
   - Invalid payment method
   - Insufficient funds
   - Authentication required

2. **System Errors**
   - Database errors
   - Validation errors
   - Configuration errors

3. **Error Response Format**
   ```typescript
   interface ErrorResponse {
       code: string;
       message: string;
       details?: any;
   }
   ```