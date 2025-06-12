# PRD_20250612_1615_profit_service_extraction

## Problem Statement

The SellerSmart-Backend.InvOrders service has grown significantly complex with sophisticated profitability calculation logic that represents a substantial portion of the codebase. The profitability functionality operates independently from Amazon SP-API access, relying solely on MongoDB operations, calculations, and changestream monitoring. This creates an opportunity for architectural improvement through service extraction to achieve:

1. **Service Isolation**: Separate profitability concerns from inventory/order management
2. **Deployment Independence**: Independent scaling and deployment cycles
3. **Simplified Maintenance**: Focused codebase with clear responsibilities
4. **Performance Optimization**: Dedicated resources for calculation-intensive operations
5. **Risk Reduction**: Isolate profitability calculations from SP-API dependencies

## User Needs

1. **Sellers**: Continued access to accurate profitability calculations without service disruption
2. **Developers**: Cleaner architecture with focused services and easier maintenance
3. **Operations**: Independent deployment and scaling capabilities for profitability calculations
4. **Data Analysts**: Isolated profitability service for enhanced analytics and reporting
5. **System Administrators**: Reduced complexity in InvOrders service with clearer service boundaries

## MCP Tools Used

- **Codebase Analysis**: Manual analysis of SellerSmart-Backend.InvOrders profitability components
- **Database Schema Review**: Analysis of MongoDB collections and relationships
- **Environment Configuration**: Review of current deployment and configuration patterns

## Test Specifications (TDD)

### Test Scenarios

1. **Profitability Calculation Accuracy**
   - Given: Historical order with known COGS, fees, and VAT status
   - When: Profit calculation is performed
   - Then: Profit, ROI, and margin values match expected precision and business rules

2. **Historical COGS Lookup**
   - Given: Order date and SKU with multiple COGS entries
   - When: COGS lookup is performed for historical order
   - Then: Correct COGS value is returned based on effective date range

3. **VAT Scenario Calculations**
   - Given: Order from VAT-registered period with known VAT rate
   - When: VAT-aware profit calculation is performed
   - Then: VAT component is correctly separated and calculated

4. **Changestream Processing**
   - Given: COGS update in MongoDB
   - When: Changestream detects the update
   - Then: Affected order profits are recalculated automatically

5. **Settlement Fee Integration**
   - Given: Order with estimated fees and actual settlement data
   - When: Settlement fees are processed
   - Then: Order profits are updated with actual fees

6. **Service Migration Integrity**
   - Given: Existing profitability data in InvOrders
   - When: Service extraction is complete
   - Then: All calculations produce identical results in new service

### Unit Tests Required

#### Core Calculation Engine
- [ ] Test ItemProfitCalculator.calculate_item_profit() with valid order data
- [ ] Test ItemProfitCalculator.calculate_item_profit() with missing COGS
- [ ] Test ItemProfitCalculator.calculate_item_profit() with zero/negative values
- [ ] Test ItemProfitCalculator VAT scenario calculations
- [ ] Test ItemProfitCalculator decimal precision for financial calculations
- [ ] Test ItemProfitCalculator bulk processing methods
- [ ] Test error handling for invalid order data
- [ ] Test edge case: orders with zero revenue
- [ ] Test edge case: orders with negative fees

#### COGS Management
- [ ] Test COGSService.get_cogs_for_sku() with valid SKU and date
- [ ] Test COGSService.get_cogs_for_sku() with invalid SKU
- [ ] Test COGSService.get_cogs_for_sku() with date outside effective range
- [ ] Test COGSService.upsert_cogs() with new COGS entry
- [ ] Test COGSService.upsert_cogs() with overlapping date ranges
- [ ] Test COGSService historical lookup accuracy
- [ ] Test COGS date range validation
- [ ] Test error handling for malformed COGS data

