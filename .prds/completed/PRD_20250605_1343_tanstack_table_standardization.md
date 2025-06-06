# PRD_20250605_1343_tanstack_table_standardization

**STATUS: COMPLETED**

## Problem Statement

The SellerSmart-Web application has undergone massive changes to implement TanStack tables across multiple features, but needs comprehensive standardization to ensure all tables have:

1. **Complete Column Management**: Consistent column resizing, reordering, visibility toggling, and state persistence
2. **Standardized Local State**: Unified column width persistence across all table implementations
3. **Column Remapping**: Proper column order management and drag-and-drop functionality
4. **Standardized Filters**: Unified filter system with specific value ranges and boolean options (no custom ranges or date pickers)

## User Needs

**Primary Users**: Internal developers and end users interacting with data tables
**Core Requirements**:
- Tables must maintain column state (width, order, visibility) across sessions
- Drag-and-drop column reordering must work consistently
- Column resizing must persist and provide smooth UX
- Filters must be standardized with predefined options only
- All table functionality must work seamlessly across different data sets

## MCP Tools Used

**Repomix Analysis**: Used to analyze the entire SellerSmart-Web codebase structure and identify all table implementations and patterns.

### Key Findings:
- **22+ standardized cell types** already implemented
- **TanStackTableWrapper** as the primary table component
- **useGlobalLayoutManager** hook for state management (modern approach)
- **useSimpleColumnManager** exists but is **UNUSED** (225 lines of dead code)
- **UnifiedFilterDropdown** with 6 filter types (checkbox, range, dateRange, toggle, text, predefinedTime)
- **Auto-fit width calculation** system already in place
- **🚨 Wholesale tables use LEGACY LayoutManager component** (critical migration needed)
- **🚨 Inconsistent wrapper patterns** across tables
- **🚨 Multiple "Unified" filter components** that aren't actually unified

## Codebase Analysis

### Current Table Infrastructure

**Core Components**:
- `/src/components/shared/Table/TanStackTableWrapper.tsx` - Main table wrapper with DND and resizing
- `/src/components/shared/Table/StandardTable.tsx` - Legacy table implementation
- `/src/components/ui/table.tsx` - Base shadcn/ui table primitives

**Column Management Hooks**:
- `/src/hooks/useGlobalLayoutManager.ts` - **MODERN** - state management with localStorage persistence
- `/src/hooks/useTableColumnManager.ts` - Legacy column state management  
- `/src/hooks/useSimpleColumnManager.ts` - **UNUSED** - should be deleted (225 lines of dead code)
- `/src/hooks/useTableAutoFit.ts` - Auto-width calculation system

**Legacy Components (Need Migration)**:
- `/src/components/shared/LayoutManager.tsx` - **LEGACY** - used only by Wholesale tables

**Filter System**:
- `/src/components/shared/Filters/UnifiedFilterDropdown.tsx` - Unified filter dropdown with 6 filter types
- `/src/components/shared/Filters/TableFilterBar.tsx` - Filter bar with search and active filter badges
- `/src/types/components/filter.types.ts` - Filter type definitions

**Existing Table Implementations**:
- Amazon tables: `inventory-table.tsx`, `orders-table.tsx`, `review-request-table.tsx`, `removal-orders-table`
- Feature tables: `brandwatch-table`, `rivalradar-table`, `wholesale-table`, `brandscan-table`, `qogita-table`
- Specialized: `RestrictionCheckerTable.tsx`, `replensmart-table`

### Code Examples for Consistency

**TanStackTableWrapper Usage Pattern**:
```tsx
<TanStackTableWrapper<DataType>
    data={data}
    columns={columns}
    sortBy={sortBy}
    sortOrder={sortOrder}
    onSort={handleSort}
    onColumnResize={handleColumnResize}
    onColumnVisibilityChange={handleColumnVisibility}
    onColumnOrderChange={handleColumnOrderChange}
    enableAutoFit={true}
    contextMenu={true}
    contextMenuType="product"
/>
```

**Column Manager Integration**:
```tsx
// STANDARD PATTERN (after migration)
const {
    columns,
    updateColumnWidth,
    updateColumnVisibility, 
    updateColumnOrder,
} = useGlobalLayoutManager({
    defaultColumns: DEFAULT_COLUMNS,
    moduleId: "module-name",
});
```

