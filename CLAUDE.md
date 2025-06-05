# SellerSmart Project Context for AI Assistants

This document provides comprehensive context about the SellerSmart project for AI assistants (Claude, etc.).

## Project Overview

SellerSmart is a comprehensive e-commerce analytics and automation platform designed to help online sellers optimize their business operations. The platform provides tools for brand analysis, inventory management, competitor tracking, wholesale sourcing, and market monitoring.

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

## Technology Stack

### Frontend (SellerSmart-Web)
- Framework: Next.js
- UI Library: (TBD - check package.json)
- State Management: (TBD)
- Styling: (TBD)

### Backend Services
- Primary Language: Node.js
- API Framework: Express.js
- Database: MongoDB
- Authentication: (TBD)
- Message Queue: (TBD)

### Infrastructure
- Deployment: (TBD)
- Monitoring: (TBD)
- CI/CD: (TBD)

## Service Responsibilities

### SellerSmart-API
- Main API gateway for all frontend requests
- Authentication and authorization
- Request routing to microservices
- Response aggregation
- Rate limiting and security

### SellerSmart-Web
- User interface for all platform features
- Dashboard and analytics visualization
- User authentication flow
- Real-time updates and notifications

### SellerSmart-Backend.BrandScan
- Brand performance analysis
- Brand reputation monitoring
- Trademark and intellectual property tracking
- Brand comparison tools

### SellerSmart-Backend.InvOrders
- Inventory management
- Order processing and fulfillment
- Stock level monitoring
- Reorder point calculations
- Order history and analytics

### SellerSmart-Backend.RivalRadar
- Competitor price tracking
- Competitor inventory monitoring
- Market share analysis
- Competitive intelligence reporting

### SellerSmart-Backend.WholesaleScan
- Wholesale supplier discovery
- Price comparison across suppliers
- Bulk order management
- Supplier reliability scoring

### SellerSmart-SiteMonitor
- E-commerce website monitoring
- Price change detection
- Stock availability tracking
- Listing change notifications

## Database Design Philosophy

- MongoDB is used as the primary database
- Each service manages its own collections
- Shared data is synchronized via events
- Reference IDs are used for cross-service relationships

## API Design Principles

- RESTful API design
- Consistent naming conventions
- Standardized error responses
- Version management strategy
- Rate limiting per service

## Development Workflow

### PRD Creation
1. Always run PRD creation from the SellerSmart-Architecture directory
2. Use the provided script: `./scripts/create-prd.sh`
3. PRDs should be comprehensive and reference existing code patterns
4. Each feature gets its own PRD with unique ID

### Branching Strategy
- Main/Master: Production-ready code
- Develop: Integration branch
- Feature branches: feature/PRD_ID_description
- Hotfix branches: hotfix/issue_description

### Code Review Process
- All changes require PR review
- PRDs must be approved before implementation
- Tests required for new features
- Documentation updates required

## Common Patterns

### Error Handling
- Consistent error format across all services
- Proper HTTP status codes
- Detailed error messages for debugging
- User-friendly messages for frontend

### Authentication
- JWT-based authentication
- Service-to-service authentication
- Role-based access control (RBAC)

### Logging
- Structured logging format
- Correlation IDs for request tracking
- Log levels: ERROR, WARN, INFO, DEBUG
- Centralized log aggregation

### Testing
- Unit tests for business logic
- Integration tests for APIs
- E2E tests for critical user flows
- Minimum 80% code coverage target

## Important Considerations

### When Creating PRDs
1. Always analyze existing code for patterns
2. Check for reusable components/utilities
3. Consider impact on all related services
4. Include comprehensive test scenarios
5. Define clear success metrics

### When Implementing Features
1. Follow existing code conventions
2. Reuse existing utilities and helpers
3. Maintain consistent error handling
4. Add appropriate logging
5. Update documentation

### Cross-Service Communication
1. Use async messaging where possible
2. Implement proper retry logic
3. Handle service unavailability gracefully
4. Maintain data consistency

## MCP Tools Usage Guidelines

### Context7 (API Documentation)
- Use for: External API integrations, library documentation
- When: Integrating Stripe, payment gateways, third-party services
- Commands: First resolve library ID, then fetch docs

### Repomix (Codebase Analysis)
- Use for: Quick codebase structure analysis
- When: Before manual directory exploration
- Benefits: Faster than manual traversal, comprehensive overview

### MongoDB Atlas Tools
- Use for: Database schema analysis
- When: Planning features involving data models
- Commands: List databases, collections, analyze schemas

## Frequently Needed Information

### Environment Variables
- Each service has its own .env configuration
- Shared configs in API gateway
- Never commit .env files
- Use .env.example as template

### Port Assignments
- API: 3000
- Web: 3001
- BrandScan: 3002
- InvOrders: 3003
- RivalRadar: 3004
- WholesaleScan: 3005
- SiteMonitor: 3006

### MongoDB Collections (Main)
- users
- products
- brands
- orders
- inventory
- competitors
- suppliers
- monitors
- analytics

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

## Notes for AI Assistants

1. Always start by understanding the existing codebase
2. Use MCP tools to gather context efficiently
3. Follow established patterns - don't reinvent
4. Ask clarifying questions before making assumptions
5. Provide examples from existing code when possible
6. Consider cross-service impacts
7. Prioritize maintainability and consistency
