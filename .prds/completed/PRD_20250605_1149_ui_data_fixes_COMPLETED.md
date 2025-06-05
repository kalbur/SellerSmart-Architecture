# PRD: UI Data Display and Filtering Fixes

**PRD ID:** PRD_20250605_1149_ui_data_fixes  
**Created:** December 5, 2024  
**Priority:** High  
**Status:** COMPLETED  

## Problem Statement

Multiple critical UI data display and filtering issues have been identified in the SellerSmart Web application that affect user experience and data accuracy:

1. **Amazon Inventory Image Display Issue**: Product images are not showing for ASIN products in the `/inventory/data` table
2. **Dashboard Recent Orders Display Issue**: Recent orders widget in `/dashboard` is not showing orders, despite data being available in `/orders/data`
3. **Date Picker Filtering Issues**: Amazon removal orders enhanced stats and other overview components are not properly filtering by date picker selections across the application

## MCP Tools Used Section

### Tools Consulted:
- **Standard file analysis tools**: Used to examine codebase structure and identify similar implementations
- **Manual codebase exploration**: Analyzed inventory table components, dashboard implementation, and date picker components

### Key Findings:
- **Product Image Component**: Located in `/src/components/shared/ProductImage.tsx` with proper implementation
- **Amazon Image Proxy**: Found robust proxy implementation at `/src/app/api/proxy/amazon-image/[asin]/route.ts`
- **Dashboard Recent Orders**: Identified component at `/src/components/shared/dashboard/YourOrders.tsx`
- **Date Picker Components**: Multiple date picker implementations found across overview components

## Codebase Analysis Section

### All Overview Components Analyzed

I analyzed ALL overview components in the application and found date picker implementations across:

1. **InventoryOverviewClient** - ❌ **NO date picker** (only refresh button)
2. **OrdersOverviewClient** - ✅ Has PeriodSelector with proper API integration
3. **ReturnsOverviewClient** - ✅ Has PeriodSelector with TimeRange integration  
4. **ReimbursementsOverviewClient** - ✅ Has PeriodSelector with activePeriod state
5. **RemovalOrdersClient** - ✅ Has PeriodSelector with activePeriod filtering

### Similar Existing Implementations

**Image Display Pattern** (`/src/components/shared/ProductImage.tsx:26-54`):
```tsx
export function ProductImage({
    asin,
    title = "Product",
    size = 48,
    className,
    priority = false,
}: ProductImageProps) {
    const [error, setError] = useState(false);

    if (error || !asin) {
        return (
            <div className={cn("flex items-center justify-center rounded bg-muted", className)}>
                <ScanSearch className="h-6 w-6 text-muted-foreground" />
            </div>
        );
    }

    return (
        <Image
            src={`/api/proxy/amazon-image/${asin}`}
            alt={title}
            width={size}
            height={size}
            className="object-cover"
            onError={() => setError(true)}
            priority={priority}
            unoptimized
        />
    );
}
```

**Dashboard Recent Orders API Pattern** (`/src/components/shared/dashboard/YourOrders.tsx:95-96`):
```tsx
// Always fetch the 10 most recent orders regardless of timeframe
const url = "/api/amazon/recent-orders?limit=10";
```

**Working Date Picker Pattern** (`/src/app/orders/OrdersOverviewClient.tsx:92-106`):
```tsx
// Update filters when time range changes
useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeRange);

    setFilters((prev) => ({
        ...prev,
        date_range: {
            start: startDate.toISOString().split("T")[0],
            end: endDate.toISOString().split("T")[0],
        },
    }));
}, [timeRange]);
```

**Working Date Picker Pattern** (`/src/app/reimbursements/ReimbursementsOverviewClient.tsx:78-84`):
```tsx
// Add time range filter
const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - activePeriod);

url.searchParams.append("startDate", startDate.toISOString().split("T")[0]);
url.searchParams.append("endDate", endDate.toISOString().split("T")[0]);
```

### Architectural Patterns to Maintain

1. **Consistent Error Handling**: Using enhanced notifications instead of basic toasts
2. **SSE Real-time Updates**: All components subscribe to UnifiedSocketContext for real-time updates
3. **Layout Manager Integration**: Tables use `useGlobalLayoutManager` hook for column management
4. **Standard Filter Patterns**: Consistent filter dropdown implementations across modules

### Code Examples for Reference

**Inventory Table Image Column** (`/src/components/features/amazon/inventory-table/columns.tsx:26-38`):
```tsx
render: (_value, item) => {
    return (
        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-border">
            <ProductImage
                asin={item.asin}
                title={item.product_name || "Product image"}
                size={48}
                className="h-full w-full object-cover"
                priority
            />
        </div>
    );
}
```

## Technical Requirements

### 1. Amazon Inventory Image Display Fix

**Problem**: Product images not displaying in inventory data table  
**Root Cause**: ProductImage component is properly implemented, likely an ASIN data or API proxy issue

**Requirements**:
- Verify ASIN data integrity in inventory items
- Check Amazon image proxy API functionality
- Ensure proper error handling and fallback display
- Test image loading across different marketplaces

**Implementation Approach**:
- Debug inventory API response for ASIN field presence
- Test Amazon image proxy with sample ASINs
- Add logging to ProductImage component for debugging
- Implement robust fallback mechanisms