**Filter Implementation Pattern**:
```tsx
const filters: FilterDescriptor[] = [
    {
        id: "status",
        label: "Status",
        type: "checkbox",
        icon: <Filter className="h-4 w-4" />,
        props: { options: STATUS_OPTIONS }
    },
    {
        id: "profit_range",
        label: "Profit Range",
        type: "range",
        icon: <DollarSign className="h-4 w-4" />,
        props: { min: 0, max: 1000, step: 10, unit: "$" }
    }
];
```

## Architecture Standardization Scope

## Current State Analysis

### **Critical Issues Found**
1. **🚨 Wholesale tables use LEGACY LayoutManager** (not useGlobalLayoutManager)
2. **🚨 Inconsistent wrapper patterns** across tables
3. **🚨 Review Request/RivalRadar tables missing context menus**
4. **🚨 Multiple "Unified" filter components** that aren't actually unified
5. **🚨 useSimpleColumnManager is completely unused** (224 lines dead code)
6. **🚨 MAJOR: Keepa graphs DON'T respond to table date range filters** (disconnected systems)
7. **🚨 Pagination state has no persistence** (resets on refresh/navigation)
8. **🚨 No global page size preferences** (user can't set default page size)
9. **🚨 API integration patterns are completely inconsistent** across tables
10. **🚨 Error handling varies drastically** between table implementations
11. **🚨 No accessibility standards** (ARIA, keyboard nav missing)
12. **🚨 No standardized testing patterns** for table functionality

### **Current Wrapper Patterns (INCONSISTENT)**
- **SimpleKeepaWrapper + TooltipProvider**: Inventory, Orders, Reimbursements, Returns, Wholesale, Qogita
- **TooltipProvider only**: Removal Orders, BrandScan  
- **No wrapper**: Review Requests, ReplenSmart

### **Keepa Graph Requirements Analysis**
**Tables that NEED Keepa graphs** (price history, competitor analysis):
- ✅ **Inventory** - Price history graphs
- ✅ **Wholesale** - Sourcing analysis graphs  
- ✅ **BrandScan** - Competitor analysis graphs
- ✅ **RivalRadar** - Tracking graphs
- ✅ **Qogita** - Pricing graphs
- ✅ **ReplenSmart** - Replenishment analysis graphs

**Tables that DON'T need Keepa graphs**:
- ❌ **Orders** - No price analysis needed
- ❌ **Returns** - No price analysis needed
- ❌ **Reimbursements** - No price analysis needed
- ❌ **Removal Orders** - No price analysis needed
- ❌ **Review Requests** - No price analysis needed

### **Current Context Menu Types (INCONSISTENT)**
- `"inventory"`, `"order"`, `"reimbursement"`, `"return"`, `"removal_order"`, `"product"`
- **Missing context menus**: Review Requests, RivalRadar

### **Column Management Integration (PARTIALLY IMPLEMENTED)**
- **✅ Direct Drag-and-Drop**: Table header drag-and-drop works properly across most tables
- **✅ Dropdown Column Manager**: Current implementation uses dropdown with DND and live updates
- **🔧 Missing Dialog Interface**: No proper column layout dialog/modal with comprehensive management
- **🔧 Limited UX**: Dropdown format restricts space for complex column management
- **❌ No Preview/Cancel Pattern**: Changes apply immediately without preview or cancel option
- **✅ Event System**: Custom events properly sync between column manager and tables
- **🔧 Minor Issue**: ReviewRequestTableSimple has signature compatibility warning

### **Current Filter Systems (FRAGMENTED)**
- `UnifiedOrdersFilters`, `UnifiedReimbursementsFilters`, `UnifiedReturnsFilters`, `UnifiedRemovalOrdersFilters`
- Custom: `InventoryFilters`, inline filter bars, external filters

### **Keepa Graph Integration Issues (MAJOR PROBLEM)**
- **🚨 BROKEN: Keepa graph time range buttons don't work** (7d, 30d, 90d, All buttons don't filter data)
- **Client-side Filtering Broken**: Graph has 365 days of data but buttons don't filter the display
- **User Experience Issue**: Users click time range buttons expecting graph to change, but nothing happens
- **Data Available**: Keepa API fetches 365 days correctly, but frontend filtering is non-functional

