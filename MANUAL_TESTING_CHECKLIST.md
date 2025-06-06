# Manual Integration Testing Checklist

## Quick Start Guide

1. **Start Development Server**
   ```bash
   cd /Users/kal/GitHub/SellerSmart-Web
   npm run dev
   ```

2. **Access Application**
   - Navigate to http://localhost:3000
   - Authenticate via Discord or Team Login
   - Navigate to main tables: Orders, Inventory, Returns, Reimbursements

## 🔧 Column Management Integration Tests

### Test A: Column Reordering
- [ ] **Orders Table**: Drag column headers left/right → Smooth reordering
- [ ] **Inventory Table**: Drag column headers left/right → Smooth reordering  
- [ ] **Returns Table**: Drag column headers left/right → Smooth reordering
- [ ] **Reimbursements Table**: Drag column headers left/right → Smooth reordering

### Test B: Column Layout Dialog
- [ ] **Open Dialog**: Click column settings button → Dialog opens
- [ ] **Live Preview**: Toggle column visibility → Table updates in real-time
- [ ] **Drag Reorder**: Drag columns in dialog → Preview updates
- [ ] **Save Changes**: Click Save → Changes persist in table
- [ ] **Cancel Changes**: Click Cancel → Original layout restored

### Test C: Column Resizing
- [ ] **Resize Columns**: Drag column borders → Smooth resizing
- [ ] **Auto-fit**: Check if columns auto-fit to content
- [ ] **Min/Max Limits**: Test column resize limits
- [ ] **Performance**: Resize multiple columns → No lag

## 🔍 Filter System Integration Tests

### Test D: Search Functionality
- [ ] **Orders**: Type in search box → Debounced search works
- [ ] **Inventory**: Type in search box → Results filter correctly
- [ ] **Returns**: Type in search box → Debounced search works
- [ ] **Reimbursements**: Type in search box → Results filter correctly

### Test E: Filter Combinations (Orders, Returns, Reimbursements)
- [ ] **Single Filter**: Apply one filter → Results update
- [ ] **Multiple Filters**: Apply 2+ filters → Combined logic works
- [ ] **Clear Single**: Remove one filter → Other filters remain
- [ ] **Clear All**: Clear all filters → Full data restored

### Test F: Filter Persistence
- [ ] **Navigate Away**: Apply filters → Navigate to different page
- [ ] **Navigate Back**: Return to table → Filters still applied
- [ ] **Refresh Browser**: F5 refresh → Check if filters persist (Expected: NO)

## 📄 Pagination Integration Tests

### Test G: Pagination Controls
- [ ] **Page Size**: Change from 20 to 50 → Data updates correctly
- [ ] **Next/Previous**: Navigate pages → Smooth transitions
- [ ] **Direct Page**: Click page numbers → Correct page loads
- [ ] **Edge Cases**: Test first/last page behavior

### Test H: Pagination with Sorting/Filtering
- [ ] **Sort + Pagination**: Sort column → Pagination resets to page 1
- [ ] **Filter + Pagination**: Apply filter → Total pages adjust
- [ ] **Combined**: Sort + filter + paginate → All work together

### Test I: Pagination Persistence
- [ ] **Page Size Persistence**: Change page size → Refresh → Check if persists (Expected: NO)
- [ ] **Current Page**: Navigate to page 3 → Refresh → Check if persists (Expected: NO)

## 📊 Keepa Graph Integration Tests

### Test J: Time Range Buttons  
- [ ] **7d Button**: Click → Graph shows last 7 days data
- [ ] **30d Button**: Click → Graph shows last 30 days data
- [ ] **90d Button**: Click → Graph shows last 90 days data
- [ ] **All Button**: Click → Graph shows all available data

### Test K: Graph Responsiveness
- [ ] **Button States**: Active button highlighted correctly
- [ ] **Data Loading**: Loading indicator during data fetch
- [ ] **Error Handling**: No data state displays properly
- [ ] **Performance**: Rapid button clicking → No lag/errors

## 🔌 API Integration Tests

### Test L: Error Handling
- [ ] **Network Issues**: Disable internet → Error states show
- [ ] **Loading States**: Check loading indicators during API calls
- [ ] **Retry Behavior**: Check if failed requests retry (Expected: NO)
- [ ] **Error Messages**: Verify user-friendly error messages

### Test M: Data Consistency
- [ ] **Real-time Updates**: Check if data updates from other sources
- [ ] **State Management**: Multiple table operations → Data consistency
- [ ] **Cache Behavior**: Navigate between tables → Data loading patterns

