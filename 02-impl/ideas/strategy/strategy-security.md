# Security Strategy

## Overview
This document outlines the security measures implemented in our application, focusing on essential protections for a site serving under 10K users. While we don't need enterprise-scale security measures, we must ensure fundamental protections are in place.

### Summary
* Input Sanitization: Protection against XSS and injection attacks
* File Upload Security: Secure file handling with size and type restrictions
* Session Management: Secure session configuration
* OAuth Security: Additional OAuth state management
* Error Response Security: Preventing information leakage
* API Security Best Practices: Request limits and secure headers
* Security Testing Checklist: Regular security validation tasks
* Incident Response Plan: Clear steps for handling security incidents

These additions make the security strategy more comprehensive while still remaining appropriate for our scale. The document now covers:
* Preventive measures (input sanitization, file security)
* Operational security (session management, error handling)
* Testing and validation
* Incident response

## Core Security Measures

### 1. CSRF Protection
Cross-Site Request Forgery (CSRF) is an attack that forces authenticated users to submit unwanted requests. Protection is essential even at our scale.

#### Implementation Strategy
```typescript
// In main.ts
import * as csurf from 'csurf';

// Configure CSRF middleware
app.use(csurf({
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  }
}));

// In your controllers
@Post()
create(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
  // CSRF token is automatically validated
  // Will throw if token is invalid
}
```

#### CSRF Token Usage
1. Server provides token via secure cookie
2. Frontend includes token in meta tag
3. All POST/PUT/DELETE requests must include token
4. Requests without valid token are rejected

### 2. Rate Limiting
Prevents abuse of our API endpoints. Implementation should be reasonable for our scale while protecting against basic attacks.

#### Implementation Strategy
```typescript
// In app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60, // Time window (seconds)
      limit: 30, // Request limit per window
    })
  ]
})

// In controllers
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  // More aggressive limits for auth endpoints
  @Throttle(5, 60) // 5 requests per minute
  @Post('login')
  async login() {}

  // Standard limits
  @Throttle(30, 60) // 30 requests per minute
  @Get('profile')
  async getProfile() {}
}
```

#### Rate Limiting Strategy
- Authentication endpoints: 5 requests per minute
- Standard API endpoints: 30 requests per minute
- Public endpoints: 60 requests per minute
- Whitelist certain IPs (admin tools)

### 3. Security Headers
Essential HTTP headers to protect against common vulnerabilities.

#### Implementation
```typescript
// In main.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: true,
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
}));
```

### 4. Authentication Token Security

#### JWT Configuration
```typescript
// In auth.module.ts
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { 
    expiresIn: '1h',
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER
  },
})
```

#### Token Storage
- Access token: Short-lived (1 hour)
- Refresh token: Longer-lived (7 days)
- Store refresh tokens in database for revocation capability

### 5. Password Security

#### Hashing Strategy
```typescript
// In auth.service.ts
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

#### Password Requirements
- Minimum length: 8 characters
- Must contain: uppercase, lowercase, number
- Optional: special character
- Maximum length: 128 characters

### 6. Basic Audit Logging
Simple but effective logging for security events.

```typescript
// In audit.service.ts
@Injectable()
export class AuditService {
  constructor(private readonly logger: Logger) {}

  logSecurityEvent(
    eventType: 'LOGIN' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'LOGIN_FAILED',
    userId: string,
    metadata: Record<string, any> = {}
  ) {
    this.logger.log({
      timestamp: new Date(),
      eventType,
      userId,
      ip: metadata.ip,
      userAgent: metadata.userAgent,
      ...metadata
    });
  }
}
```

## Security Checklist for Deployment
- [ ] Enable HTTPS only
- [ ] Configure secure cookie settings
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Configure CORS appropriately
- [ ] Set up audit logging
- [ ] Review and update JWT settings
- [ ] Configure password policy
- [ ] Set up CSRF protection

## Monitoring and Alerts
For our scale, basic monitoring is sufficient:
- Failed login attempts exceeding threshold
- Rate limit violations
- Invalid JWT usage
- CSRF violations

## Regular Security Tasks
- Rotate JWT signing keys (quarterly)
- Review audit logs (weekly)
- Update security dependencies (monthly)
- Review security configurations (quarterly)

## Additional Security Considerations

### 7. Input Sanitization
Protection against XSS and injection attacks.

```typescript
// In main.ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe({
  transform: true,
  whitelist: true, // Strip unknown properties
  forbidNonWhitelisted: true, // Throw on unknown properties
}));

// Custom sanitizer for user input
import { Transform } from 'class-transformer';
import { sanitizeHtml } from 'sanitize-html';

export class CreateMessageDto {
  @Transform(({ value }) => sanitizeHtml(value, {
    allowedTags: [], // No HTML allowed
    allowedAttributes: {}, // No attributes allowed
  }))
  content: string;
}
```

### 8. File Upload Security
Secure file handling for user uploads.

```typescript
// In upload.service.ts
@Injectable()
export class UploadService {
  private readonly ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  async validateAndSaveFile(file: Express.Multer.File): Promise<string> {
    // Validate mime type
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('File too large');
    }

    // Generate safe filename
    const safeFileName = this.generateSafeFileName(file.originalname);
    
    // Store with virus scan (implementation depends on chosen solution)
    await this.scanAndStore(file, safeFileName);
    
    return safeFileName;
  }
}
```

### 9. Session Management
Secure session handling for authenticated users.

```typescript
// In main.ts
import * as session from 'express-session';

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    },
    name: 'sessionId' // Don't use default 'connect.sid'
  })
);
```

### 10. OAuth Security
Additional OAuth-specific security measures.

```typescript
// In oauth.service.ts
@Injectable()
export class OAuthService {
  private readonly STATE_TIMEOUT = 10 * 60 * 1000; // 10 minutes
  