### **Pagination Patterns (INCONSISTENT)**
- **State Management**: Some use `useTablePagination` hook, others manual state
- **Page Size Options**: Consistent [10, 20, 50, 100] across tables
- **No Persistence**: Pagination resets on refresh/navigation
- **No Global Preferences**: Users can't set default page size across tables

### **API Integration Patterns (CHAOTIC)**
- **Different Libraries**: Some use `useSWR`, others `useQuery`, others direct fetch
- **Error Handling**: Toast notifications vs inline errors vs no error handling
- **Loading States**: Different loading indicators and error recovery mechanisms
- **Retry Patterns**: Inconsistent retry logic across tables

### What Should Be Different (Business Logic Only)
1. **Context menus** - Different actions per data type (inventory, orders, returns, etc.)
2. **Row selection/clicking** - Only where bulk operations are needed:
   - **Review requests: Row selection enabled for bulk update functionality** ✅
   - Other tables: Preserve existing button functionality (no new row selection needed)
3. **Existing table buttons** - All current buttons and interactions must continue working

### What Should Be Identical (Infrastructure)
1. **Layout Manager** - All use `useGlobalLayoutManager` (migrate Wholesale from legacy)
2. **Wrappers** - Standardized based on Keepa graph requirements:
   - **Tables WITH Keepa graphs**: `TooltipProvider` + `SimpleKeepaWrapper` + `TanStackTableWrapper`
   - **Tables WITHOUT Keepa graphs**: `TooltipProvider` + `TanStackTableWrapper`
3. **Keepa Graph Time Range Buttons** - Fix broken time period filtering (30D, 60D, 90D, All)
4. **Pagination** - Same `useTablePagination` hook with state persistence
5. **Page Size Preferences** - Global user preference that persists across tables
6. **API Integration** - Single data fetching pattern with consistent error handling
7. **Error Handling** - Unified error display and recovery patterns
8. **Auto-fit** - Same configuration across all tables  
9. **Loading states** - Same `EmptyModuleState` for empty data
10. **Column management** - Same resize, reorder, visibility patterns with:
    - Proper drag-and-drop integration (table headers + dialog)
    - Column layout dialog with live preview on background table
    - Save/cancel workflow for column changes
11. **State persistence** - Same localStorage patterns via useGlobalLayoutManager
12. **Styling** - Same CSS classes, spacing, themes
13. **Props interface** - Same prop names and patterns
14. **Cell rendering** - Same shared components
15. **Filters** - Single unified filter system (consolidate all "Unified" filters)
16. **Accessibility** - Consistent ARIA patterns, keyboard navigation
17. **Testing** - Standardized testing utilities and patterns

## Technical Requirements

### 1. Table Component Standardization
- **Ensure all tables use TanStackTableWrapper** instead of legacy StandardTable
- **Verify drag-and-drop column reordering** works across all implementations
- **Confirm column resizing persistence** via localStorage integration
- **Validate auto-fit width calculation** is properly configured

### 2. Column Management Consistency
- **useGlobalLayoutManager integration** for all table implementations (single hook approach)
- **Migrate Wholesale tables from legacy LayoutManager** (CRITICAL)
- **Module-specific localStorage keys** (`table-layout-${moduleId}`)
- **Column width persistence** with debounced localStorage updates via useGlobalLayoutManager
- **Column order management** with drag-and-drop support
- **Column visibility toggling** with context menu integration
- **Remove unused useSimpleColumnManager** (224 lines of dead code)

### 3. State Management Requirements
- **ColumnSizingState persistence** across browser sessions
- **ColumnOrderState management** with proper array manipulation
- **ColumnVisibilityState tracking** with default visibility settings
- **Debounced auto-save** functionality (500ms delay)

### 4. Filter System Standardization
- **Remove all custom date pickers** - use predefinedTime filter type only
- **Eliminate custom range inputs** - use predefined range options only
- **Standardize to specific value filters**:
  - `checkbox` - For multi-select options (status, categories, etc.)
  - `toggle` - For boolean filters (true/false states)
  - `range` - Only with predefined min/max values and steps
  - `text` - For search/text input filters
  - `predefinedTime` - For time-based filtering with preset options