#### VAT Management
- [ ] Test VATService.get_vat_status() with valid date and marketplace
- [ ] Test VATService.get_vat_status() with date outside registration period
- [ ] Test VATService VAT rate calculations for all supported marketplaces
- [ ] Test VATService historical VAT status lookup
- [ ] Test VAT registration period management
- [ ] Test error handling for invalid marketplace codes
- [ ] Test edge case: VAT registration transitions

#### Financial Services
- [ ] Test OrderFinancialService bulk order processing
- [ ] Test InventoryFinancialService current profitability calculations
- [ ] Test financial service integration with COGS and VAT services
- [ ] Test settlement fee integration logic
- [ ] Test error handling for database operations
- [ ] Test performance with large datasets

### Integration Tests Required

#### Database Operations
- [ ] Test MongoDB connection and pool management
- [ ] Test multi-database operations (main, extras, app)
- [ ] Test collection access and query performance
- [ ] Test database transaction handling
- [ ] Test connection retry logic
- [ ] Test database error handling and recovery

#### Changestream Processing
- [ ] Test COGS changestream monitoring and processing
- [ ] Test FBA fees changestream monitoring
- [ ] Test settlement reports changestream processing
- [ ] Test changestream error handling and recovery
- [ ] Test changestream performance under load
- [ ] Test changestream reconnection logic

#### API Endpoints
- [ ] Test profit calculation API endpoints
- [ ] Test COGS management API endpoints
- [ ] Test VAT management API endpoints
- [ ] Test bulk operation API endpoints
- [ ] Test API error handling and validation
- [ ] Test API authentication and authorization
- [ ] Test API rate limiting and throttling

#### Service Integration
- [ ] Test integration with existing InvOrders service
- [ ] Test integration with SellerSmart-Web frontend
- [ ] Test integration with SellerSmart-API gateway
- [ ] Test cross-service data consistency
- [ ] Test service communication error handling

### Component Tests Required (Service-Level)

- [ ] Test service startup and configuration loading
- [ ] Test service health check endpoints
- [ ] Test service graceful shutdown
- [ ] Test service logging and monitoring
- [ ] Test service error tracking and alerting
- [ ] Test service metrics collection

### E2E Tests Required

- [ ] Test complete profit calculation workflow from order to final profit
- [ ] Test COGS update workflow triggering profit recalculations
- [ ] Test settlement fee processing updating order profits
- [ ] Test VAT registration change affecting historical calculations
- [ ] Test bulk recalculation scenarios
- [ ] Test service migration preserving data integrity

### Coverage Targets

- Unit Test Coverage: 100%
- Integration Test Coverage: 100%
- Overall Coverage: 100%
- Exclusions: Configuration files, generated code, vendor libraries

## Codebase Analysis

### Current Architecture Analysis

The SellerSmart-Backend.InvOrders service contains a sophisticated profitability calculation system with the following key components:

#### Core Profitability Components
1. **ItemProfitCalculator** (`/src/services/cogs/item_profit_calculator.py`)
   - Individual item profit/ROI/margin calculations
   - Historical COGS lookup based on order date
   - VAT vs non-VAT scenario calculations
   - Settlement fee integration
   - Decimal precision for financial accuracy

2. **COGSService** (`/src/services/cogs/cogs_service.py`)
   - Historical COGS tracking with date ranges
   - SKU-level cost management
   - Effective date validation
   - Cost component breakdown

3. **VATService** (`/src/services/vat/vat_service.py`)
   - VAT registration period tracking
   - Marketplace-specific VAT rates
   - Date-based VAT status lookup
   - Supports UK (20%), Germany (19%), Italy (22%), etc.

4. **Financial Services**
   - OrderFinancialService: Order-level profit orchestration
   - InventoryFinancialService: Real-time inventory profitability

5. **Changestream Processors**
   - COGS changestream: Monitors cost updates
   - FBA fees changestream: Monitors fee updates
   - Settlement changestream: Processes actual fees

#### Database Architecture
- **Primary Collections**: cogs, order_financials, inventory_financials
- **Reference Collections**: orders, inventory, fba_fees, settlement_reports
- **Multi-Database Setup**: Main data + Amazon extras + App settings

