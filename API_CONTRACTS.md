# SellerSmart API Contracts

## Overview
This document defines the API contracts between SellerSmart services.

## Service Communication

### API Gateway → Microservices
All microservice calls from the API gateway include:
- Authentication headers
- Request ID for tracking
- User context

### Inter-Service Communication
Services communicate using:
- REST APIs
- Standardized error formats
- Consistent response structures

## Common Headers
```
X-Request-ID: uuid
X-User-ID: user-id
X-Auth-Token: jwt-token
Content-Type: application/json
```

## Standard Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2024-03-15T10:30:00Z"
}
```

## Note
Detailed API contracts will be documented after service analysis.