### 5. Performance Requirements
- **Auto-fit calculations** must complete within 200ms
- **Column resize operations** must feel smooth (60fps)
- **State persistence** must not block UI interactions
- **Filter updates** must debounce appropriately

## Implementation Checklist

### Phase 1: Critical Code Cleanup & Legacy Migration (6-8 hours)
- [ ] **Delete unused useSimpleColumnManager.ts** (224 lines of dead code)
- [ ] **🚨 CRITICAL: Migrate Wholesale tables from legacy LayoutManager** to useGlobalLayoutManager
- [ ] **🚨 CRITICAL: Fix Keepa graph time range button functionality**:
  - Fix broken client-side filtering in Keepa graph component
  - Ensure 7d, 30d, 90d, All buttons actually filter the displayed data
  - Test that users can see different time periods when clicking buttons
- [ ] **Standardize wrapper hierarchy based on Keepa graph requirements**:
  - **Tables WITH Keepa graphs**: `TooltipProvider` + `SimpleKeepaWrapper` + `TanStackTableWrapper`
    - Inventory, Wholesale, BrandScan, RivalRadar, Qogita, ReplenSmart
  - **Tables WITHOUT Keepa graphs**: `TooltipProvider` + `TanStackTableWrapper`  
    - Orders, Returns, Reimbursements, Removal Orders, Review Requests
- [ ] **Add missing context menus** to Review Request and RivalRadar tables
- [ ] **Inventory all table implementations** and document current state
- [ ] **Identify remaining StandardTable usage** for migration

### Phase 2: API Integration & Error Handling Standardization (8-12 hours)
- [ ] **🚨 CRITICAL: Standardize API integration patterns**:
  - Create unified data fetching hook (choose useSWR vs useQuery vs custom)
  - Implement consistent error handling across all tables
  - Standardize loading states and retry mechanisms
- [ ] **Implement unified error handling system**:
  - Consistent error display (toast vs inline)
  - Standard error recovery patterns
  - User-friendly error messages
- [ ] **Standardize pagination state management**:
  - All tables use `useTablePagination` hook
  - Implement pagination state persistence
  - Add global page size user preferences

### Phase 3: Column Management Enhancement (6-8 hours)
- [ ] **Ensure all tables use useGlobalLayoutManager** (post-Wholesale migration)
- [ ] **🚨 NEW: Implement proper Column Layout Dialog**:
  - Replace dropdown with full modal/dialog interface
  - Add live preview of column changes on background table
  - Implement save/cancel workflow instead of immediate changes
  - Add bulk column selection/deselection
  - Include search/filter functionality for columns
  - Add "Reset to Default" option
- [ ] **Verify column drag-and-drop integration** across all tables:
  - Ensure `onColumnOrderChange={updateColumnOrder}` is properly connected
  - Test that dragging columns immediately updates table layout (both header DND and dialog DND)
  - Verify column order changes persist to localStorage and backend
- [ ] **Fix ReviewRequestTableSimple column reorder compatibility** (signature warning)
- [ ] **Enhance column management UX**:
  - Improve event system for live preview
  - Add unsaved changes warning
  - Test save/cancel functionality
- [ ] **Standardize localStorage persistence** patterns via useGlobalLayoutManager
- [ ] **Verify column resizing** works and persists across sessions
- [ ] **Validate auto-fit width calculations** are working
- [ ] **Fix any column visibility** toggle issues
- [ ] **Enable row selection for review requests table** (bulk update functionality)
- [ ] **Preserve existing button functionality** across all tables

### Phase 4: Filter System Consolidation (6-8 hours)
- [ ] **🚨 MAJOR: Consolidate multiple "Unified" filter components** into single system:
  - `UnifiedOrdersFilters` → single `UnifiedFilterDropdown`
  - `UnifiedReimbursementsFilters` → single `UnifiedFilterDropdown`  
  - `UnifiedReturnsFilters` → single `UnifiedFilterDropdown`
  - `UnifiedRemovalOrdersFilters` → single `UnifiedFilterDropdown`
