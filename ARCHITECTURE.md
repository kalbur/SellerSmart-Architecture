# SellerSmart System Architecture

## Overview

SellerSmart follows a microservices architecture pattern with a central API gateway and specialized backend services.

## Architecture Diagram

```
┌─────────────────┐
│   SellerSmart   │
│      Web        │
│   (Next.js)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   SellerSmart   │
│      API        │
│  (API Gateway)  │
└────────┬────────┘
         │
    ┌────┴────┬──────┬──────┬──────┬──────┐
    ▼         ▼      ▼      ▼      ▼      ▼
┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐
│Brand   ││Inv     ││Rival   ││Whole   ││Site    │
│Scan    ││Orders  ││Radar   ││sale    ││Monitor │
│Service ││Service ││Service ││Scan    ││Service │
└────────┘└────────┘└────────┘└────────┘└────────┘
```

## Services

- **API Gateway**: Central entry point, authentication, routing
- **Web**: Frontend application (Next.js)
- **BrandScan**: Brand analysis and monitoring
- **InvOrders**: Inventory and order management
- **RivalRadar**: Competitor tracking
- **WholesaleScan**: Wholesale supplier management
- **SiteMonitor**: E-commerce website monitoring

## Database

MongoDB with service-specific databases and shared user data.