#### Integration Points
- MongoDB changestream monitoring
- SellerSmart-API integration for pricing data
- Real-time calculation triggers
- Bulk processing capabilities

### Existing Patterns to Follow

#### Calculation Patterns
- Decimal precision for all financial calculations
- Historical data lookup based on effective dates
- Multi-currency support with proper conversion
- VAT-aware calculations for EU markets

#### Database Patterns
- Connection pooling with retry logic
- Multi-database operations
- Changestream-based reactivity
- Bulk operation optimization

#### Error Handling Patterns
- Comprehensive retry logic
- Sentry integration for error tracking
- Graceful degradation for missing data
- Detailed logging for audit trails

## Technical Requirements

### Service Architecture

#### New Service Structure: SellerSmart-Backend.Profit
```
/Users/kal/GitHub/SellerSmart-Backend.Profit/
├── src/
│   ├── services/
│   │   ├── calculations/
│   │   │   ├── item_profit_calculator.py
│   │   │   ├── bulk_calculator.py
│   │   │   └── validation_service.py
│   │   ├── cogs/
│   │   │   ├── cogs_service.py
│   │   │   └── historical_lookup.py
│   │   ├── vat/
│   │   │   ├── vat_service.py
│   │   │   └── vat_rates.py
│   │   ├── financial/
│   │   │   ├── order_financial_service.py
│   │   │   ├── inventory_financial_service.py
│   │   │   └── settlement_service.py
│   │   └── changestreams/
│   │       ├── cogs_changestream.py
│   │       ├── fba_fees_changestream.py
│   │       └── settlement_changestream.py
│   ├── api/
│   │   ├── routes/
│   │   │   ├── profit_routes.py
│   │   │   ├── cogs_routes.py
│   │   │   └── vat_routes.py
│   │   └── middleware/
│   │       ├── auth_middleware.py
│   │       └── validation_middleware.py
│   ├── shared/
│   │   ├── database.py
│   │   ├── config.py
│   │   └── utils.py
│   └── models/
│       ├── profit_models.py
│       ├── cogs_models.py
│       └── vat_models.py
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── requirements.txt
├── Dockerfile
├── railway.toml
└── README.md
```

#### Database Configuration
- **Primary Database**: `sellersmart_amazon_extras` (profitability data)
- **Reference Databases**: `sellersmart_amazon_users` (orders, inventory)
- **Settings Database**: `sellersmart_app` (VAT settings, user preferences)

#### API Endpoints
```
POST /api/v1/profit/calculate - Calculate profit for order items
GET  /api/v1/profit/order/{order_id} - Get order profitability
GET  /api/v1/profit/inventory/{sku} - Get inventory profitability
POST /api/v1/cogs/upsert - Create/update COGS entries
GET  /api/v1/cogs/{sku} - Get COGS for SKU with date range
POST /api/v1/vat/register - Update VAT registration period
GET  /api/v1/vat/status - Get VAT status for date/marketplace
POST /api/v1/bulk/recalculate - Trigger bulk recalculations
GET  /api/v1/health - Health check endpoint
```

### Environment Configuration

#### Required Environment Variables
```bash
# Database Configuration
MONGODB_URI=mongodb+srv://...
DATABASE_NAME=sellersmart_amazon_users
AMAZON_EXTRAS_DATABASE_NAME=sellersmart_amazon_extras
APP_DATABASE_NAME=sellersmart_app

# Connection Pool Settings
MONGO_MAX_POOL_SIZE=100
MONGO_MIN_POOL_SIZE=10
MONGO_MAX_IDLE_TIME_MS=60000
MONGO_WAIT_QUEUE_TIMEOUT_MS=5000
MONGO_SERVER_SELECTION_TIMEOUT_MS=5000
MONGO_CONNECT_TIMEOUT_MS=5000
MONGO_SOCKET_TIMEOUT_MS=30000
MONGO_MAX_RETRIES=3
MONGO_RETRY_DELAY_MS=1000

# API Configuration
API_PORT=8000
API_HOST=0.0.0.0
API_PREFIX=/api/v1

# SellerSmart API Integration
SELLERSMART_API_URL=https://api.sellersmart.com
SELLERSMART_API_KEY=...

# Logging and Monitoring
LOG_LEVEL=INFO
LOG_DIR=logs
SENTRY_DSN=...
SENTRY_ENVIRONMENT=production
SENTRY_SAMPLE_RATE=1.0
SENTRY_TRACES_SAMPLE_RATE=0.1
```

