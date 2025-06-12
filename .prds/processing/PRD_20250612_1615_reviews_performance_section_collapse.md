# PRD_20250612_1615_reviews_performance_section_collapse

## Problem Statement
The reviews page at `https://app.sellersmart.io/reviews` currently has a fixed performance section (feedback/stats area) at the top that takes up valuable screen space. Users need the ability to collapse this performance section with a centered arrow button at the bottom to maximize table visibility and improve their workflow efficiency.

## User Needs
- **Maximize table visibility**: Users want to see more review data rows without scrolling
- **Toggle performance section**: Quick access to show/hide performance metrics as needed
- **Maintain feedback functionality**: The existing feedback section should remain fully functional when visible
- **Intuitive UX**: Clear visual indicator (centered arrow) to collapse/expand the section
- **Persistent state**: Remember user's preference for collapsed/expanded state across sessions

## MCP Tools Used
- **Repomix**: Analyzed SellerSmart-Web codebase structure, identified Next.js 15.2.4 with React 19, Tailwind CSS, and shadcn/ui components
- **Task Analysis**: Examined existing collapsible patterns, UI components, and reviews page implementation

## Test Specifications (TDD)

### Test Scenarios

1. **Initial Render**
   - Given: User navigates to reviews page
   - When: Page loads for the first time
   - Then: Performance section is visible by default, collapse button shows down arrow

2. **Collapse Performance Section**
   - Given: Performance section is visible
   - When: User clicks the centered collapse arrow
   - Then: Performance section smoothly collapses, arrow rotates to up position, table gains additional vertical space

3. **Expand Performance Section**
   - Given: Performance section is collapsed
   - When: User clicks the centered expand arrow
   - Then: Performance section smoothly expands, arrow rotates to down position, displaying all performance metrics

4. **State Persistence**
   - Given: User has collapsed the performance section
   - When: User refreshes the page or navigates away and returns
   - Then: Performance section remains in collapsed state based on user's last action

5. **Responsive Behavior**
   - Given: User is on mobile or different screen sizes
   - When: Performance section is collapsed/expanded
   - Then: Animation and layout adjust appropriately for screen size

### Unit Tests Required
- [ ] Test `usePerformanceSectionCollapse` hook initialization with default state
- [ ] Test `usePerformanceSectionCollapse` hook toggle functionality
- [ ] Test localStorage persistence in custom hook
- [ ] Test `CollapsiblePerformanceSection` component renders correctly when expanded
- [ ] Test `CollapsiblePerformanceSection` component renders correctly when collapsed
- [ ] Test arrow icon rotation based on collapse state
- [ ] Test button click handler triggers state change
- [ ] Test accessibility attributes are correctly set
- [ ] Test component props validation with TypeScript

### Integration Tests Required
- [ ] Test reviews page renders with collapsible performance section
- [ ] Test performance section collapse/expand doesn't affect table functionality
- [ ] Test state persistence across page reloads
- [ ] Test performance section data fetching works in both states
- [ ] Test responsive layout adjustments during collapse/expand

### Component Tests Required (UI)
- [ ] Test `CollapsiblePerformanceSection` component renders `ReviewHistoryGraph` when expanded
- [ ] Test collapse button is always visible and centered
- [ ] Test smooth animation transitions during state changes
- [ ] Test keyboard navigation works for collapse button
- [ ] Test ARIA attributes for screen reader accessibility
- [ ] Test clicking outside doesn't affect collapse state
- [ ] Test performance section maintains functionality when expanded after collapse

### E2E Tests Required
- [ ] Test complete user flow: navigate to reviews → collapse section → verify table visibility → expand section → verify data intact
- [ ] Test state persistence across browser sessions
- [ ] Test collapse feature works across different browsers
- [ ] Test mobile responsive behavior for collapse functionality

### Coverage Targets
- Unit Test Coverage: 100%
- Integration Test Coverage: 100%
- Component Test Coverage: 100%
- Overall Coverage: 100%
- Exclusions: None expected for this feature

## Codebase Analysis

### Current Implementation
- **Reviews Page**: `/src/app/reviews/page.tsx` - Simple integration of `ReviewHistoryGraph` component
- **Performance Component**: `/src/components/features/amazon/ReviewHistoryGraph.tsx` - Complex card-based layout with stats and chart panels
- **Project Stack**: Next.js 15.2.4, React 19, TypeScript, Tailwind CSS, shadcn/ui, Radix UI primitives

### Existing Collapse Patterns
1. **Collapsible Component** (`/src/components/ui/collapsible.tsx`):
   - Simple Radix UI wrapper with minimal styling
   - Pattern: `<Collapsible><CollapsibleTrigger/><CollapsibleContent/></Collapsible>`

2. **ExpandableTableRow** (`/src/components/shared/Table/ExpandableTableRow.tsx`):
   - Uses ChevronRight with rotation animation (`isExpanded && "rotate-90"`)
   - Implements smooth transitions and state management

3. **Accordion Component** (`/src/components/ui/accordion.tsx`):
   - More complex multi-section support
   - ChevronDown rotation: `[&[data-state=open]>svg]:rotate-180`
   - Custom accordion animations with 200ms transitions

### Styling Patterns
- **Animations**: Custom tailwind animations `accordion-up/down` with 0.2s ease-out
- **Icons**: Lucide React icons (ChevronDown, ChevronUp, ChevronRight)
- **Transitions**: Consistent `transition-all duration-300` pattern
- **Responsive**: `lg:flex-row` and breakpoint-based layouts

