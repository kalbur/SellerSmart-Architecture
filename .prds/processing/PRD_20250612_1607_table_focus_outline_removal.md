# PRD_20250612_1607_table_focus_outline_removal

## Problem Statement
The SellerSmart-Web application displays unwanted highlight/outline effects on table elements when users click on rows, headers, or cells. These visual artifacts appear as blue outlines/rings around table elements and detract from the user experience by creating visual noise. The effects are caused by **browser default focus styles** applied to elements with `tabIndex` attributes, combined with **Radix UI ContextMenu focus management**, not TailwindCSS focus rings as initially suspected.

## User Needs
- **Clean Visual Experience**: Users need tables without distracting highlight/outline effects when interacting with table elements
- **Consistent UI Behavior**: Table interactions should be consistent across all tables in the application
- **Accessibility Compliance**: Focus indicators should be subtle and purposeful, not visually overwhelming
- **Professional Appearance**: Tables should maintain a polished, enterprise-grade appearance without visual artifacts

## MCP Tools Used
- **Repomix**: Analyzed SellerSmart-Web codebase structure and identified table component hierarchy
  - Found base table components in `/src/components/ui/table.tsx`
  - Discovered TanStack Table wrapper implementation in `/src/components/shared/Table/TanStackTableWrapper.tsx`
  - Identified global CSS patterns in `/src/app/globals.css`

## Test Specifications (TDD)

### Test Scenarios

1. **Table Header Click Focus Removal**
   - Given: A table with sortable headers is rendered
   - When: User clicks on any table header element
   - Then: No visible focus ring or outline should appear around the header

2. **Table Row Click Focus Removal**
   - Given: A table with clickable rows is rendered
   - When: User clicks on any table row
   - Then: No visible focus ring or outline should appear around the row

3. **Table Cell Focus Removal**
   - Given: A table with individual cell focus capability
   - When: User clicks or tabs to any table cell
   - Then: No visible focus ring or outline should appear around the cell

4. **Keyboard Navigation Accessibility**
   - Given: A user navigating with keyboard only
   - When: User tabs through table elements
   - Then: Focus indicators should be subtle and not create visual noise

5. **Focus State Consistency**
   - Given: Multiple tables across different pages (Amazon Orders, BrandScan, RivalRadar, etc.)
   - When: User interacts with any table
   - Then: Focus behavior should be consistent across all tables

### Unit Tests Required
- [ ] Test TableRow component renders without focus ring classes
- [ ] Test TableHead component renders without focus ring classes  
- [ ] Test TableCell component renders without focus ring classes
- [ ] Test focus-within and focus-visible classes are properly overridden
- [ ] Test accessibility attributes remain intact after focus ring removal
- [ ] Test keyboard navigation still functions correctly
- [ ] Test component props are preserved during focus ring removal

### Integration Tests Required
- [ ] Test TanStackTableWrapper renders without focus artifacts
- [ ] Test StandardTable component focus behavior
- [ ] Test table context menu interaction without focus rings
- [ ] Test column sorting interaction without focus artifacts
- [ ] Test column resizing interaction without focus rings
- [ ] Test row selection interaction without focus artifacts

### Component Tests Required (UI)
- [ ] Test Table component renders correctly without focus styles
- [ ] Test user click interactions don't trigger focus rings
- [ ] Test keyboard navigation maintains usability
- [ ] Test hover states work correctly after focus ring removal
- [ ] Test existing table functionality is preserved
- [ ] Test screen reader compatibility after focus changes
- [ ] Test focus trap behavior in modal tables

### E2E Tests Required
- [ ] Test table interaction flow on Amazon Orders page
- [ ] Test table interaction flow on BrandScan results
- [ ] Test table interaction flow on RivalRadar dashboard
- [ ] Test table interaction flow on Returns/Reimbursements pages
- [ ] Test keyboard-only navigation through entire table interface
- [ ] Test visual regression: compare before/after screenshots

### Coverage Targets
- Unit Test Coverage: 100%
- Integration Test Coverage: 100%
- Component Test Coverage: 100%
- E2E Test Coverage: 100%
- Overall Coverage: 100%
- Exclusions: None - all focus-related code must be tested

## Codebase Analysis

### Identified Outline/Focus Sources (CORRECTED)

