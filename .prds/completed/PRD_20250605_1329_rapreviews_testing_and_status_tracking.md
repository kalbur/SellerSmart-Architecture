# PRD: RapReview Service Testing & Failed Request Status Tracking

**PRD ID:** PRD_20250605_1329_rapreviews_testing_and_status_tracking  
**Created:** 2025-06-05 13:29  
**Priority:** High  
**Status:** COMPLETED  

## Problem Statement

The RapReview service requires comprehensive testing to ensure reliability, and SellerSmart-Web is incorrectly displaying failed review requests to customers. This creates a poor user experience where customers see failed requests as successful "sent" requests, reducing trust in the platform's accuracy.

## User Needs

### Primary Users: SellerSmart Operations Team
- **Need:** Confidence that RapReview service works reliably in production
- **Need:** Comprehensive test coverage to catch issues before deployment
- **Need:** Local testing capability for development and debugging

### Secondary Users: Amazon Sellers (SellerSmart Customers)
- **Need:** Accurate display of review request status (success vs failure)
- **Need:** Transparency about which requests actually succeeded
- **Need:** Ability to identify and retry failed requests
- **Need:** Clear understanding of their review request campaign performance

## MCP Tools Used

### Repomix Analysis
- **RapReview Service:** Comprehensive codebase analysis revealed background service architecture
- **SellerSmart-Web:** Frontend analysis identified gaps in status display logic
- **Key Findings:** Database contains rich status tracking data not displayed in frontend

### MongoDB Atlas Tools Analysis
- **Database Schema:** Revealed comprehensive review request tracking in `reviews` collection
- **Status Fields:** Found detailed status tracking (PENDING/SENT/FAILED/COMPLETED) not utilized by frontend
- **Failure Tracking:** Discovered failure_reason and attempt tracking fields available but unused

## Codebase Analysis

### Existing Implementation Patterns

**RapReview Service Architecture Pattern:**
- **File:** `/Users/kal/GitHub/SellerSmart-Backend.RapReview/src/app.ts`
- **Pattern:** Background daemon with scheduler/executor architecture
- **Example:** Two-phase operation (sync orders → process requests)

**Similar Status Tracking Implementations:**
- **File:** `/Users/kal/GitHub/SellerSmart-Web/src/components/features/amazon/review-request-table/ReviewRequestTable.tsx`
- **Pattern:** Badge-based status display with color coding
- **Example:** Success badges for `totalRequestsSent` field

**MongoDB Change Stream Pattern:**
- **File:** `/Users/kal/GitHub/SellerSmart-Backend.RapReview/src/tasks/executor.ts`
- **Pattern:** Real-time processing with change stream monitoring
- **Example:** Auto-updating frontend when backend data changes

### Code Examples for Consistency

**Status Display Pattern (Web):**
```typescript
// From existing success badge implementation
<Badge variant="success" className="text-xs">
  {totalRequestsSent || 0}
</Badge>

// Extend for status tracking
<Badge variant={getStatusVariant(request.status)} className="text-xs">
  {getStatusLabel(request.status)}
</Badge>
```

**API Response Pattern (Web):**
```typescript
// From /api/reviewrequester endpoint
interface ReviewRequest {
  totalRequestsSent: number;
  lastRequestDate: string | Date;
  // Add missing status fields
  pendingRequests?: number;
  failedRequests?: number;
  requestStatus?: string;
}
```

**Test Pattern (Backend):**
```typescript
// Follow Jest pattern from package.json config
describe('ReviewRequestService', () => {
  beforeEach(() => setupTestDatabase());
  afterEach(() => cleanupTestDatabase());
  
  it('should process review requests correctly', async () => {
    // Test implementation
  });
});
```

### Relevant Utilities and Helpers

**Database Utilities:**
- **File:** `/Users/kal/GitHub/SellerSmart-Backend.RapReview/src/utils/database.ts`
- **Usage:** MongoDB connection and CRUD operations
- **Pattern:** Connection pooling with error handling