- [ ] **Migrate custom filter implementations** (InventoryFilters, inline filters)
- [ ] **Remove all custom date picker implementations**
- [ ] **Replace custom range inputs** with predefined options
- [ ] **Standardize filter types** to allowed list only:
  - `checkbox` for multi-select
  - `toggle` for boolean  
  - `range` for predefined ranges
  - `text` for search
  - `predefinedTime` for time filters
- [ ] **Update all filter configurations** to use single UnifiedFilterDropdown
- [ ] **Test filter persistence** and clearing functionality

### Phase 5: Accessibility & Testing Standards (10-15 hours)
- [ ] **Implement accessibility standards**:
  - Add ARIA labels and roles to all table components
  - Implement keyboard navigation (arrow keys, tab, enter)
  - Ensure screen reader compatibility
  - Add focus management for modals and dropdowns
- [ ] **Create standardized testing framework**:
  - Build table testing utilities
  - Create test patterns for column management, sorting, filtering
  - Add accessibility testing
  - Implement visual regression testing for tables

### Phase 6: Integration Testing (3-4 hours)
- [ ] **Test column management** across all table implementations
- [ ] **Verify state persistence** survives browser refresh
- [ ] **Test column management functionality** in different browsers:
  - Test table header drag-and-drop reordering
  - Test column layout dialog drag-and-drop
  - Verify live preview updates work consistently
  - Test save/cancel workflow
- [ ] **Validate filter combinations** work properly
- [ ] **Check performance** of auto-fit calculations
- [ ] **Test responsive behavior** on different screen sizes
- [ ] **🚨 CRITICAL: Test Keepa graph time range button functionality** - ensure 30D, 60D, 90D, All buttons work
- [ ] **Test pagination state persistence** and global page size preferences
- [ ] **Validate API error handling** and recovery mechanisms

### Phase 7: Documentation & Final Cleanup (2-3 hours)
- [ ] **Update table implementation documentation**
- [ ] **Document standard column configuration patterns**
- [ ] **Create filter configuration examples**
- [ ] **Remove any remaining unused/deprecated components**
- [ ] **Update type definitions** if needed
- [ ] **Verify useSimpleColumnManager.ts deletion** didn't break anything

## Test Strategy

### Unit Tests
- **Column manager hooks** - state persistence, resize handling
- **Filter components** - value selection, clearing, persistence
- **Table wrapper** - prop handling, event delegation

### Integration Tests
- **End-to-end table functionality** - resize, reorder, filter, sort
- **State persistence** - localStorage integration across sessions
- **Performance testing** - auto-fit calculations, large datasets

### Manual Testing Scenarios
1. **Column Management Flow**:
   - Resize columns and verify persistence
   - Drag-and-drop column reordering
   - Hide/show columns via context menu
   - Browser refresh state preservation

2. **Filter Standardization**:
   - Test all filter types work consistently
   - Verify no custom date pickers exist
   - Check predefined value ranges only
   - Test filter clearing and combinations

3. **Performance Testing**:
   - Large dataset rendering (1000+ rows)
   - Rapid column resizing operations
   - Multiple simultaneous filter changes

## Success Criteria

### Functional Requirements
- ✅ **All tables use TanStackTableWrapper** with consistent configuration
- ✅ **Column resizing, reordering, and visibility** work on all tables
- ✅ **State persistence** maintains column preferences across sessions
- ✅ **Filters use only standardized types** (no custom implementations)
- ✅ **Auto-fit width calculations** work smoothly and efficiently
- ✅ **Review requests table has row selection** for bulk update functionality
- ✅ **All existing table buttons continue working** after standardization

### Performance Requirements
- ✅ **Column operations** complete within 100ms
- ✅ **Auto-fit calculations** complete within 200ms
- ✅ **Filter updates** don't block UI interactions
- ✅ **Large datasets** (500+ rows) render smoothly

### User Experience Requirements
- ✅ **Consistent behavior** across all table implementations
- ✅ **Intuitive column management** with visual feedback
- ✅ **Responsive design** works on all screen sizes
- ✅ **Accessible interactions** for keyboard and screen reader users

## Implementation Notes

### Column Width Persistence Strategy
The codebase implements localStorage persistence via `useTableColumnManager`:
```typescript
// Auto-save on column changes with module-specific keys (debounced)
const storageKey = `table-layout-${layoutKey}`;
localStorage.setItem(storageKey, JSON.stringify(layoutState));
```