  async generateOAuthState(userId: string): Promise<string> {
    const state = crypto.randomBytes(32).toString('hex');
    await this.redis.set(
      `oauth_state:${state}`,
      userId,
      'PX',
      this.STATE_TIMEOUT
    );
    return state;
  }

  async validateOAuthState(state: string): Promise<string | null> {
    const userId = await this.redis.get(`oauth_state:${state}`);
    await this.redis.del(`oauth_state:${state}`);
    return userId;
  }
}
```

### 11. Error Response Security
Secure error handling to prevent information leakage.

```typescript
// In filters/all-exceptions.filter.ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    // Log the full error internally
    this.logger.error(exception);
    
    // Return sanitized error to client
    const sanitizedError = this.sanitizeError(exception);
    
    response
      .status(sanitizedError.statusCode)
      .json({
        statusCode: sanitizedError.statusCode,
        message: sanitizedError.message,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest<Request>().url
      });
  }

  private sanitizeError(error: unknown): {statusCode: number; message: string} {
    // Return generic error in production
    if (process.env.NODE_ENV === 'production') {
      return {
        statusCode: 500,
        message: 'Internal server error'
      };
    }
    
    // More detailed errors in development
    return {
      statusCode: error instanceof HttpException ? error.getStatus() : 500,
      message: error instanceof Error ? error.message : 'Internal server error'
    };
  }
}
```

### 12. API Security Best Practices

#### Request Size Limits
```typescript
// In main.ts
app.use(json({ limit: '10kb' })); // Limit JSON payload size
app.use(urlencoded({ extended: true, limit: '10kb' })); // Limit URL-encoded payload
```

#### Secure Headers for File Downloads
```typescript
// In download.controller.ts
@Get('download/:fileId')
async downloadFile(
  @Param('fileId') fileId: string,
  @Res() response: Response
) {
  const file = await this.fileService.getFile(fileId);
  
  response.set({
    'Content-Disposition': `attachment; filename="${file.name}"`,
    'Content-Type': file.mimeType,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store'
  });
  
  return response.send(file.content);
}
```

## Security Testing Checklist
- [ ] Run OWASP ZAP scan monthly
- [ ] Perform penetration testing quarterly
- [ ] Validate file upload security
- [ ] Test rate limiting effectiveness
- [ ] Verify CSRF protection
- [ ] Check password policy enforcement
- [ ] Validate OAuth flow security
- [ ] Test error handling sanitization
- [ ] Verify input sanitization
- [ ] Check session security
- [ ] Test API payload limits

## Incident Response Plan
1. **Detection**
   - Monitor security logs
   - Set up alerts for suspicious activities
   - Enable user reporting of security issues

2. **Response**
   - Immediate assessment of threat level
   - Block compromised accounts if necessary
   - Rotate compromised credentials
   - Document incident details

3. **Recovery**
   - Patch security vulnerabilities
   - Restore from clean backups if needed
   - Reset affected user sessions
   - Update security measures

4. **Communication**
   - Notify affected users
   - Document lessons learned
   - Update security documentation


Here's a comprehensive overview of the security implementation layers and file locations:

```
security/
├── core/
│   ├── main.ts                    # Core security middleware setup
│   │   ├── CSRF configuration
│   │   ├── Rate limiting setup
│   │   ├── Helmet security headers
│   │   ├── Session management
│   │   └── Request size limits
│   │
│   ├── filters/
│   │   └── all-exceptions.filter.ts # Global error handling
│   │
│   └── pipes/
│       └── validation.pipe.ts      # Global input validation
│
├── auth/
│   ├── auth.module.ts             # JWT configuration
│   ├── auth.service.ts            # Password hashing/validation
│   └── oauth.service.ts           # OAuth state management
│
├── upload/
│   └── upload.service.ts          # File upload security
│
├── controllers/
│   ├── auth.controller.ts         # Rate-limited endpoints
│   └── download.controller.ts      # Secure file downloads
│
└── monitoring/
    ├── audit.service.ts           # Security event logging
    └── alerts/                    # Security monitoring
        ├── login-attempts.ts
        ├── rate-limits.ts
        └── csrf-violations.ts
```

Key Security Layers:

1. **Core Security Layer** (Entry Point)
   - CSRF Protection
   - Rate Limiting
   - Security Headers
   - Input Validation
   - Request Size Limits

2. **Authentication Layer**
   - Password Security
   - JWT Management
   - OAuth Security
   - Session Management

3. **Data Security Layer**
   - Input Sanitization
   - File Upload Security
   - Download Security
   - Error Handling

4. **Monitoring Layer**
   - Audit Logging
   - Security Event Detection
   - Alert Management

5. **Response Layer**
   - Error Sanitization
   - Security Headers
   - Response Validation

Implementation Flow:
```
Request → Core Security → Auth → Business Logic → Data Security → Response
   ↑                                                                ↓
   └────────────── Monitoring & Audit Logging ───────────────────┘
```

Key Configuration Files:
1. `main.ts`: Primary security middleware
2. `app.module.ts`: Security module configuration
3. `auth.module.ts`: Authentication setup
4. `*.controller.ts`: Endpoint-specific security
5. `*.service.ts`: Business logic security

Testing Files:
```
test/
├── security/
│   ├── csrf.spec.ts
│   ├── rate-limit.spec.ts
│   ├── file-upload.spec.ts
│   └── oauth.spec.ts
└── integration/
    └── security.integration.ts
```

This structure ensures:
- Clear separation of security concerns
- Layered security approach
- Centralized configuration
- Easy maintenance and updates
- Consistent security patterns