### Dependencies

#### Core Dependencies
```
pymongo==4.5.0
fastapi==0.104.1
uvicorn==0.24.0
python-dotenv==1.0.0
python-dateutil==2.8.2
requests==2.31.0
aiohttp==3.9.5
sentry-sdk==1.12.1
pydantic==2.5.0
```

#### Development Dependencies
```
pytest==8.3.5
pytest-asyncio==1.0.0
pytest-cov==4.1.0
pytest-timeout==2.2.0
mypy==1.8.0
black==23.12.1
ruff==0.1.8
pre-commit==3.6.0
```

### Migration Strategy

#### Phase 1: Service Extraction
1. Create new SellerSmart-Backend.Profit repository
2. Extract profitability components from InvOrders
3. Implement identical calculation logic
4. Set up database connections and environment
5. Create comprehensive test suite

#### Phase 2: API Development
1. Implement REST API endpoints
2. Add authentication and authorization
3. Implement rate limiting and validation
4. Add health checks and monitoring

#### Phase 3: Integration
1. Update InvOrders to call Profit service APIs
2. Implement graceful fallback mechanisms
3. Add cross-service error handling
4. Monitor performance and accuracy

#### Phase 4: Cleanup
1. Remove profitability code from InvOrders
2. Update documentation and deployment configs
3. Optimize database queries and performance
4. Complete testing and validation

## Implementation Checklist (TDD Order)

### Phase 1: Test Development

#### Unit Tests
- [ ] Write tests for ItemProfitCalculator calculation methods
- [ ] Write tests for ItemProfitCalculator VAT scenarios
- [ ] Write tests for ItemProfitCalculator edge cases and error handling
- [ ] Write tests for COGSService historical lookup logic
- [ ] Write tests for COGSService date range validation
- [ ] Write tests for COGSService upsert operations
- [ ] Write tests for VATService rate calculations
- [ ] Write tests for VATService historical status lookup
- [ ] Write tests for OrderFinancialService bulk operations
- [ ] Write tests for InventoryFinancialService current profitability
- [ ] Verify all unit tests fail correctly
- [ ] Document test cases and expected behaviors

#### Integration Tests
- [ ] Write tests for database connection and operations
- [ ] Write tests for changestream monitoring and processing
- [ ] Write tests for API endpoint functionality
- [ ] Write tests for service integration points
- [ ] Write tests for error handling and recovery scenarios
- [ ] Write tests for performance under load
- [ ] Verify all integration tests fail correctly

#### E2E Tests
- [ ] Write tests for complete profit calculation workflows
- [ ] Write tests for COGS update triggering recalculations
- [ ] Write tests for settlement fee processing
- [ ] Write tests for VAT registration changes
- [ ] Write tests for service migration data integrity
- [ ] Verify all E2E tests fail correctly

### Phase 2: Implementation

#### Core Services
- [ ] Implement ItemProfitCalculator with all calculation methods
- [ ] Implement COGSService with historical lookup functionality
- [ ] Implement VATService with rate management and status lookup
- [ ] Implement OrderFinancialService with bulk processing
- [ ] Implement InventoryFinancialService with real-time calculations
- [ ] Verify all unit tests pass

#### Database Layer
- [ ] Implement database connection and pool management
- [ ] Implement multi-database operations support
- [ ] Implement changestream monitoring infrastructure
- [ ] Implement error handling and retry logic
- [ ] Verify all database integration tests pass