### Code Cleanup Priority
**Delete useSimpleColumnManager.ts immediately** - it's 225 lines of unused code that creates confusion about which hook to use.

### Auto-fit Width System
The existing `useTableAutoFit` hook provides intelligent column sizing:
```typescript
const { columnWidths, isCalculating } = useTableAutoFit(
    visibleColumns,
    data,
    containerRef,
    { debounceDelay: 300, autoFitOnDataChange: true }
);
```

### Filter Type Restrictions
Standardize to these filter types only:
- **checkbox**: Multi-select from predefined options
- **toggle**: Boolean true/false states
- **range**: Predefined min/max with specific steps
- **text**: Search/text input
- **predefinedTime**: Time periods from preset list

### Branch Strategy
- Create feature branch: `feature/table-standardization`
- Implement changes incrementally by table type
- Test thoroughly before merging to master

## Estimated Timeline: 55-70 hours

- **Phase 1**: 6-8 hours (Critical Cleanup & Legacy Migration)
- **Phase 2**: 8-12 hours (API Integration & Error Handling)
- **Phase 3**: 6-8 hours (Column Management Enhancement - includes new dialog)
- **Phase 4**: 6-8 hours (Filter System Consolidation)
- **Phase 5**: 10-15 hours (Accessibility & Testing Standards)
- **Phase 6**: 3-4 hours (Integration Testing)
- **Phase 7**: 2-3 hours (Documentation)

**Total**: 41-58 hours of development work

### **CRITICAL PRIORITIES (Must Complete First)**
1. **Keepa Graph Time Range Button Fix** - Buttons currently don't work (major UX issue)
2. **API Integration Standardization** - Foundation for all tables
3. **Pagination State Persistence** - Basic functionality users expect

### Immediate Action Required
**Priority #1: Delete `/src/hooks/useSimpleColumnManager.ts`** - This unused file creates architectural confusion and should be removed before any other work begins.

## Post-Implementation Architecture

### **Standardized File Structure After Implementation**

#### **Tables WITH Keepa Graphs** (Inventory, Wholesale, BrandScan, RivalRadar, Qogita, ReplenSmart)
```tsx
// Standard implementation pattern with Keepa date range synchronization
import { TanStackTableWrapper } from "@/components/shared/Table/TanStackTableWrapper";
import { SimpleKeepaWrapper } from "@/components/shared/charts/SimpleKeepaWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGlobalLayoutManager } from "@/hooks/useGlobalLayoutManager";
import { useTablePagination } from "@/hooks/useTablePagination";
import { useTableData } from "@/hooks/useTableData";
import { DateRangeProvider } from "@/contexts/DateRangeContext";

export function InventoryTable({ filters, onFiltersChange }: InventoryTableProps) {
    const {
        columns,
        updateColumnWidth,
        updateColumnVisibility,
        updateColumnOrder,
    } = useGlobalLayoutManager({
        defaultColumns: INVENTORY_COLUMNS,
        moduleId: "inventory",
    });

    const {
        currentPage,
        pageSize,
        totalPages,
        onPageChange,
        onPageSizeChange,
    } = useTablePagination({
        moduleId: "inventory",
        defaultPageSize: 20,
    });

    const { data, isLoading, error } = useTableData({
        endpoint: "/api/inventory",
        filters,
        pagination: { currentPage, pageSize },
    });

    return (
        <TooltipProvider>
            <SimpleKeepaWrapper 
                tableId="inventory-table"
                // 🚨 FIX: Ensure time range buttons (30D, 60D, 90D, All) work properly
            >
                    <TanStackTableWrapper
                        data={data}
                        columns={columns}
                        onColumnResize={updateColumnWidth}
                        onColumnVisibilityChange={updateColumnVisibility}
                        onColumnOrderChange={updateColumnOrder} // ✅ CRITICAL: Drag-and-drop integration
                        contextMenu={true}
                        contextMenuType="inventory"
                        enableAutoFit={true}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        pageSize={pageSize}
                        onPageSizeChange={onPageSizeChange}
                        isLoading={isLoading}
                        error={error}
                    />
                </SimpleKeepaWrapper>
        </TooltipProvider>
    );
}
```

