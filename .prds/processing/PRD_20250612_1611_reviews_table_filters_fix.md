# PRD_20250612_1611_reviews_table_filters_fix

## Problem Statement

The table filters on the reviews page (https://app.sellersmart.io/reviews) are completely non-functional. Users are unable to filter reviews by status (enabled/excluded) or processing state (has_sent/never_sent), making it difficult to manage and analyze review data effectively.

## User Needs

- **Filter by Review Status**: Users need to filter reviews by enabled/excluded status to focus on active vs inactive reviews
- **Filter by Processing State**: Users need to filter by whether review requests have been sent or not to track processing status
- **Combined Filtering**: Users need to apply multiple filters simultaneously for precise data analysis
- **Real-time Updates**: Users expect filters to update the table data immediately without page refresh
- **Filter Persistence**: Users expect filter state to persist during their session

## MCP Tools Used

- **Task Tool**: Comprehensive codebase analysis of SellerSmart-Web repository
  - Identified filter components and implementation gaps
  - Found working filter patterns in Orders table for reference
  - Discovered API endpoint filter processing issues

## Test Specifications (TDD)

### Test Scenarios

1. **Single Status Filter**
   - Given: Reviews table with mixed enabled/excluded reviews
   - When: User selects "enabled" status filter
   - Then: Table shows only enabled reviews

2. **Single Processing Filter**
   - Given: Reviews table with mixed processing states
   - When: User selects "has_sent" processing filter
   - Then: Table shows only reviews with sent requests

3. **Combined Filters**
   - Given: Reviews table with various combinations
   - When: User selects "enabled" status AND "never_sent" processing
   - Then: Table shows only enabled reviews that have never sent requests

4. **Filter Clearing**
   - Given: Active filters applied to table
   - When: User clears all filters
   - Then: Table shows all reviews without any filtering

5. **Filter State Persistence**
   - Given: User has applied filters
   - When: User interacts with table (sorting, pagination)
   - Then: Applied filters remain active

### Unit Tests Required

#### Frontend Filter Logic Tests
- [ ] Test `ReviewsFilterDropdown` renders with correct options
- [ ] Test `ReviewsFilterDropdown` calls `onFiltersChange` with correct values
- [ ] Test filter state management in reviews page component
- [ ] Test filter parameter serialization for API calls
- [ ] Test filter clearing functionality
- [ ] Test filter validation with invalid values
- [ ] Test filter state persistence across re-renders

#### API Filter Processing Tests
- [ ] Test status filter parameter parsing ("enabled" → settings.enabled: true)
- [ ] Test status filter parameter parsing ("excluded" → settings.enabled: false)
- [ ] Test processing filter parameter parsing ("has_sent" → total_requests_sent > 0)
- [ ] Test processing filter parameter parsing ("never_sent" → total_requests_sent = 0)
- [ ] Test combined filter parameters processing
- [ ] Test filter parameter validation
- [ ] Test edge case: empty filter parameters
- [ ] Test edge case: malformed filter parameters

### Integration Tests Required

- [ ] Test API endpoint: `/api/amazon/reviews` with status filter
- [ ] Test API endpoint: `/api/amazon/reviews` with processing filter
- [ ] Test API endpoint: `/api/amazon/reviews` with combined filters
- [ ] Test database query generation with filter parameters
- [ ] Test MongoDB query execution with proper filter conditions
- [ ] Test filter performance with large datasets
- [ ] Test filter interaction with pagination
- [ ] Test filter interaction with search functionality

### Component Tests Required

- [ ] Test `ReviewsFilterDropdown` component renders correctly
- [ ] Test filter dropdown opens and closes properly
- [ ] Test filter option selection updates state
- [ ] Test filter badge display when filters are active
- [ ] Test filter clearing button functionality
- [ ] Test multiple filter selection behavior
- [ ] Test filter component accessibility (ARIA labels, keyboard nav)
- [ ] Test filter component with various props combinations

### E2E Tests Required

- [ ] Test complete filter workflow: select status filter → verify table updates
- [ ] Test complete filter workflow: select processing filter → verify table updates
- [ ] Test combined filter workflow: select multiple filters → verify correct results
- [ ] Test filter persistence: apply filters → navigate away → return → verify filters remain
- [ ] Test filter clearing: apply filters → clear → verify all data shown
- [ ] Test filter with search: apply filters + search term → verify combined results

### Coverage Targets

- Unit Test Coverage: 100%
- Integration Test Coverage: 100%
- Component Test Coverage: 100%
- E2E Test Coverage: 100%
- Overall Coverage: 100%
- Exclusions: None - all filter-related code must be tested

## Codebase Analysis

### Current Implementation Issues

**Primary Issue**: Filters are not sent to API
- File: `/Users/kal/GitHub/SellerSmart-Web/src/app/reviews/page.tsx:77-79`
- Problem: Only search term is added to URL parameters, filters are ignored

**API Processing Issues**:
- File: `/Users/kal/GitHub/SellerSmart-Web/src/app/api/amazon/reviews/route.ts:78-91`
- Problem: Only basic status handling, no processing filter support
- Problem: Expects string instead of array format from frontend

**State Management Issues**:
- File: `/Users/kal/GitHub/SellerSmart-Web/src/app/reviews/page.tsx:260-268`
- Problem: `filters` not included in useEffect dependencies for data fetching

### Working Reference Implementation

**Orders Table Pattern** (to follow):
- File: `/Users/kal/GitHub/SellerSmart-Web/src/app/orders/data/client.tsx:93-102`
- Proper filter parameter serialization
- Array handling with `.join(",")`
- Multiple filter type support

### Existing Components to Reuse

- `UnifiedFilterDropdown` - Core filter dropdown logic
- `TableFilterBar` - Filter bar wrapper component
- Filter state management patterns from Orders table

### Testing Patterns Found

- Jest + React Testing Library for component tests
- API route testing with mock data
- E2E testing with Playwright
- Test utilities in `__tests__/utils/` directory

## Technical Requirements

### Frontend Changes

1. **Update fetchReviewsData Function**
   - File: `/Users/kal/GitHub/SellerSmart-Web/src/app/reviews/page.tsx`
   - Add filter parameters to API URL construction
   - Follow Orders table pattern for parameter serialization

2. **Fix useEffect Dependencies**
   - File: `/Users/kal/GitHub/SellerSmart-Web/src/app/reviews/page.tsx:260-268`
   - Add `filters` to dependency array for automatic refetching

3. **Enhance Filter State Management**
   - Ensure filter state properly triggers data updates
   - Add filter validation and error handling

### Backend Changes

1. **Update API Route Handler**
   - File: `/Users/kal/GitHub/SellerSmart-Web/src/app/api/amazon/reviews/route.ts`
   - Replace simple status handling with array processing
   - Add processing filter parameter support
   - Implement proper MongoDB query construction

2. **Database Query Enhancement**
   - Support multiple filter combinations
   - Optimize query performance with proper indexing
   - Handle edge cases (empty filters, invalid values)

### Testing Infrastructure

1. **Unit Test Setup**
   - Configure Jest for filter logic testing
   - Mock API calls and database operations
   - Create test fixtures for various filter scenarios

2. **Integration Test Setup**
   - Set up test database with sample review data
   - Configure API testing environment
   - Create test utilities for filter scenarios

3. **E2E Test Setup**
   - Configure Playwright for filter workflow testing
   - Set up test data seeding
   - Create page objects for filter interactions

## Implementation Checklist (TDD Order)

### Phase 1: Test Development

#### Unit Tests
- [ ] Write tests for `ReviewsFilterDropdown` component behavior
- [ ] Write tests for filter state management in reviews page
- [ ] Write tests for filter parameter serialization logic
- [ ] Write tests for API route filter parameter parsing
- [ ] Write tests for MongoDB query construction with filters
- [ ] Write tests for filter validation and error handling
- [ ] Verify all tests fail correctly (red phase)

#### Integration Tests
- [ ] Write tests for `/api/amazon/reviews` endpoint with filters
- [ ] Write tests for database query execution with filter conditions
- [ ] Write tests for filter + pagination interactions
- [ ] Write tests for filter + search combinations
- [ ] Write tests for filter performance with large datasets

#### Component Tests
- [ ] Write tests for filter dropdown rendering and interactions
- [ ] Write tests for filter badge display and clearing
- [ ] Write tests for accessibility compliance
- [ ] Write tests for error states and edge cases

#### E2E Tests
- [ ] Write tests for complete filter workflows
- [ ] Write tests for filter persistence across navigation
- [ ] Write tests for multi-filter combinations
- [ ] Write tests for filter clearing functionality

### Phase 2: Implementation

#### Frontend Implementation
- [ ] Implement filter parameter passing in `fetchReviewsData`
- [ ] Add filters to useEffect dependencies
- [ ] Enhance filter state management with validation
- [ ] Implement filter clearing functionality
- [ ] Add loading states during filter operations

#### Backend Implementation
- [ ] Implement array-based filter parameter processing
- [ ] Add processing filter support to API route
- [ ] Enhance MongoDB query construction for filters
- [ ] Add filter validation and error handling
- [ ] Optimize database queries for filter performance

#### Refactoring
- [ ] Refactor code while keeping all tests green
- [ ] Extract reusable filter utilities
- [ ] Improve type safety for filter operations
- [ ] Add comprehensive error handling

### Phase 3: Quality Assurance

#### Testing & Coverage
- [ ] Run complete test suite and verify all tests pass
- [ ] Generate coverage reports for all test types
- [ ] Achieve 100% test coverage for filter functionality
- [ ] Verify no regression in existing functionality

#### Code Quality
- [ ] Pass all TypeScript type checks
- [ ] Pass all ESLint checks
- [ ] Pass all Prettier formatting checks
- [ ] Validate accessibility compliance

#### Performance Testing
- [ ] Test filter performance with large datasets
- [ ] Verify database query performance
- [ ] Test memory usage during filter operations
- [ ] Validate API response times

### Phase 4: Completion

#### Final Validation
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All component tests passing
- [ ] All E2E tests passing
- [ ] 100% test coverage achieved

#### Documentation & Deployment
- [ ] Update API documentation for filter parameters
- [ ] Update component documentation
- [ ] Create user guide for filter functionality
- [ ] Prepare deployment checklist

#### Quality Gates
- [ ] Code review completed
- [ ] Manual testing completed
- [ ] Performance benchmarks met
- [ ] Security review passed
- [ ] PRD moved to completed folder

## Success Criteria

### Functional Success
- [ ] Status filters (enabled/excluded) work correctly
- [ ] Processing filters (has_sent/never_sent) work correctly
- [ ] Combined filters produce accurate results
- [ ] Filter clearing returns all data
- [ ] Filter state persists during session

### Technical Success
- [ ] 100% test coverage for all filter functionality
- [ ] All tests passing (unit, integration, component, E2E)
- [ ] No performance regression
- [ ] No breaking changes to existing functionality
- [ ] TypeScript errors resolved

### User Experience Success
- [ ] Filters respond immediately to user interaction
- [ ] Filter state is clearly visible to users
- [ ] Filter clearing is intuitive and accessible
- [ ] Filter combinations work as expected
- [ ] No console errors or warnings

### Performance Success
- [ ] Filter operations complete within 500ms
- [ ] Database queries remain performant with filters
- [ ] No memory leaks during filter operations
- [ ] API response times within acceptable limits