**API Client Pattern:**
- **File:** `/Users/kal/GitHub/SellerSmart-Backend.RapReview/src/utils/client.ts`
- **Usage:** Amazon SP-API integration with credential management
- **Pattern:** Axios-based HTTP client with retry logic

**Logging Pattern:**
- **File:** `/Users/kal/GitHub/SellerSmart-Backend.RapReview/src/utils/logger.ts`
- **Usage:** Winston structured logging with operation IDs
- **Pattern:** Contextual logging for debugging and monitoring

### Architectural Patterns to Maintain

**Background Service Pattern:**
- No REST endpoints, database-driven operations
- Scheduler/executor separation of concerns
- MongoDB change streams for real-time processing

**Data Model Pattern:**
- Product-centric aggregation (ASIN-based)
- Embedded request tracking within product documents
- Comprehensive status history with timestamps

**Error Handling Pattern:**
- Graceful failure with status tracking
- Automatic retry mechanisms
- Structured error logging with context

## Technical Requirements

### Phase 1: RapReview Service Testing

#### 1.1 Unit Test Implementation
- **Target Coverage:** 80%+ line coverage for core business logic
- **Test Framework:** Jest (already configured)
- **Mock Strategy:** Mock Amazon SP-API calls and MongoDB operations
- **Key Components to Test:**
  - Review request processing logic (`/src/services/amazon/review_requests.ts`)
  - Order data processing (`/src/services/amazon/order_details_processor.ts`)
  - Scheduling logic (`/src/tasks/scheduler.ts` and `/src/tasks/executor.ts`)

#### 1.2 Integration Test Implementation
- **Database Testing:** Test MongoDB operations with test database
- **SP-API Integration:** Test API client with mock responses
- **End-to-End Workflow:** Test complete order → review request flow

#### 1.3 Local Development Setup
- **Environment Setup:** Docker-compose for local MongoDB
- **Configuration:** Test environment variables and credentials
- **Data Seeding:** Sample data for testing scenarios

#### 1.4 Production Environment Testing
**APPROACH: Run RapReview service normally with existing production setup**

**Service Setup:**
- **Environment:** RapReview service already configured with live MongoDB and Amazon credentials
- **Approach:** Run service locally as it would run in production
- **Scope:** Identify specific orders/products to test review request workflow

**Testing Methodology:**
```bash
# Normal production testing workflow
1. Start RapReview service locally (already has production config)
2. Identify 10-20 specific orders/ASINs ready for review requests
3. Enable those products in the reviews collection (set enabled: true)
4. Run scheduler to process those specific orders
5. Monitor executor as it attempts to send review requests for identified orders
6. Watch MongoDB updates in real-time to see success/failure status changes
7. Check SellerSmart-Web frontend to verify status display accuracy
```

**Target Order Selection:**
- **Criteria:** Orders 5+ days old, delivered, eligible for review requests
- **Scope:** Select mix of products from different sellers/marketplaces
- **Tracking:** Document specific order IDs and ASINs being tested

**Monitoring Focus:**
- **Database Changes:** Watch `reviews` collection for status updates on tested ASINs
- **Request Outcomes:** Track whether Amazon accepts or rejects review requests
- **Status Accuracy:** Verify database status matches actual Amazon API responses
- **Frontend Sync:** Confirm SellerSmart-Web shows accurate success/failure counts
- **Error Patterns:** Identify common failure reasons for specific scenarios

#### 1.5 Manual Testing Procedures
- **End-to-End Verification:** Complete order → review request → status update cycle
- **Error Scenario Testing:** Test actual failure cases with real SP-API errors
- **Performance Validation:** Monitor service performance with real data volumes
- **Status Accuracy:** Verify database status matches actual SP-API outcomes

### Phase 2: Failed Request Status Tracking

#### 2.1 Database Schema Enhancements
**Collection:** `sellersmart_amazon_users.reviews`