#### **Tables WITHOUT Keepa Graphs** (Orders, Returns, Reimbursements, Removal Orders, Review Requests)
```tsx
// Standard implementation pattern
import { TanStackTableWrapper } from "@/components/shared/Table/TanStackTableWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGlobalLayoutManager } from "@/hooks/useGlobalLayoutManager";

export function OrdersTable({ data, filters, onFiltersChange }: OrdersTableProps) {
    const {
        columns,
        updateColumnWidth,
        updateColumnVisibility,
        updateColumnOrder,
    } = useGlobalLayoutManager({
        defaultColumns: ORDERS_COLUMNS,
        moduleId: "orders",
    });

    return (
        <TooltipProvider>
            <TanStackTableWrapper
                data={data}
                columns={columns}
                onColumnResize={updateColumnWidth}
                onColumnVisibilityChange={updateColumnVisibility}
                onColumnOrderChange={updateColumnOrder}
                contextMenu={true}
                contextMenuType="order"
                enableAutoFit={true}
            />
        </TooltipProvider>
    );
}
```

#### **Review Requests Table** (With Row Selection)
```tsx
// Special case with row selection for bulk operations
export function ReviewRequestTable({ data, filters, onFiltersChange }: ReviewRequestTableProps) {
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    
    const {
        columns,
        updateColumnWidth,
        updateColumnVisibility,
        updateColumnOrder,
    } = useGlobalLayoutManager({
        defaultColumns: REVIEW_REQUEST_COLUMNS,
        moduleId: "review-requests",
    });

    return (
        <TooltipProvider>
            <TanStackTableWrapper
                data={data}
                columns={columns}
                onColumnResize={updateColumnWidth}
                onColumnVisibilityChange={updateColumnVisibility}
                onColumnOrderChange={updateColumnOrder}
                contextMenu={true}
                contextMenuType="review_request"
                enableAutoFit={true}
                selectedItems={selectedItems}
                onRowSelectionChange={(itemId, isSelected) => {
                    const newSelected = new Set(selectedItems);
                    if (isSelected) {
                        newSelected.add(itemId);
                    } else {
                        newSelected.delete(itemId);
                    }
                    setSelectedItems(newSelected);
                }}
            />
        </TooltipProvider>
    );
}
```

### **New Shared Infrastructure After Implementation**

#### **Unified Data Fetching Hook**
```tsx
// /src/hooks/useTableData.ts - Single data fetching pattern for all tables
export function useTableData<T>({
    endpoint,
    filters,
    pagination,
    dependencies = [],
}: UseTableDataOptions): UseTableDataReturn<T> {
    // Unified error handling, loading states, retry logic
    // Consistent API call patterns across all tables
}
```

#### **Pagination State Management Hook**
```tsx
// /src/hooks/useTablePagination.ts - Persistent pagination across all tables
export function useTablePagination({
    moduleId,
    defaultPageSize = 20,
}: UseTablePaginationOptions): UseTablePaginationReturn {
    // State persists in localStorage with moduleId key
    // Global page size preferences
    // Consistent pagination interface
}
```

#### **Enhanced Column Layout Dialog**
```tsx
// /src/components/shared/ColumnLayoutDialog.tsx - New full-featured column management
export function ColumnLayoutDialog({ 
    isOpen, 
    onClose, 
    columns, 
    onColumnsChange,
    onSave,
    onCancel 
}: ColumnLayoutDialogProps) {
    const [previewColumns, setPreviewColumns] = useState(columns);
    const [hasChanges, setHasChanges] = useState(false);

    // Live preview - update background table as user drags in dialog
    const handleColumnReorder = useCallback((sourceId: string, targetId: string) => {
        const newColumns = reorderColumns(previewColumns, sourceId, targetId);
        setPreviewColumns(newColumns);
        setHasChanges(true);
        
        // 🚨 CRITICAL: Live preview on background table
        onColumnsChange(newColumns); // Background table updates immediately
    }, [previewColumns, onColumnsChange]);

    const handleSave = () => {
        onSave(previewColumns);
        setHasChanges(false);
        onClose();
    };

    const handleCancel = () => {
        if (hasChanges) {
            // Revert background table to original state
            onColumnsChange(columns);
        }
        onCancel();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Manage Columns</DialogTitle>
                </DialogHeader>
                
                {/* Search/Filter columns */}
                <div className="space-y-4">
                    <Input placeholder="Search columns..." />
                    
                    {/* Bulk actions */}
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Select All</Button>
                        <Button variant="outline" size="sm">Deselect All</Button>
                        <Button variant="outline" size="sm">Reset to Default</Button>
                    </div>
                    
                    {/* Drag-and-drop column list with live preview */}
                    <DndContext onDragEnd={handleColumnReorder}>
                        <SortableContext items={previewColumns.map(c => c.id)}>
                            {previewColumns.map(column => (
                                <ColumnItem 
                                    key={column.id} 
                                    column={column}
                                    onToggleVisibility={(visible) => 
                                        handleColumnVisibilityChange(column.id, visible)
                                    }
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
                
                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!hasChanges}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
```

