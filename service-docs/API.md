# SellerSmart API Service Documentation

## Overview
Main API gateway for the SellerSmart platform. Handles authentication, request routing, and response aggregation.

## Technology Stack
- Node.js
- Express.js
- JWT Authentication
- MongoDB connection

## Key Responsibilities
- User authentication and authorization
- Request routing to microservices
- Response aggregation
- Rate limiting
- API versioning

## API Endpoints

### Authentication
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

### User Management
- `GET /api/v1/users/profile`
- `PUT /api/v1/users/profile`
- `DELETE /api/v1/users/account`

### Service Proxies
Routes to respective microservices:
- `/api/v1/brands/*` → BrandScan
- `/api/v1/inventory/*` → InvOrders
- `/api/v1/orders/*` → InvOrders
- `/api/v1/competitors/*` → RivalRadar
- `/api/v1/suppliers/*` → WholesaleScan
- `/api/v1/monitors/*` → SiteMonitor

## Configuration
Environment variables needed:
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `SERVICE_URLS` (for each microservice)

## Development Notes
(To be updated after codebase analysis)