**Current Schema Gaps:**
- Frontend only reads `review_stats.total_requests_sent`
- Individual `review_requests[].request_status` not utilized
- No aggregated failure counts exposed

**Required Enhancements:**
```javascript
// Add to review_stats object
review_stats: {
  total_requests_sent: Number,        // Existing - SENT + COMPLETED
  total_requests_failed: Number,      // New - FAILED count
  total_requests_pending: Number,     // New - PENDING count
  last_request_date: Date,           // Existing
  last_failure_date: Date,           // New - Last FAILED attempt
  success_rate: Number               // New - Calculated percentage
}
```

#### 2.2 Backend API Enhancements
**Endpoint:** `/api/reviewrequester`

**Current Response Structure:**
```typescript
interface ReviewRequest {
  totalRequestsSent: number;
  lastRequestDate: string | Date;
  enabled: boolean;
  // Missing status fields
}
```

**Enhanced Response Structure:**
```typescript
interface ReviewRequest {
  // Existing fields
  totalRequestsSent: number;
  lastRequestDate: string | Date;
  enabled: boolean;
  
  // New status tracking fields
  totalRequestsFailed: number;
  totalRequestsPending: number;
  successRate: number;
  lastFailureDate?: string | Date;
  recentFailures: Array<{
    date: Date;
    reason: string;
    orderId: string;
  }>;
  
  // Individual request details
  requestHistory?: Array<{
    orderId: string;
    status: 'PENDING' | 'SENT' | 'FAILED' | 'COMPLETED';
    requestDate?: Date;
    failureReason?: string;
  }>;
}
```

#### 2.3 Frontend UI Enhancements
**Target Component:** `ReviewRequestTable.tsx`

**New Columns to Add:**
1. **Request Status:** Color-coded badge showing overall product status
2. **Success Rate:** Percentage with visual indicator
3. **Failed Requests:** Count with expandable failure details
4. **Last Failure:** Date and reason on hover

**Enhanced Table Structure:**
```typescript
// New column definitions
{
  accessorKey: "requestStatus",
  header: "Status",
  cell: ({ row }) => <StatusBadge status={row.getValue("requestStatus")} />
},
{
  accessorKey: "successRate", 
  header: "Success Rate",
  cell: ({ row }) => <SuccessRateIndicator rate={row.getValue("successRate")} />
},
{
  accessorKey: "totalRequestsFailed",
  header: "Failed",
  cell: ({ row }) => <FailedRequestsBadge count={row.getValue("totalRequestsFailed")} failures={row.original.recentFailures} />
}
```

**Status Display Logic:**
- **Green Badge:** All requests successful (success_rate = 100%)
- **Yellow Badge:** Some failures but recent successes (success_rate 70-99%)
- **Red Badge:** High failure rate or recent failures (success_rate < 70%)
- **Gray Badge:** No requests sent yet (total_requests_sent = 0)

#### 2.4 Filtering and Actions
**Filter Options:**
- **Status Filter:** All / Successful / Failed / Pending
- **Success Rate Filter:** High (>90%) / Medium (70-90%) / Low (<70%)

**Action Items:**
- **Retry Failed Requests:** Bulk action to reset FAILED requests to PENDING
- **View Failure Details:** Modal showing failure reasons and timestamps
- **Export Failed Requests:** CSV export for debugging

## Implementation Checklist

### Phase 1: RapReview Testing (Priority 1)
- [x] **Setup Test Environment**
  - [x] Configure Jest test database connection
  - [x] Create test data fixtures for orders and reviews
  - [x] Setup Docker compose for local MongoDB
  - [x] Create test environment configuration

- [x] **Unit Tests Implementation**
  - [x] Test order sync logic in `scheduler.ts`
  - [x] Test review request processing in `review_requests.ts`
  - [x] Test ASIN grouping in `order_details_processor.ts`
  - [x] Test scheduling calculations in `executor.ts`
  - [x] Test Amazon SP-API client methods
  - [x] Test database operations and error handling

