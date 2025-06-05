# PRD_20250605_1206_tanstack_pagination_fixes

## Problem Statement & User Needs

Users are experiencing inconsistent pagination behavior across different SellerSmart-Web tables that use TanStackTableWrapper. Some tables are missing the "Show X options" (20, 50, 100 etc.) page size selector, making it difficult for users to efficiently view large datasets. This creates a poor user experience where users cannot customize how many items they see per page across all table implementations.

### Current Issues:
- Some TanStackTableWrapper implementations are missing `pageSize` and `onPageSizeChange` props
- Inconsistent pagination experience across different modules (inventory, qogita, wholesale, etc.)
- Users cannot change page sizes on tables that don't have the page size selector
- API routes support pagination parameters but frontend components aren't always utilizing them

## MCP Tools Used Section

**Tools Consulted:**
- **Grep Tool**: Used to find all files using TanStackTableWrapper and identify pagination patterns
- **Read Tool**: Analyzed TanStackTableWrapper, StandardPagination, and PageSizeSelector components
- **File Analysis**: Examined table implementations in brandscan, qogita, inventory, wholesale, and other modules

**Key Findings:**
- TanStackTableWrapper already supports pageSize and onPageSizeChange props (lines 61-62)
- StandardPagination component has proper PageSizeSelector integration (line 72)
- PageSizeSelector component correctly implements page size options [10, 20, 50, 100] (line 17)
- API routes like `/api/amazon/inventory/route.ts` support pageSize parameters (lines 73-76)

## Codebase Analysis Section

**Similar Existing Implementations:**
- **Working Example**: `/src/components/features/brandscan/brandscan-table/index.tsx` (lines 105-106) - correctly passes pageSize and onPageSizeChange
- **Working Example**: `/src/components/features/amazon/inventory-table/index.tsx` (lines 24-25) - properly implements pagination props
- **Working Example**: `/src/app/wholesale/[taskId]/page.tsx` (lines 499-502) - uses separate StandardPagination with onPageSizeChange

**Missing Implementation Pattern Found:**
- **Issue**: `/src/components/features/qogita/qogita-table/index.tsx` - Missing pageSize and onPageSizeChange props in TanStackTableWrapper (lines 456-485)

**Code Examples to Follow:**
```tsx
// CORRECT pattern from brandscan-table/index.tsx
<TanStackTableWrapper
    pageSize={pageSize}
    onPageSizeChange={onPageSizeChange}
    currentPage={currentPage || 1}
    totalPages={totalPages || 1}
    onPageChange={onPageChange}
    // ... other props
/>
```

**Architectural Patterns to Maintain:**
- All table props should include optional pageSize and onPageSizeChange handlers
- Default pageSize should be 20 when not specified
- Page size changes should reset currentPage to 1
- Use PAGE_SIZE_OPTIONS = [10, 20, 50, 100] from PageSizeSelector component

**Relevant Utilities to Reuse:**
- `PageSizeSelector` component at `/src/components/shared/Table/PageSizeSelector.tsx`
- `StandardPagination` component at `/src/components/shared/Table/StandardPagination.tsx`
- TanStackTableWrapper pagination logic (lines 866-875)

## Technical Requirements

### Core Requirements:
1. **Audit all TanStackTableWrapper implementations** to identify missing pagination props
2. **Add missing pageSize and onPageSizeChange props** to table components where absent
3. **Update parent components/pages** to handle page size state management
4. **Ensure API integration** supports pagination parameters
5. **Maintain consistent UX** across all table implementations

### Files Requiring Updates:

Based on analysis, these files need pagination prop additions:

**High Priority (Confirmed Missing):**
1. `/src/components/features/qogita/qogita-table/index.tsx` - Missing pageSize props
2. `/src/components/features/rivalradar/rivalradar-table/index.tsx` - Needs verification
3. `/src/components/features/brandwatch/brandwatch-table/index.tsx` - Needs verification

**Medium Priority (Need Verification):**
4. `/src/components/features/amazon/removal-orders-table/RemovalOrdersTable.tsx`
5. `/src/components/features/amazon/returns-table/index.tsx`
6. `/src/components/features/amazon/reimbursements-table/index.tsx`
7. `/src/components/features/amazon/review-request-table/` (multiple files)
8. `/src/components/features/amazon/replensmart-table/index.tsx`
9. `/src/components/features/amazon/orders-table/index.tsx`