#### Root Cause: Browser Default Focus Styles + Accessibility Attributes

**Primary Issues:**
- **Line 92**: `TableHead` - `tabIndex={0}` makes headers focusable, triggering browser default focus outlines
- **Line 114**: `TableCell` - `tabIndex={-1}` makes cells programmatically focusable, showing focus on click
- **Line 157**: `TanStackTableWrapper` - Additional `tabIndex={0}` on interactive elements

#### Radix UI ContextMenu Focus Management
- **ContextMenuTrigger** wrapping TableHead elements (lines 125-294)
- **UnifiedTableContextMenu** wrapping TableRow elements (lines 740-799)
- **Radix UI accessibility** adds additional focus management and data attributes

#### Technology Stack Context
- **Framework**: Next.js 15.2.4 with React 19.0.0
- **Styling**: TailwindCSS with Radix UI components
- **Table Library**: TanStack Table v8.21.3
- **Focus Management**: Built-in React focus-within and focus-visible utilities

#### Component Hierarchy
```
Table (base wrapper)
├── TableHeader
│   └── TableHead (with focus-visible rings)
├── TableBody  
│   └── TableRow (with focus-within rings)
│       └── TableCell (with focus-visible rings)
└── TableFooter
```

#### Existing Focus Patterns
- **Ring Style**: 2px primary color ring with 2px offset
- **Trigger**: `focus-within` (for containers) and `focus-visible` (for elements)
- **Color**: Uses CSS variable `--primary` (blue theme color)

### Current Implementation Details

#### Browser Default Focus Behavior on tabIndex Elements
```tsx
// TableHead (Line 84-95) - tabIndex={0} triggers browser focus outline
<th
    ref={ref}
    role="columnheader"
    className={cn(
        "h-12 px-4 text-center align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", // ← Current override attempt
        className
    )}
    tabIndex={0} // ← PROBLEM: Browser applies default :focus styles
    {...props}
/>

// TableCell (Line 105-116) - tabIndex={-1} can show focus on click  
<td
    ref={ref}
    role="cell"
    className={cn(
        "p-4 text-center align-middle [&:has([role=checkbox])]:pr-0",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", // ← Override attempt
        className
    )}
    tabIndex={-1} // ← PROBLEM: Programmatically focusable, can trigger browser outlines
    {...props}
/>
```

#### Radix UI ContextMenu Focus Interference
The ContextMenuTrigger and ContextMenu components add their own focus management that may conflict with custom focus styles.

#### Affected Table Implementations
- **Amazon Tables**: inventory, orders, returns, reimbursements, removal-orders
- **BrandScan Tables**: product analysis results
- **RivalRadar Tables**: competitor tracking data
- **Wholesale Tables**: sourcing data
- **Standard Tables**: Generic table implementations

## Technical Requirements

### Primary Modifications Required

#### 1. Global CSS Override for Browser Default Focus Styles (`/src/app/globals.css`)
- **Add comprehensive focus style resets** for table elements with tabIndex attributes
- **Override browser default outlines** while preserving accessibility
- **Target specific selectors** for table elements to avoid affecting other components
- **Preserve existing TailwindCSS focus-visible styles** but make them more subtle

#### 2. Base Table Component Analysis (`/src/components/ui/table.tsx`)
- **Keep tabIndex attributes** for accessibility compliance (DO NOT REMOVE)
- **Keep ARIA roles and attributes** (role="columnheader", role="cell", etc.)
- **Evaluate current focus-visible classes** - may need adjustment but not removal
- **Ensure compatibility** with global CSS overrides

#### 2. Alternative Focus Indicators (Optional)
- **Subtle border highlight** instead of ring (if needed for accessibility)
- **Consistent with existing hover states** (muted background changes)
- **Minimal visual impact** compared to current ring implementation

#### 3. Global CSS Adjustments (if needed)
- **Override any Radix UI focus rings** that might conflict
- **Ensure focus behavior consistency** across all table instances

### Accessibility Considerations
- **Maintain keyboard navigation** functionality
- **Preserve screen reader compatibility** 
- **Keep focus management** for keyboard users
- **Ensure WCAG compliance** without visual ring artifacts

