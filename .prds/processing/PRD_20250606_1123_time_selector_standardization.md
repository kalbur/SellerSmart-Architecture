# PRD: Time Selector Standardization and Integration Fixes

**PRD ID**: PRD_20250606_1123_time_selector_standardization  
**Date**: 2025-06-06  
**Status**: Planning Phase  
**Priority**: High  
**Estimated Effort**: 5-8 hours  

## Problem Statement

The SellerSmart Web application has inconsistent time selector implementations across overview pages, leading to:
- Inconsistent default time periods (some use 180 days, others null)
- Conflicting hardcoded date filters that override time selectors
- Complex dual time range state management causing potential sync issues
- Missing dependencies where widgets don't update when time ranges change
- Poor user experience with inconsistent behavior across similar pages

## User Needs

**As a SellerSmart user**, I need:
- Consistent time period defaults across all overview pages
- Time selectors that properly update all dependent widgets and stats
- Predictable behavior when changing time ranges
- No conflicts between time selectors and other date filters

## MCP Tools Used Section

### Tools Consulted:
- **Repomix**: Used for comprehensive codebase structure analysis
- **Context7**: Not applicable (no external API documentation needed)
- **MongoDB Atlas**: Not applicable (focus on frontend time selector logic)

### Key Findings:
- **Repomix Analysis**: Identified 3 different TimeRangeSelector implementations with varying complexity levels
- **Codebase Structure**: Overview pages follow consistent naming patterns but have inconsistent time selector integration
- **Component Architecture**: Time selectors use different state management patterns across pages

## Codebase Analysis Section

### Similar Existing Implementations:

**Working Time Selector Patterns** (to follow):
- `/src/app/dashboard/DashboardClient.tsx:350-432` - Clean period state management
- `/src/app/reimbursements/ReimbursementsOverviewClient.tsx:79-84` - Proper API integration

**Time Selector Components** (existing utilities to reuse):
- `/src/components/ui/PeriodSelector.tsx` - Primary component used across pages
- `/src/types/features/time-range.types.ts` - Comprehensive type definitions
- `/src/lib/date-utils.ts` - Date range calculation utilities

**Code Examples to Follow**:
```typescript
// Standard time selector integration (from ReimbursementsOverviewClient)
const [activePeriod, setActivePeriod] = useState<number>(180); // Standardized default

const handlePeriodChange = useCallback((period: number) => {
    setActivePeriod(period);
    // Trigger data refetch
}, []);

// API integration
const { startDate, endDate } = getDateRangeFromDays(activePeriod);
```

**Architectural Patterns to Maintain**:
- Single time range state per page (avoid dual state management)
- Callback-based period change handling
- Consistent default period across all pages
- Direct integration with API date parameters

## Technical Requirements

### 1. Standardize Default Time Periods
- **Current State**: Inconsistent defaults (180 days, null)
- **Target State**: All pages use 180 days as default (provides richer data for widgets)
- **Affected Components**:
  - `/src/app/dashboard/DashboardClient.tsx:350`
  - `/src/app/orders/OrdersOverviewClient.tsx:43`
  - `/src/app/returns/ReturnsOverviewClient.tsx:37-42`
  - `/src/app/reimbursements/ReimbursementsOverviewClient.tsx:34`
  - `/src/app/removal-orders/RemovalOrdersClient.tsx:35`

### 2. Fix Conflicting Date Filters
- **Issue**: Orders page has hardcoded 14-day filter that conflicts with time selector
- **Location**: `/src/app/orders/OrdersOverviewClient.tsx:18-24`
- **Solution**: Remove hardcoded date filter from `defaultFilters`

### 3. Simplify Dual State Management
- **Issue**: Returns page maintains both simple and complex time range states
- **Location**: `/src/app/returns/ReturnsOverviewClient.tsx:37-42, 261-272`
- **Solution**: Use single time range state with proper type conversion

### 4. Fix Null Default Handling
- **Issue**: Removal Orders uses null default instead of consistent period
- **Location**: `/src/app/removal-orders/RemovalOrdersClient.tsx:35, 469, 503`
- **Solution**: Use consistent 30-day default with proper fallback handling