#### API Layer
- [ ] Implement FastAPI application with all endpoints
- [ ] Implement authentication and authorization middleware
- [ ] Implement request validation and error handling
- [ ] Implement rate limiting and throttling
- [ ] Implement health check and monitoring endpoints
- [ ] Verify all API integration tests pass

#### Changestream Processing
- [ ] Implement COGS changestream processor
- [ ] Implement FBA fees changestream processor
- [ ] Implement settlement reports changestream processor
- [ ] Implement error handling and reconnection logic
- [ ] Verify all changestream integration tests pass

### Phase 3: Quality Assurance

#### Testing and Coverage
- [ ] Run complete test suite and verify all tests pass
- [ ] Generate test coverage report
- [ ] Achieve 100% test coverage (or document exclusions)
- [ ] Run MyPy type checking and resolve all issues
- [ ] Run Black formatter and Ruff linter
- [ ] Pass all pre-commit hooks

#### Performance Testing
- [ ] Benchmark calculation performance vs current implementation
- [ ] Load test API endpoints under expected traffic
- [ ] Test changestream processing under high update frequency
- [ ] Verify database connection pool performance
- [ ] Test memory usage and garbage collection

#### Integration Validation
- [ ] Validate calculation accuracy against current implementation
- [ ] Test service integration with InvOrders
- [ ] Test service integration with SellerSmart-Web
- [ ] Validate data consistency across service boundary
- [ ] Test error handling and graceful degradation

### Phase 4: Deployment and Migration

#### Service Deployment
- [ ] Deploy service to staging environment
- [ ] Configure monitoring and alerting
- [ ] Test service health checks and readiness probes
- [ ] Validate environment configuration
- [ ] Test service scaling and performance

#### Migration Execution
- [ ] Update InvOrders to call Profit service APIs
- [ ] Implement feature flags for gradual rollout
- [ ] Monitor service performance and error rates
- [ ] Validate calculation accuracy in production
- [ ] Complete migration and remove feature flags

#### Cleanup
- [ ] Remove profitability code from InvOrders service
- [ ] Update documentation and API specifications
- [ ] Clean up unused dependencies and configurations
- [ ] Update monitoring and alerting configurations
- [ ] Archive migration documentation

### Phase 5: Completion

- [ ] All tests passing in CI/CD pipeline
- [ ] 100% test coverage achieved
- [ ] No regression in existing functionality
- [ ] Performance benchmarks met or exceeded
- [ ] Service successfully deployed to production
- [ ] Migration completed without data loss
- [ ] Documentation updated and complete
- [ ] Code reviewed and approved
- [ ] PRD moved to completed folder

## Success Criteria

### Functional Requirements
- [ ] All profit calculations produce identical results to current implementation
- [ ] Historical COGS lookup maintains accuracy across service boundary
- [ ] VAT calculations preserve existing logic and rates
- [ ] Changestream processing maintains real-time update capability
- [ ] Settlement fee integration preserves accuracy tracking

### Performance Requirements
- [ ] Calculation performance matches or exceeds current implementation
- [ ] API response times under 200ms for single calculations
- [ ] Bulk operations complete within existing time constraints
- [ ] Changestream processing latency under 1 second
- [ ] Database connection pooling prevents connection exhaustion

### Quality Requirements
- [ ] 100% test coverage achieved across all components
- [ ] No critical or high-severity security vulnerabilities
- [ ] All type checking passes without errors
- [ ] Code quality metrics meet or exceed current standards
- [ ] Error handling provides appropriate user feedback

### Operational Requirements
- [ ] Service deploys successfully with zero downtime
- [ ] Health checks and monitoring provide adequate visibility
- [ ] Error tracking and alerting function correctly
- [ ] Service scales horizontally under load
- [ ] Database operations maintain transaction integrity

### Business Requirements
- [ ] No disruption to user access to profitability data
- [ ] All existing profitability features remain available
- [ ] Performance improvements realized through service isolation
- [ ] Maintenance complexity reduced through focused service scope
- [ ] Future profitability enhancements easier to implement