## Technical Requirements

### New Components to Create
1. **`CollapsiblePerformanceSection`** component
   - Wraps existing `ReviewHistoryGraph` component
   - Implements collapsible functionality using Radix UI primitives
   - Includes centered collapse/expand button with icon rotation
   - Handles state management and persistence

### Custom Hook
1. **`usePerformanceSectionCollapse`** hook
   - Manages collapse/expand state using `useState`
   - Implements localStorage persistence for user preference
   - Returns: `{ isCollapsed, toggleCollapse }`

### State Management
- Local component state with `useState` for immediate UI response
- localStorage persistence with key: `'reviews-performance-section-collapsed'`
- Default state: expanded (false for isCollapsed)

### Styling Requirements
- Centered collapse button positioned at bottom of performance section
- ChevronDown/ChevronUp icon rotation animation
- Smooth expand/collapse transition using `animate-accordion-up/down`
- Consistent with existing component styling patterns
- Responsive design maintaining mobile compatibility

### Files to Modify
1. **`/src/app/reviews/page.tsx`**: Replace `ReviewHistoryGraph` with `CollapsiblePerformanceSection`
2. **Create `/src/components/features/amazon/CollapsiblePerformanceSection.tsx`**: New collapsible wrapper
3. **Create `/src/hooks/usePerformanceSectionCollapse.ts`**: Custom state management hook

### Testing Structure
- Component tests: `src/components/features/amazon/__tests__/CollapsiblePerformanceSection.test.tsx`
- Hook tests: `src/hooks/__tests__/usePerformanceSectionCollapse.test.ts`
- Page integration tests: `src/app/reviews/__tests__/page.test.tsx`

## Implementation Checklist (TDD Order)

### Phase 1: Test Development
- [ ] Create `src/hooks/__tests__/usePerformanceSectionCollapse.test.ts`
  - [ ] Test hook initialization with localStorage value
  - [ ] Test hook initialization with default value (no localStorage)
  - [ ] Test toggle functionality updates state correctly
  - [ ] Test localStorage persistence on state change
- [ ] Create `src/components/features/amazon/__tests__/CollapsiblePerformanceSection.test.tsx`
  - [ ] Test component renders expanded by default
  - [ ] Test component renders ReviewHistoryGraph when expanded
  - [ ] Test collapse button renders with correct icon
  - [ ] Test button click triggers toggle
  - [ ] Test component renders collapsed state correctly
  - [ ] Test icon rotation animation
  - [ ] Test accessibility attributes (ARIA labels, keyboard navigation)
- [ ] Create `src/app/reviews/__tests__/page.test.tsx`
  - [ ] Test page renders with CollapsiblePerformanceSection instead of ReviewHistoryGraph
  - [ ] Test page layout adjusts when performance section is collapsed
- [ ] Verify all tests fail correctly (red state)
- [ ] Document test cases with clear descriptions

### Phase 2: Implementation
- [ ] Create `src/hooks/usePerformanceSectionCollapse.ts`
  - [ ] Implement useState for collapse state management
  - [ ] Implement localStorage read on initialization
  - [ ] Implement localStorage write on state change
  - [ ] Implement toggle function
  - [ ] Pass unit tests
- [ ] Create `src/components/features/amazon/CollapsiblePerformanceSection.tsx`
  - [ ] Implement Collapsible wrapper around ReviewHistoryGraph
  - [ ] Add centered collapse/expand button
  - [ ] Implement ChevronDown/ChevronUp icon with rotation
  - [ ] Add smooth accordion animations
  - [ ] Integrate custom hook for state management
  - [ ] Add proper TypeScript types and interfaces
  - [ ] Pass component tests
- [ ] Modify `src/app/reviews/page.tsx`
  - [ ] Replace ReviewHistoryGraph import with CollapsiblePerformanceSection
  - [ ] Update component usage in JSX
  - [ ] Pass integration tests
- [ ] Refactor code while keeping all tests green
  - [ ] Optimize component performance
  - [ ] Clean up unused imports
  - [ ] Ensure consistent coding style

### Phase 3: Quality Assurance
- [ ] Run test coverage report: `npm run test:coverage`
- [ ] Achieve 100% coverage for new components and hook
- [ ] Pass all linting checks: `npm run lint`
- [ ] Pass all type checks: `npm run type-check`
- [ ] Test manual functionality in development environment
- [ ] Verify responsive design on different screen sizes
- [ ] Test accessibility with screen readers
- [ ] Verify state persistence across browser sessions

### Phase 4: Completion
- [ ] All tests passing with 100% coverage
- [ ] No regression in existing functionality
- [ ] Performance benchmarks maintained (no impact on page load)
- [ ] Code reviewed by team
- [ ] Feature branch ready for merge
- [ ] PRD moved to completed folder

## Success Criteria
- [ ] Users can collapse performance section with centered arrow button
- [ ] Performance section smoothly animates expand/collapse with 200ms transition
- [ ] Arrow icon rotates correctly (down when expanded, up when collapsed)
- [ ] User preference persists across browser sessions via localStorage
- [ ] Table gains additional vertical space when performance section is collapsed
- [ ] No impact on existing performance section functionality when expanded
- [ ] 100% test coverage achieved for all new components and hooks
- [ ] No regression in existing tests
- [ ] Accessibility standards maintained (ARIA labels, keyboard navigation)
- [ ] Responsive design works correctly on mobile and desktop
- [ ] Performance benchmarks maintained (no significant impact on page load time)