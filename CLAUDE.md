# SellerSmart Project Context for AI Assistants

This document provides comprehensive context about the SellerSmart project for AI assistants.

## Project Overview

SellerSmart is a comprehensive e-commerce analytics and automation platform designed to help online sellers optimize their business operations.

## Project Location

All SellerSmart repositories are located at: `/Users/kal/GitHub/`

### Repository Structure
```
/Users/kal/GitHub/
├── SellerSmart-Architecture    # This repo - Documentation & PRDs
├── SellerSmart-API            # Main REST API gateway
├── SellerSmart-Web            # Frontend application
├── SellerSmart-Backend.BrandScan      # Brand analysis service
├── SellerSmart-Backend.InvOrders      # Inventory/Orders service
├── SellerSmart-Backend.RivalRadar     # Competitor tracking service
├── SellerSmart-Backend.WholesaleScan  # Wholesale sourcing service
└── SellerSmart-SiteMonitor    # Website monitoring service
```

## Development Workflow

### PRD Creation
1. Always run PRD creation from the SellerSmart-Architecture directory
2. Use the provided script: `./scripts/create-prd.sh`
3. PRDs should be comprehensive and reference existing code patterns
4. Each feature gets its own PRD with unique ID

### PRD Implementation
1. Run implementation from the SellerSmart-Architecture directory
2. Use the provided script: `./scripts/execute-prd.sh PRD_ID`
3. The script will guide you through implementing across all affected services
4. Mark checklist items as complete during implementation
5. PRD is automatically moved to completed folder when done

## Getting Started Checklist

When starting work on a new feature:
- [ ] Read relevant service documentation
- [ ] Review existing similar features
- [ ] Check database schemas
- [ ] Identify reusable components
- [ ] Create comprehensive PRD
- [ ] Get PRD approval
- [ ] Create feature branch
- [ ] Implement with tests
- [ ] Update documentation
- [ ] Submit PR for review