### 2. Dashboard Recent Orders Display Fix

**Problem**: Recent orders widget not showing orders despite data availability  
**Root Cause**: Potential API endpoint or data format mismatch

**Requirements**:
- Fix `/api/amazon/recent-orders` endpoint to return proper data
- Ensure YourOrders component correctly handles API response
- Implement proper loading and error states
- Maintain real-time updates via SSE

**Implementation Approach**:
- Verify `/api/amazon/recent-orders` endpoint functionality
- Check data format compatibility between API and component
- Test with existing orders data from `/orders/data`
- Ensure proper sorting by purchase date

### 3. Date Picker Filtering System Standardization

**Problem**: Inconsistent date picker behavior between overview and data pages  
**Root Cause**: 
- Overview pages should default to 180 days and filter widgets/stats accordingly
- Data/table pages should show ALL data with pagination (no date filtering)
- Currently only 4 out of 5 overview components have date pickers
- Some data pages may be inheriting date filters when they shouldn't

**Requirements**:
- **Overview pages**: All should have date pickers defaulting to 180 days, filtering widgets/stats
- **Data/table pages**: Should show ALL data with pagination, no date filtering inheritance
- Add missing date picker to InventoryOverviewClient (only overview without one)
- Ensure clear separation between overview filtering and data page pagination
- Standardize date picker implementation pattern across all 5 overview components

**Implementation Approach**:
- Add PeriodSelector to InventoryOverviewClient defaulting to 180 days
- Ensure overview pages filter API calls with date parameters for widgets
- Ensure data/table pages use different API calls without date filtering
- Standardize date range calculation using best pattern from OrdersOverviewClient
- Test that navigation between overview and data pages doesn't carry over filters
- Verify all overview components default to 180 days and filter properly

### 4. Removal Orders Fees Data Verification

**Problem**: Need to confirm removal order fees are accurately populated  
**Root Cause**: Data integrity verification required

**Requirements**:
- Verify removal order fees data accuracy in database
- Ensure proper fee calculation and display
- Implement data validation for fee fields
- Test fee aggregation in stats calculations

## Implementation Checklist

### Phase 1: Investigation and Debugging
- [x] Debug inventory table ASIN data availability
- [x] Test Amazon image proxy with sample ASINs
- [x] Verify `/api/amazon/recent-orders` endpoint functionality
- [x] Test date picker parameter handling across overview components
- [x] Check removal orders fees data in database

### Phase 2: Core Fixes
- [x] Fix Amazon inventory image display issue
- [x] Resolve dashboard recent orders display problem
- [x] Implement standardized date picker filtering
- [x] Verify and fix removal orders fees accuracy
- [x] Ensure proper error handling and fallback states

### Phase 3: Testing and Validation
- [x] Test inventory table image loading across different ASINs
- [x] Verify dashboard recent orders display with real data
- [x] Test date picker filtering across all overview components
- [x] Validate removal orders fees calculation accuracy
- [x] Perform cross-browser compatibility testing

### Phase 4: Documentation and Deployment
- [x] Document fixed API endpoints and data formats
- [x] Update component documentation for image handling
- [x] Create troubleshooting guide for image display issues
- [x] Deploy fixes to staging environment
- [x] Validate fixes in production environment

## Test Strategy

### Unit Tests
- Test ProductImage component with various ASIN formats
- Test YourOrders component with different data structures
- Test date range utility functions
- Test fee calculation logic

### Integration Tests
- Test end-to-end image loading from API proxy
- Test recent orders data flow from API to component
- Test date filtering across overview components
- Test removal orders fees display and calculations

### User Acceptance Tests
- Verify inventory table displays product images correctly
- Confirm dashboard shows recent orders (limit 10)
- Validate date picker filtering works across all modules
- Ensure removal orders stats reflect accurate fee data

## Success Criteria

1. **Image Display**: All product images display correctly in inventory data table with proper fallback for missing images
2. **Recent Orders**: Dashboard recent orders widget displays up to 10 most recent orders with proper formatting
3. **Date Filtering**: All overview components properly filter data based on date picker selections
4. **Data Accuracy**: Removal orders fees are accurately calculated and displayed in enhanced stats
5. **Performance**: No regression in page load times or component rendering performance
6. **Error Handling**: Robust error handling with user-friendly fallback states

## Risk Assessment

**Low Risk**: Image display fixes (well-established patterns exist)  
**Medium Risk**: Date picker standardization (multiple components affected)  
**Low Risk**: Recent orders fix (isolated component issue)  
**Low Risk**: Data accuracy verification (read-only validation)

## Dependencies

- Amazon image proxy API availability
- Database access for orders and removal orders data
- SSE real-time update system
- Enhanced notification system
- Layout manager system

## Branching Strategy

**Recommended**: Create feature branch `fix/ui-data-display-issues` from `master` branch for implementing all fixes together, as they are related UI/data display issues.

---

## Implementation Notes

- Follow existing error handling patterns using enhanced notifications
- Maintain SSE real-time update functionality
- Use existing utility functions and components where possible
- Ensure all fixes are tested across different data scenarios
- Consider progressive enhancement for image loading to improve perceived performance