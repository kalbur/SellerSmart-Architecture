# SellerSmart Architecture & Documentation

This repository contains all architectural documentation, PRDs, and project standards for the SellerSmart ecosystem.

## Repository Structure

```
SellerSmart-Architecture/
├── README.md              # This file
├── CLAUDE.md             # AI assistant context and project overview
├── ARCHITECTURE.md       # System architecture documentation
├── CONVENTIONS.md        # Coding standards and conventions
├── DATABASE_SCHEMA.md    # MongoDB schema documentation
├── API_CONTRACTS.md      # Inter-service API documentation
├── .prds/                # Product Requirement Documents
│   ├── processing/       # PRDs being worked on
│   ├── completed/        # Finished PRDs
│   └── templates/        # PRD templates
├── scripts/              # Utility scripts
│   └── create-prd.sh    # PRD creation script
├── diagrams/             # Architecture diagrams
└── service-docs/         # Individual service documentation
    ├── API.md
    ├── Web.md
    ├── BrandScan.md
    ├── InvOrders.md
    ├── RivalRadar.md
    ├── WholesaleScan.md
    └── SiteMonitor.md
```

## SellerSmart Services

The SellerSmart platform consists of the following services:

| Service | Purpose | Technology | Repository |
|---------|---------|------------|------------|
| **API** | Main REST API gateway | Node.js/Express | SellerSmart-API |
| **Web** | Frontend application | Next.js | SellerSmart-Web |
| **BrandScan** | Brand analysis microservice | TBD | SellerSmart-Backend.BrandScan |
| **InvOrders** | Inventory & orders management | TBD | SellerSmart-Backend.InvOrders |
| **RivalRadar** | Competitor tracking service | TBD | SellerSmart-Backend.RivalRadar |
| **WholesaleScan** | Wholesale price monitoring | TBD | SellerSmart-Backend.WholesaleScan |
| **SiteMonitor** | Website monitoring service | TBD | SellerSmart-SiteMonitor |

## Getting Started

1. **Creating a PRD**: Run `./scripts/create-prd.sh` from this directory
2. **Understanding the Architecture**: Read `ARCHITECTURE.md`
3. **Coding Standards**: Review `CONVENTIONS.md` before contributing
4. **Database Schema**: Check `DATABASE_SCHEMA.md` for MongoDB collections
5. **API Documentation**: See `API_CONTRACTS.md` for service interfaces

## Quick Links

- [System Architecture](./ARCHITECTURE.md)
- [Coding Conventions](./CONVENTIONS.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [API Contracts](./API_CONTRACTS.md)
- [PRD Template](./.prds/templates/PRD_TEMPLATE.md)

## For AI Assistants

If you're an AI assistant working on this project, start by reading:
1. `CLAUDE.md` - Contains project context and guidelines
2. `ARCHITECTURE.md` - Understand the system design
3. Service-specific docs in the `service-docs/` directory

## Maintenance

This documentation should be updated whenever:
- New services are added
- Architecture changes are made
- API contracts are modified
- New conventions are established
- PRDs are completed