- [x] **Integration Tests Implementation**
  - [x] Test complete order → review workflow
  - [x] Test MongoDB change stream processing
  - [x] Test SP-API integration with mock responses
  - [x] Test retry mechanisms for failed requests
  - [x] Test user settings inheritance and overrides

- [x] **Local Development Setup**
  - [x] Create development environment documentation
  - [x] Setup local MongoDB with sample data
  - [x] Configure test Amazon SP-API credentials
  - [x] Create npm scripts for testing and development

- [x] **Production Environment Testing**
  - [x] Start RapReview service locally (using existing production config)
  - [x] Identify 10-20 specific orders/ASINs ready for review requests
  - [x] Enable targeted products in MongoDB reviews collection
  - [x] Run scheduler and executor to process identified orders
  - [x] Monitor MongoDB real-time for status updates on tested products
  - [x] Track actual Amazon API responses (success/failure/reasons)
  - [x] Verify SellerSmart-Web frontend displays accurate status
  - [x] Document any discrepancies between database and frontend display

### Phase 2: Status Tracking Implementation (Priority 2)
- [x] **Database Schema Updates**
  - [x] Add calculated fields to `review_stats` object
  - [x] Create migration script for existing data
  - [x] Add indexes for status-based queries
  - [x] Update aggregation pipelines in backend

- [x] **Backend API Enhancements**
  - [x] Enhance `/api/reviewrequester` endpoint response
  - [x] Add request history endpoint `/api/reviewrequester/{asin}/history`
  - [x] Add retry endpoint `/api/reviewrequester/{asin}/retry`
  - [x] Add bulk operations for failed request management
  - [x] Update SSE events to include status changes

- [x] **Frontend UI Components**
  - [x] Create `StatusBadge` component for request status
  - [x] Create `SuccessRateIndicator` component with visual progress
  - [x] Create `FailedRequestsBadge` with expandable details
  - [x] Create `RequestHistoryModal` for detailed view
  - [x] Add status and success rate filters to table

- [x] **Status Display Logic**
  - [x] Implement status calculation algorithms
  - [x] Add color-coding for different status levels
  - [x] Create hover tooltips for failure details
  - [x] Add bulk action buttons for retry operations

- [x] **Testing and Validation**
  - [x] Test status calculation accuracy
  - [x] Verify real-time updates with SSE
  - [x] Test filtering and sorting functionality
  - [x] Validate retry operations and status updates
  - [x] Test with large datasets for performance

## Test Strategy

### Testing Framework
- **Backend:** Jest with MongoDB Memory Server for isolated tests
- **Frontend:** React Testing Library with MSW for API mocking
- **Integration:** Docker Compose with test databases

### Test Categories

#### 1. Unit Tests (Backend)
```typescript
// Example test structure following existing patterns
describe('ReviewRequestService', () => {
  beforeEach(async () => {
    await setupTestDatabase();
    mockSPAPIClient();
  });

  describe('processReviewRequests', () => {
    it('should send review requests for eligible orders', async () => {
      // Test implementation
    });
    
    it('should handle SP-API failures gracefully', async () => {
      // Test failure scenarios
    });
  });
});
```

#### 2. Integration Tests (Backend)
- **Order Processing:** Test complete order sync workflow
- **Request Scheduling:** Test delay calculations and timing
- **SP-API Integration:** Test with mock Amazon responses
- **Database Operations:** Test MongoDB operations and change streams

#### 3. Component Tests (Frontend)
```typescript
// Test status display components
describe('ReviewRequestTable', () => {
  it('should display failed requests correctly', () => {
    render(<ReviewRequestTable data={mockDataWithFailures} />);
    expect(screen.getByText('Failed: 3')).toBeInTheDocument();
  });
});
```

#### 4. End-to-End Tests
- **Complete Workflow:** Order → Review Request → Status Update
- **Failure Scenarios:** Network failures, API errors, invalid data
- **User Interactions:** Filter, sort, retry operations

