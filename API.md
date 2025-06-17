# BySquare QR Payment API

This API provides endpoints for generating BySquare-compliant QR codes for Slovak payments and managing usage limits.

## Authentication

Most endpoints require authentication using Clerk JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Anonymous users can use the QR generation endpoint with limited usage (10 QR codes per week).

## Rate Limits

| Plan | QR Codes/Month | API Access |
|------|---------------|------------|
| Anonymous | 10/week | Limited |
| Free | 150 | No |
| Starter | 500 | Yes |
| Professional | Unlimited | Yes |

## Endpoints

### Generate QR Code

`POST /api/v1/qr/generate`

Generate a BySquare QR code for payment.

**Request Body:**
```json
{
  "iban": "SK1234567890123456789012",
  "amount": 25.50,
  "variableSymbol": "12345678",
  "constantSymbol": "1234",
  "specificSymbol": "87654321",
  "message": "Payment for services"
}
```

**Required Fields:**
- `iban` - Slovak IBAN (24 characters, starts with SK)
- `amount` - Payment amount in EUR (0.01 - 99,999,999.99)

**Optional Fields:**
- `variableSymbol` - 1-10 digits (auto-generated if not provided)
- `constantSymbol` - 1-4 digits
- `specificSymbol` - 1-10 digits
- `message` - Payment description (max 140 characters)

**Response:**
```json
{
  "success": true,
  "data": {
    "qrId": "550e8400-e29b-41d4-a716-446655440000",
    "qrData": "000500010200001024SK12345678901234567890121003255010000000012345678100800010Payment for services",
    "variableSymbol": "12345678"
  },
  "rateLimit": {
    "remaining": 149,
    "resetDate": "2024-02-01T00:00:00.000Z",
    "plan": "free"
  }
}
```

**Error Responses:**
```json
// Validation Error (400)
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "code": "invalid_string",
      "path": ["iban"],
      "message": "Invalid Slovak IBAN format"
    }
  ]
}

// Rate Limit Exceeded (429)
{
  "error": "Monthly QR generation limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED"
}

// Payment Required (402)
{
  "error": "Payment required to continue using the service",
  "code": "PAYMENT_REQUIRED"
}
```

### Retrieve QR Code

`GET /api/v1/qr/generate?id={qrId}`

Retrieve a previously generated QR code (authenticated users only).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "qrData": "000500010200001024SK12345678901234567890121003255010000000012345678100800010Payment for services",
    "variableSymbol": "12345678",
    "amount": "25.50",
    "iban": "SK1234567890123456789012",
    "description": "Payment for services",
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "status": "generated"
  }
}
```

### Check Usage Limits

`GET /api/v1/account/usage`

Get current usage statistics and limits (authenticated users only).

**Response:**
```json
{
  "success": true,
  "data": {
    "current": {
      "used": 75,
      "limit": 150,
      "remaining": 75,
      "plan": "free",
      "resetDate": "2024-02-01T00:00:00.000Z"
    },
    "monthlyTrend": [
      { "date": "2024-01-01", "count": 10 },
      { "date": "2024-01-02", "count": 5 },
      { "date": "2024-01-03", "count": 12 }
    ]
  }
}
```

## Usage Examples

### cURL

```bash
# Generate QR code (anonymous)
curl -X POST https://your-domain.com/api/v1/qr/generate \
  -H "Content-Type: application/json" \
  -d '{
    "iban": "SK1234567890123456789012",
    "amount": 25.50,
    "message": "Test payment"
  }'

# Generate QR code (authenticated)
curl -X POST https://your-domain.com/api/v1/qr/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "iban": "SK1234567890123456789012",
    "amount": 25.50,
    "variableSymbol": "12345678",
    "message": "Invoice payment"
  }'

# Check usage
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-domain.com/api/v1/account/usage
```

### JavaScript

```javascript
// Generate QR code
const response = await fetch('/api/v1/qr/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Optional for anonymous
  },
  body: JSON.stringify({
    iban: 'SK1234567890123456789012',
    amount: 25.50,
    message: 'Payment for services'
  })
});

const result = await response.json();

if (result.success) {
  console.log('QR Data:', result.data.qrData);
  console.log('Remaining:', result.rateLimit.remaining);
} else {
  console.error('Error:', result.error);
}

// Check usage limits
const usageResponse = await fetch('/api/v1/account/usage', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const usage = await usageResponse.json();
console.log('Usage:', usage.data.current);
```

## BySquare QR Format

The generated QR codes follow the BySquare standard for Slovak payments. The QR data string contains:

- Payment amount in cents
- Slovak IBAN
- Variable, constant, and specific symbols
- Payment message/note
- Currency code (EUR)

These QR codes can be scanned by any Slovak banking application for instant payment processing.

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `RATE_LIMIT_EXCEEDED` | Usage limit exceeded |
| `PAYMENT_REQUIRED` | Subscription payment required |
| `SUBSCRIPTION_CANCELED` | Subscription canceled |
| `PROFILE_NOT_FOUND` | User profile not found |
| `QR_NOT_FOUND` | QR code not found |
| `UNAUTHORIZED` | Authentication required |
| `INTERNAL_ERROR` | Server error |

## Development

For development and testing, you can use the anonymous endpoint with basic fields. For production usage and advanced features, create an account and choose an appropriate subscription plan. 