### Code Quality Requirements
- **Preserve all existing functionality** (sorting, resizing, selection, etc.)
- **Maintain TypeScript types** and prop interfaces
- **Keep component API compatibility** for consuming components
- **Follow existing code patterns** and naming conventions

## Implementation Checklist (TDD Order)

### Phase 1: Test Development
- [ ] Write unit test for TableRow component without focus rings
- [ ] Write unit test for TableHead component without focus rings  
- [ ] Write unit test for TableCell component without focus rings
- [ ] Write integration test for TanStackTableWrapper focus behavior
- [ ] Write component test for table interaction without focus artifacts
- [ ] Write E2E test for table focus behavior across key pages
- [ ] Verify all tests fail correctly (confirming focus rings currently exist)
- [ ] Document all test cases with clear assertions

### Phase 2: Implementation
- [ ] Add global CSS overrides in `/src/app/globals.css` to suppress browser default focus outlines on table elements
- [ ] Target table elements with `[role="columnheader"][tabindex]` and `[role="cell"][tabindex]` selectors
- [ ] Add Radix UI focus style overrides for `[data-radix-collection-item]` and related selectors
- [ ] Preserve all existing `tabIndex`, ARIA roles, and accessibility attributes (DO NOT REMOVE)
- [ ] Test that existing TailwindCSS focus-visible styles work correctly with global overrides
- [ ] Verify all table functionality still works (sorting, selection, resizing, context menus)
- [ ] Ensure keyboard navigation remains fully functional

### Phase 3: Quality Assurance  
- [ ] Run comprehensive test suite with 100% coverage
- [ ] Test on all major table implementations (Amazon, BrandScan, RivalRadar)
- [ ] Perform visual regression testing with screenshots
- [ ] Test keyboard-only navigation flows
- [ ] Validate screen reader compatibility
- [ ] Run accessibility audit (axe-core or similar)
- [ ] Verify no TypeScript errors or warnings

### Phase 4: Completion
- [ ] All unit tests passing
- [ ] All integration tests passing  
- [ ] All component tests passing
- [ ] All E2E tests passing
- [ ] 100% test coverage achieved
- [ ] Visual regression tests confirm focus rings removed
- [ ] Accessibility compliance verified
- [ ] Performance impact assessed (should be positive)
- [ ] Documentation updated if needed
- [ ] PRD moved to completed folder

### Branch Management
- **Current Branch**: `fix/table-pagination-standardization` (continue using this branch)
- **Target Branch**: main (for eventual PR)

## Success Criteria
- [ ] **Visual**: No unwanted browser default focus outlines appear when clicking table elements
- [ ] **Functional**: All existing table functionality preserved (sorting, selection, resizing, context menus, etc.)
- [ ] **Accessibility**: All `tabIndex` attributes and ARIA roles preserved - keyboard navigation and screen reader support fully maintained
- [ ] **Focus Management**: TailwindCSS focus-visible styles work correctly, browser defaults are suppressed
- [ ] **Radix UI Compatibility**: ContextMenu and other Radix UI components work without visual artifacts
- [ ] **Consistency**: Behavior is consistent across all table implementations (Amazon, BrandScan, RivalRadar, etc.)
- [ ] **Test Coverage**: 100% test coverage with all tests passing
- [ ] **Cross-browser**: Works correctly in Chrome, Firefox, Safari, Edge
- [ ] **Responsive**: Focus behavior consistent across desktop and mobile viewports

## Risk Assessment
- **Low Risk**: Global CSS overrides with comprehensive test coverage, no component logic changes
- **Accessibility Risk**: **Minimal** - all tabIndex attributes and ARIA roles preserved, only visual styling changed
- **Regression Risk**: Mitigated by comprehensive test coverage and preserving all existing functionality
- **Browser Compatibility**: Standard CSS selectors with broad support across all modern browsers
- **Radix UI Risk**: **Low** - targeting specific selectors to avoid conflicts with Radix UI component behavior

## Testing Framework Selection
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Jest + React Testing Library + MSW (if API mocking needed)
- **Component Tests**: React Testing Library + Jest DOM
- **E2E Tests**: Playwright (already in use in project)
- **Visual Regression**: Playwright screenshots or Percy (if available)
- **Accessibility Tests**: @axe-core/react + jest-axe