### 5. Ensure Consistent Time Selector Component
- **Current**: All pages use `PeriodSelector` (good)
- **Verify**: All time selector instances use identical prop patterns
- **Standard Props**: `activePeriod`, `onChange` callback

## Implementation Checklist

### Phase 1: Standardize Default Periods (1 hour)
- [ ] Keep Dashboard at 180 days (already correct)
- [ ] Keep Orders at 180 days (already correct)  
- [ ] Keep Returns at 180 days (already correct)
- [ ] Keep Reimbursements at 180 days (already correct)
- [ ] Update Removal Orders from null to 180 days (`RemovalOrdersClient.tsx:35`)
- [ ] Test all pages load with 180-day default data

### Phase 2: Fix Conflicting Filters (1 hour)
- [ ] Remove hardcoded 14-day filter from Orders `defaultFilters` (`OrdersOverviewClient.tsx:18-24`)
- [ ] Ensure Orders time selector properly controls all data filtering
- [ ] Test Orders page time selector changes affect all widgets

### Phase 3: Simplify Returns State Management (2 hours)
- [ ] Remove dual time range state in Returns page (`ReturnsOverviewClient.tsx:37-42`)
- [ ] Use single `activePeriod` state like other pages
- [ ] Update PeriodSelector integration (`ReturnsOverviewClient.tsx:261-272`)
- [ ] Update ReturnsOverview component prop (`ReturnsOverviewClient.tsx:301`)
- [ ] Test Returns page time selector functionality

### Phase 4: Fix Removal Orders Integration (1 hour)
- [ ] Replace null default with 180-day default (`RemovalOrdersClient.tsx:35`)
- [ ] Remove conditional logic for null period (`RemovalOrdersClient.tsx:81-88`)
- [ ] Update PeriodSelector to use standard pattern (`RemovalOrdersClient.tsx:469`)
- [ ] Update RemovalOrdersOverview prop handling (`RemovalOrdersClient.tsx:503`)
- [ ] Test Removal Orders time selector functionality

### Phase 5: Verification and Testing (1-2 hours)
- [ ] Test each overview page time selector changes all dependent widgets
- [ ] Verify consistent 180-day default across all pages
- [ ] Test time selector state persistence during navigation
- [ ] Verify API calls include proper date parameters for all pages
- [ ] Test edge cases (switching between periods rapidly)

## Test Strategy

### Unit Tests
- Test time range calculation utilities
- Test PeriodSelector component prop handling
- Test API parameter generation from time periods

### Integration Tests
- Test each overview page time selector triggers data refetch
- Test all widgets update when time period changes
- Test default period loading on page load

### Manual Testing
- Navigate to each overview page and verify 30-day default
- Change time periods and verify all stats/widgets update
- Check Network tab to ensure API calls include correct date parameters

## Success Criteria

### Functional Requirements
- [ ] All overview pages have consistent 180-day default time period
- [ ] Time selector changes update all dependent widgets and stats
- [ ] No conflicting date filters override time selector behavior
- [ ] All pages use single, simple time range state management

### User Experience Requirements
- [ ] Consistent behavior across all overview pages
- [ ] Time selector changes are immediately reflected in all data
- [ ] No loading states show stale data after time period changes

### Technical Requirements
- [ ] Single source of truth for time range state per page
- [ ] Consistent PeriodSelector component usage
- [ ] Proper API integration with date parameters
- [ ] Clean, maintainable time range state management

## Dependencies

- **Frontend**: SellerSmart-Web repository
- **Components**: Existing PeriodSelector component
- **Utilities**: Date range calculation functions
- **APIs**: All overview data endpoints support date range parameters

## Risks and Mitigation

**Risk**: Changing Removal Orders from null to 180 days might show more data than expected
**Mitigation**: 180 days provides richer insights, consistent with other pages

**Risk**: API calls might not support all required date parameters  
**Mitigation**: Analysis shows all APIs already support startDate/endDate parameters

**Risk**: Complex state changes might break existing functionality
**Mitigation**: Incremental changes with thorough testing at each step

## Notes

- This standardization improves user experience consistency
- Reduces complexity in Returns page dual state management  
- Ensures time selectors actually control all page data as users expect
- 180-day default provides richer data for meaningful business insights and trend analysis