### Performance Testing
- **Database Queries:** Test aggregation performance with large datasets
- **Real-time Updates:** Test SSE performance with multiple concurrent users
- **Memory Usage:** Monitor memory consumption during processing

## Success Criteria

### Phase 1: Testing Success Criteria
- [x] **Test Coverage:** Achieve 80%+ line coverage for core business logic
- [x] **Local Development:** Successfully run service locally with test data
- [x] **Manual Testing:** Complete successful review request workflow locally
- [x] **Error Handling:** Verify all failure scenarios are handled gracefully
- [x] **Documentation:** Comprehensive testing and development setup guide

### Phase 2: Status Tracking Success Criteria
- [x] **Accurate Status Display:** Failed requests no longer show as successful
- [x] **Real-time Updates:** Status changes reflect immediately in UI
- [x] **User Clarity:** Users can easily identify and understand request status
- [x] **Failure Transparency:** Detailed failure reasons available for debugging
- [x] **Retry Functionality:** Users can retry failed requests successfully

### Overall Success Metrics
- **Data Accuracy:** ✅ 100% accuracy in success vs failure status display
- **User Confidence:** ✅ Clear differentiation between sent and failed requests
- **System Reliability:** ✅ Comprehensive test coverage ensuring stability
- **Developer Experience:** ✅ Easy local development and testing setup

## Risk Assessment

### Technical Risks
- **Database Migration:** Risk of data inconsistency during schema updates
  - *Mitigation:* Comprehensive migration scripts with rollback capability
- **Performance Impact:** Additional status calculations may slow queries
  - *Mitigation:* Proper indexing and query optimization
- **Real-time Updates:** SSE updates may overwhelm frontend with status changes
  - *Mitigation:* Throttling and batching of status updates

### User Experience Risks  
- **Information Overload:** Too much status detail may confuse users
  - *Mitigation:* Progressive disclosure with expandable details
- **Accuracy Expectations:** Users may expect 100% accuracy in real-time
  - *Mitigation:* Clear documentation of update timing and limitations

### Implementation Risks
- **Testing Complexity:** Mock Amazon SP-API integration is complex
  - *Mitigation:* Use dedicated testing credentials and sandbox environment
- **Backward Compatibility:** Changes may break existing integrations
  - *Mitigation:* Maintain existing API structure while adding new fields

## Dependencies

### External Dependencies
- **Amazon SP-API:** Required for testing eligibility and request sending
- **MongoDB:** Database schema changes require careful migration
- **SellerSmart-Web:** Frontend changes depend on backend API enhancements

### Internal Dependencies
- **SellerSmart-Backend.InvOrders:** Provides order data for review processing
- **SellerSmart-API:** May need updates for new endpoints
- **Authentication Service:** Required for SP-API credential management

## Rollout Plan

### Phase 1: Testing Infrastructure (Week 1-2)
1. Setup test environment and database
2. Implement core unit tests
3. Create local development setup
4. Document testing procedures

### Phase 2: Backend Status Tracking (Week 3)
1. Update database schema with migration
2. Enhance API endpoints with status data
3. Test status calculation accuracy
4. Deploy to staging environment

### Phase 3: Frontend Status Display (Week 4)
1. Implement new UI components
2. Add status columns and filters
3. Test real-time updates
4. User acceptance testing

### Phase 4: Production Deployment (Week 5)
1. Deploy backend changes
2. Run database migration
3. Deploy frontend changes
4. Monitor for issues and user feedback

## Post-Implementation

### Monitoring
- **Status Accuracy:** Monitor for discrepancies in status reporting
- **Performance Impact:** Track query performance and response times
- **User Adoption:** Track usage of new status filtering features

### Documentation Updates
- **API Documentation:** Update endpoint documentation with new fields
- **User Guide:** Create guide for understanding request status
- **Developer Docs:** Update testing and development setup documentation

### Future Enhancements
- **Advanced Analytics:** Success rate trends and failure pattern analysis
- **Automated Retries:** Smart retry logic based on failure types
- **Notification System:** Alert users to recurring failures or issues