## 🎯 Performance Integration Tests

### Test N: Auto-fit Performance
- [ ] **Small Datasets**: Auto-fit calculation speed (< 1000 rows)
- [ ] **Medium Datasets**: Auto-fit calculation speed (1000-5000 rows)
- [ ] **Large Datasets**: Auto-fit calculation speed (5000+ rows) if available

### Test O: Interaction Performance
- [ ] **Drag & Drop**: Column reordering smoothness
- [ ] **Rapid Clicks**: Multiple rapid operations → No freezing
- [ ] **Memory Usage**: Long session → Check for memory leaks
- [ ] **Browser Performance**: Multiple tabs → Performance impact

## ♿ Accessibility Integration Tests

### Test P: Keyboard Navigation
- [ ] **Tab Navigation**: Tab through table → Logical order
- [ ] **Enter/Space**: Activate sortable columns with keyboard
- [ ] **Arrow Keys**: Navigate table cells with arrows
- [ ] **Escape Key**: Exit dialogs/dropdowns with Escape

### Test Q: Screen Reader Support
- [ ] **ARIA Labels**: Check table has proper ARIA labels
- [ ] **Announcements**: Sort changes announced to screen reader
- [ ] **Live Regions**: Status updates announced properly
- [ ] **Focus Management**: Focus moves logically through interface

## 📱 Responsive Integration Tests

### Test R: Different Screen Sizes
- [ ] **Desktop (1920px)**: All features work correctly
- [ ] **Laptop (1366px)**: Layout adapts properly
- [ ] **Tablet (768px)**: Touch interactions work
- [ ] **Mobile (375px)**: Essential features accessible

### Test S: Browser Compatibility (if possible)
- [ ] **Chrome**: All features work
- [ ] **Firefox**: All features work  
- [ ] **Safari**: All features work
- [ ] **Edge**: All features work

## 🚨 Critical Issues Checklist

### Immediate Blockers
- [ ] **TypeScript Errors**: Check if any compilation errors block functionality
- [ ] **Authentication**: Can successfully log in and access tables
- [ ] **Core Tables**: All main tables (Orders, Inventory, Returns, Reimbursements) load
- [ ] **Basic Operations**: Sort, search, paginate work on all tables

### Known Issues to Verify
- [ ] **State Persistence**: Confirm column layouts don't persist across refresh
- [ ] **Inventory Filters**: Confirm Inventory table missing filter system
- [ ] **API Retries**: Confirm failed API calls don't retry automatically
- [ ] **Virtual Scrolling**: Confirm large datasets may have performance issues

## 📊 Test Results Template

```markdown
## Test Session Results

**Date**: [DATE]
**Tester**: [NAME]  
**Browser**: [BROWSER + VERSION]
**Screen Size**: [RESOLUTION]

### Summary
- Total Tests: [ ] / [ ]
- Passed: [ ] 
- Failed: [ ]
- Blocked: [ ]

### Critical Issues Found
1. [ ] Issue description
2. [ ] Issue description  
3. [ ] Issue description

### Performance Notes
- Column Management: [EXCELLENT/GOOD/POOR]
- Filter System: [EXCELLENT/GOOD/POOR]
- Pagination: [EXCELLENT/GOOD/POOR]
- Keepa Graphs: [EXCELLENT/GOOD/POOR]

### Recommendations
1. [ ] Priority recommendation
2. [ ] Priority recommendation
3. [ ] Priority recommendation
```

## Quick Issues Resolution

### If Tests Fail
1. **Check Console**: Open browser dev tools → Look for errors
2. **Network Tab**: Check for failed API requests
3. **Clear Cache**: Hard refresh (Ctrl/Cmd + Shift + R)
4. **Restart Server**: Stop and restart the development server

### If Authentication Fails
1. **Check Environment**: Verify .env.local file exists
2. **Clear Session**: Clear browser cookies/localStorage
3. **Try Different Method**: Use Discord OR Team Login
4. **Check Network**: Verify internet connection stable

### If Performance Issues
1. **Monitor Memory**: Check browser task manager
2. **Profile Performance**: Use browser Performance tab
3. **Reduce Dataset**: Test with smaller data if possible
4. **Check CPU Usage**: Verify system not overloaded

---

**Note**: This checklist focuses on integration testing between standardized components. Individual component functionality should be tested separately.