**Parent Pages/Components That May Need Updates:**
- `/src/app/rivalradar/[rivalId]/page.tsx`
- Pages that use the above table components

## Implementation Checklist

### Phase 1: Audit and Documentation
- [ ] Create script to automatically find all TanStackTableWrapper usages
- [ ] Document current pagination prop status for each table implementation
- [ ] Identify parent components that need page size state management
- [ ] Verify API route pagination parameter support for each affected endpoint

### Phase 2: Core Component Updates
- [ ] Update QogitaTable component to include pageSize and onPageSizeChange props
- [ ] Update RivalRadar table component with missing pagination props
- [ ] Update BrandWatch table component with missing pagination props
- [ ] Add type definitions for pagination props where missing

### Phase 3: Amazon Module Tables
- [ ] Audit and fix RemovalOrdersTable pagination
- [ ] Audit and fix ReturnsTable pagination
- [ ] Audit and fix ReimbursementsTable pagination
- [ ] Audit and fix ReviewRequestTable pagination
- [ ] Audit and fix ReplenSmartTable pagination
- [ ] Audit and fix OrdersTable pagination

### Phase 4: Parent Component Integration
- [ ] Update parent pages to manage pageSize state
- [ ] Ensure page size changes reset currentPage to 1
- [ ] Add pageSize to URL query parameters where appropriate
- [ ] Test API integration with pagination parameters

### Phase 5: API Route Verification
- [ ] Verify all affected API routes support pageSize parameter
- [ ] Ensure proper validation of pageSize values [10, 20, 50, 100]
- [ ] Test pagination performance with large datasets

### Phase 6: Testing and Quality Assurance
- [ ] Test pagination functionality on all updated tables
- [ ] Verify page size selector appears correctly
- [ ] Test page size changes with API calls
- [ ] Ensure consistent UX across all table implementations
- [ ] Test with different data sizes and user scenarios

### Phase 7: Documentation and Cleanup
- [ ] Update component documentation for pagination props
- [ ] Create developer guidelines for implementing table pagination
- [ ] Remove any duplicate pagination implementations
- [ ] Ensure code consistency across all table components

## Test Strategy

**Unit Tests:**
- Test PageSizeSelector component with different page sizes
- Test TanStackTableWrapper pagination prop handling
- Test parent component state management for page size changes

**Integration Tests:**
- Test table pagination with real API data
- Test page size changes across different modules
- Test URL query parameter integration

**User Acceptance Tests:**
- Verify users can change page sizes on all tables
- Ensure consistent pagination behavior across modules
- Test performance with large datasets and different page sizes

## Success Criteria

1. **Consistency**: All TanStackTableWrapper implementations have functional page size selectors
2. **Functionality**: Users can select from [10, 20, 50, 100] items per page on all tables
3. **Performance**: Page size changes trigger appropriate API calls with correct parameters
4. **UX**: Pagination behavior is consistent across all SellerSmart modules
5. **Maintainability**: Clear patterns established for future table implementations

## Technical Implementation Notes

### Code Patterns to Follow:

**1. Table Component Props:**
```tsx
interface TableProps {
    pageSize?: number;
    onPageSizeChange?: (pageSize: number) => void;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    // ... other props
}
```

**2. Parent Component State Management:**
```tsx
const [pageSize, setPageSize] = useState(20);
const [currentPage, setCurrentPage] = useState(1);

const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
};
```

**3. TanStackTableWrapper Usage:**
```tsx
<TanStackTableWrapper
    pageSize={pageSize}
    onPageSizeChange={handlePageSizeChange}
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
    showPageSizeSelector={true}
    // ... other props
/>
```

### API Integration:
- Ensure API routes accept `pageSize` parameter
- Validate pageSize values against [10, 20, 50, 100]
- Handle pagination response metadata correctly

## Branch Strategy
- Create feature branch from `master`
- Branch name: `feature/fix-tanstack-pagination`
- Implement changes incrementally by module
- Test each module before moving to next

---

**Priority**: High
**Effort Estimate**: 3-4 days
**Dependencies**: None
**Risk Level**: Low (UI/UX enhancement, no breaking changes)