#### **Fixed Keepa Graph Time Range Functionality**
```tsx
// /src/components/shared/charts/SimpleKeepaGraph.tsx - Fixed time range button functionality
const filterDataByTimeRange = useCallback((days: number) => {
    setSelectedDays(days);
    
    // 🚨 FIX: Properly filter the displayed data based on selected time period
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const filteredData = allData.filter(dataPoint => 
        new Date(dataPoint.date) >= cutoffDate
    );
    
    setDisplayedData(filteredData); // Actually update what's shown in the graph
}, [allData]);
```

### **Existing Shared Infrastructure (Updated)**

#### **Single Column Configuration Interface**
```tsx
// /src/types/components/table.types.ts
export interface StandardColumnConfig {
    id: string;
    label: string;
    visible: boolean;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    order: number;
    render?: (value: any, item: any) => React.ReactNode;
    getValue?: (item: any) => any;
}
```

#### **Single Layout Manager Hook**
```tsx
// All tables use useGlobalLayoutManager
const { columns, updateColumnWidth, updateColumnVisibility, updateColumnOrder } = 
    useGlobalLayoutManager({ defaultColumns, moduleId });
```

#### **Single Filter System**
```tsx
// /src/components/shared/Filters/UnifiedFilterDropdown.tsx
// Replaces all table-specific filter components
<UnifiedFilterDropdown
    filters={filterDescriptors}
    activeFilters={activeFilters}
    onFilterChange={onFilterChange}
    onClearFilter={onClearFilter}
    onClearAllFilters={onClearAllFilters}
/>
```

#### **Shared Cell Components**
```tsx
// All tables use the same standardized cell components
<IdentifierCell value={asin} type="ASIN" />
<PriceCell value={price} currency="USD" />
<StatusBadge status={status} variant="success" />
<ProductImageCell imageUrl={imageUrl} title={title} />
```

### **Files to be Deleted**
- ❌ `/src/hooks/useSimpleColumnManager.ts` (224 lines - unused)
- ❌ `/src/components/shared/Table/StandardTable.tsx` (464 lines - legacy)
- ❌ `/src/components/shared/Table/StandardTableHeader.tsx` (123 lines - legacy)
- ❌ `/src/components/shared/Table/StandardTableRow.tsx` (134 lines - legacy)
- ❌ `/src/components/shared/Table/StandardTableSkeleton.tsx` (136 lines - legacy)
- ❌ `/src/components/features/amazon/orders-table/components/UnifiedOrdersFilters.tsx`
- ❌ `/src/components/features/amazon/reimbursements-table/components/UnifiedReimbursementsFilters.tsx`
- ❌ `/src/components/features/amazon/returns-table/components/UnifiedReturnsFilters.tsx`
- ❌ `/src/components/features/amazon/removal-orders-table/components/UnifiedRemovalOrdersFilters.tsx`

### **Key Principles Enforced**
1. **Single Method Consistency** - All tables follow the exact same implementation pattern
2. **Business Logic Only Differences** - Only context menus, row selection, and Keepa requirements differ
3. **Shared Infrastructure** - Layout management, filtering, cell rendering, styling all identical
4. **No Code Duplication** - All similar functionality uses shared components
5. **Proper Integration** - Column drag-and-drop, state persistence, and real-time updates work consistently