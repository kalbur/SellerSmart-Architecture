# PRD: Enhanced RivalRadar Discovery Component

**PRD ID:** PRD_20250605_1320_rivalradar_discovery_enhancement  
**Created:** 2025-06-05  
**Priority:** High  
**Epic:** RivalRadar UI Enhancement  
**Status:** Planning Phase  

## Problem Statement

The current RivalRadar discovery section lacks visual polish and consistency with the rest of the SellerSmart webapp. Users expect a cohesive experience that matches the detail view's sophistication, including comprehensive graphs, consistent styling, and streamlined actions. The discovery results need to provide at-a-glance insights without requiring navigation to separate detail views.

## User Needs

- **At-a-glance competitor analysis** with key metrics and trends visible immediately
- **Consistent visual experience** matching the polished SellerSmart design system
- **Streamlined rival management** with add/remove actions directly in discovery cards
- **Advanced filtering options** including excluding already monitored rivals
- **Rich data visualization** showing performance trends and historical data
- **Efficient workflow** for discovering and monitoring new competitors
- **Integrated brand actions** with BrandScan and BrandWatch task creation directly from discovery cards

## Codebase Analysis

### **Existing Component Architecture**
- **RivalDetailView**: `/Users/kal/GitHub/SellerSmart-Web/src/components/features/rivalradar/RivalDetailView.tsx`
- **RivalDiscovery**: `/Users/kal/GitHub/SellerSmart-Web/src/components/features/rivalradar/RivalDiscovery.tsx`
- **RivalGrowthChart**: `/Users/kal/GitHub/SellerSmart-Web/src/components/features/rivalradar/RivalGrowthChart.tsx`
- **RadarSettings**: `/Users/kal/GitHub/SellerSmart-Web/src/components/features/rivalradar/RadarSettings.tsx`
- **BrandTaskDialog**: `/Users/kal/GitHub/SellerSmart-Web/src/components/shared/dialogs/BrandTaskDialog.tsx`

### **Design System Patterns Identified**
- **Card Layout**: `overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm`
- **Badge System**: Color-coded status indicators with consistent styling
- **Typography**: `text-2xl font-semibold` for titles, `text-sm text-muted-foreground` for labels
- **Button Patterns**: Primary/secondary variants with loading states
- **Chart Library**: Recharts v2.10.4 with multi-line ComposedChart support

### **Multi-Line Chart Implementation Reference**
- **Location**: `/Users/kal/GitHub/SellerSmart-Web/src/components/shared/charts/SalesChart.tsx`
- **Pattern**: ComposedChart with multiple Y-axes and data series
- **Styling**: Solid lines for primary data, dotted lines (`strokeDasharray="5 5"`) for comparisons

### **Filter Component Patterns**
- **UnifiedFilterDropdown**: `/Users/kal/GitHub/SellerSmart-Web/src/components/shared/Filters/UnifiedFilterDropdown.tsx`
- **Existing Filters**: VAT registration and fulfillment type toggles in RadarSettings
- **Style Pattern**: `border-primary bg-primary/5 hover:bg-primary/10` for active states

### **Brand Action Integration Patterns**
- **BrandTaskDialog**: Unified dialog handling both BrandScan and BrandWatch actions
- **Event-Driven**: Triggered via `"open-brand-dialog"` custom event
- **API Endpoints**: `/api/brandscan/tasks` and `/api/brandwatch/watches`
- **Brand Display**: Clickable brand cards with hover effects and visual feedback
- **Logo Integration**: `/api/brands/logo/{brand-name}` with fallback support

## Technical Requirements

### **Enhanced Discovery Card Component (EnhancedDiscoveryCard)**

#### **Layout Structure**
```typescript
interface EnhancedDiscoveryCardProps {
  rival: SearchResult;
  isMonitored: boolean;
  onToggleMonitoring: (rivalId: string, action: 'add' | 'remove') => void;
  marketplace?: string; // Current marketplace for brand actions
}
```

#### **Left Section - Competitor Info (60% width)**
- **Header Row**:
  - Country flag icon with marketplace domain
  - Seller name (text-lg font-semibold)
  - Monitoring status badge (green "Monitored" or blue "Add to Radar" button)
- **Statistics Grid (2x3)**:
  - Total Listings, Feedback Rating, Feedback Count
  - Monthly Orders (estimated), VAT Status, Selling Since
- **Top Brands Section**:
  - Horizontal scrollable brand tags (max 5 visible)
  - Each brand clickable to trigger BrandTaskDialog (BrandScan or BrandWatch selection)
  - Hover effects with visual feedback (following RivalDetailView patterns)
  - Brand logos with fallback to styled text initials
  - "View All" link showing total count
- **Top Categories Section**:
  - Icon-based category chips (max 4 visible)
  - Category names with product counts

#### **Right Section - Performance Graphs (40% width)**
- **Multi-Line Chart Container** (height: 200px):
  - Listings trend (solid blue line)
  - Reviews count (solid green line) 
  - Feedback score (dotted orange line, right Y-axis)
- **Chart Toolbar**:
  - Time period selector (30D, 90D, 180D, 1Y)
  - Toggle buttons for each data series
- **Quick Stats Bar**:
  - Latest values for each metric
  - Trend indicators (up/down arrows with percentages)

### **Enhanced Discovery Settings Filter**

#### **New Filter Option**
Add to existing VAT/Fulfillment filter section in RadarSettings:

```typescript
// Add to RadarSettings.tsx
<Button
  variant="outline"
  onClick={() => setExcludeWatched(!excludeWatched)}
  className={cn(
    "h-auto w-full justify-between p-3",
    excludeWatched && "border-primary bg-primary/5 hover:bg-primary/10"
  )}
>
  <div className="flex flex-col items-start text-left">
    <span className="text-sm font-medium">Exclude Watched Rivals</span>
    <span className="text-xs text-muted-foreground">
      Hide competitors already being monitored
    </span>
  </div>
  <div className={cn(
    "flex h-5 w-5 items-center justify-center rounded-full border-2",
    excludeWatched ? "border-primary bg-primary" : "border-input bg-background"
  )}>
    {excludeWatched && <Check className="h-3 w-3 text-primary-foreground" />}
  </div>
</Button>
```

### **Data Structure Enhancements**

#### **Extended SearchResult Interface**
```typescript
interface EnhancedSearchResult extends SearchResult {
  // Historical performance data
  performanceHistory: {
    listings: Array<[string, number]>;
    reviews: Array<[string, number]>;
    feedbackScore: Array<[string, number]>;
  };
  
  // Monitoring status
  isCurrentlyMonitored: boolean;
  monitoredSince?: string;
  
  // Enhanced brand data
  topBrands: Array<{
    name: string;
    productCount: number;
    logo?: string;
    canCreateScan: boolean;
    canCreateWatch: boolean;
  }>;
  
  // Enhanced category data
  topCategories: Array<{
    name: string;
    productCount: number;
    icon?: string;
    categoryId?: number;
  }>;
}
```

#### **Performance Chart Data Processing**
```typescript
interface ChartDataPoint {
  date: string;
  listings: number;
  reviews: number;
  feedbackScore: number;
}

// Transform historical data for Recharts
const processChartData = (rival: EnhancedSearchResult): ChartDataPoint[] => {
  // Merge and align timestamp arrays
  // Handle missing data points with interpolation
  // Format dates for display
};
```

### **Component Specifications**

#### **EnhancedDiscoveryCard.tsx**
```typescript
// Component implementation
const EnhancedDiscoveryCard: React.FC<EnhancedDiscoveryCardProps> = ({
  rival,
  isMonitored,
  onToggleMonitoring,
  marketplace = 'uk'
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('90D');
  const [visibleSeries, setVisibleSeries] = useState({
    listings: true,
    reviews: true,
    feedbackScore: true
  });

  // Brand action handler using existing BrandTaskDialog event system
  const handleBrandClick = (brandName: string) => {
    window.dispatchEvent(new CustomEvent("open-brand-dialog", { 
      detail: { 
        brand: brandName, 
        marketplace: marketplace 
      } 
    }));
  };

  return (
    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-colors">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <LeftSection 
            rival={rival}
            isMonitored={isMonitored}
            onToggleMonitoring={onToggleMonitoring}
            onBrandClick={handleBrandClick}
          />
          <RightSection 
            rival={rival}
            selectedTimeRange={selectedTimeRange}
            visibleSeries={visibleSeries}
            onTimeRangeChange={setSelectedTimeRange}
            onSeriesToggle={setVisibleSeries}
          />
        </div>
      </CardContent>
    </Card>
  );
};
```

#### **PerformanceChart.tsx** (New Component)
```typescript
const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  timeRange,
  visibleSeries,
  height = 200
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="date" 
          interval="preserveStartEnd"
          tick={{ fontSize: 12 }}
        />
        <YAxis yAxisId="count" />
        <YAxis yAxisId="score" orientation="right" domain={[80, 100]} />
        
        <Tooltip content={<CustomTooltip />} />
        
        {visibleSeries.listings && (
          <Line 
            yAxisId="count"
            dataKey="listings" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Listings"
          />
        )}
        
        {visibleSeries.reviews && (
          <Line 
            yAxisId="count"
            dataKey="reviews" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Reviews"
          />
        )}
        
        {visibleSeries.feedbackScore && (
          <Line 
            yAxisId="score"
            dataKey="feedbackScore" 
            stroke="#f59e0b" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Feedback Score"
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
```

## Implementation Checklist

### **Phase 1: Component Structure** ✅ Must Have
- [ ] Create `EnhancedDiscoveryCard` component with left/right layout
- [ ] Implement competitor info section with statistics grid
- [ ] Add brand and category display sections
- [ ] Create monitoring status toggle button

### **Phase 2: Data Visualization** ✅ Must Have  
- [ ] Implement `PerformanceChart` component using Recharts
- [ ] Add multi-line chart with configurable data series
- [ ] Implement time range selector (30D, 90D, 180D, 1Y)
- [ ] Add chart series toggle functionality
- [ ] Create custom tooltip component

### **Phase 3: Enhanced Filtering** ✅ Must Have
- [ ] Add "Exclude Watched Rivals" toggle to RadarSettings
- [ ] Implement filtering logic in discovery results
- [ ] Update search/filter state management
- [ ] Add filter persistence to user preferences

### **Phase 4: Brand Action Integration** ✅ Must Have
- [ ] Implement clickable brand tags in discovery cards
- [ ] Integrate with existing BrandTaskDialog event system
- [ ] Add hover effects and visual feedback for brand interactions
- [ ] Include brand logos with fallback support
- [ ] Ensure marketplace context is passed to brand actions

### **Phase 5: Interactive Features** ✅ Must Have
- [ ] Add add/remove rival functionality directly in cards
- [ ] Implement loading states for all async actions
- [ ] Add error handling and user feedback
- [ ] Test BrandScan and BrandWatch task creation from discovery cards

### **Phase 6: Integration & Polish** ✅ Must Have
- [ ] Replace existing discovery card component
- [ ] Update RivalDiscovery to use EnhancedDiscoveryCard
- [ ] Ensure responsive design for mobile/tablet
- [ ] Add animation transitions matching SellerSmart patterns
- [ ] Implement proper skeleton loading states

### **Phase 7: Data Processing** ✅ Must Have
- [ ] Enhance backend API to include historical performance data
- [ ] Implement data transformation utilities
- [ ] Add monitoring status tracking in search results
- [ ] Optimize chart data processing for performance

### **Phase 8: Testing & Validation** ✅ Should Have
- [ ] Unit tests for new components
- [ ] Integration tests for monitoring actions and brand actions
- [ ] Visual regression tests for design consistency
- [ ] Performance testing for chart rendering
- [ ] User acceptance testing with discovery workflow
- [ ] Test BrandTaskDialog integration with discovery cards

## Success Criteria

### **Functional Requirements**
- Discovery cards display comprehensive competitor information at a glance
- Multi-line performance charts show historical trends effectively
- Add/remove rival actions work seamlessly without navigation
- Brand click actions successfully trigger BrandTaskDialog with both BrandScan and BrandWatch options
- Brand logos display correctly with fallback support
- Filter excludes already monitored rivals correctly
- Marketplace context is correctly passed to brand action dialogs

### **User Experience Requirements**
- Discovery section visual design matches SellerSmart detail views
- Chart interactions are intuitive and responsive
- Loading states provide clear feedback during async operations
- Component layout remains readable across different screen sizes
- Brand and category information is easily scannable
- Brand hover effects provide clear indication of interactivity
- BrandTaskDialog opens smoothly with appropriate brand and marketplace context

### **Performance Requirements**
- Discovery page loads within 2 seconds with 10+ rival cards
- Chart rendering completes within 500ms per card
- Filter application updates results within 1 second
- Component animations run smoothly at 60fps
- Memory usage remains stable during extended browsing

### **Design Consistency Requirements**
- Color scheme matches existing SellerSmart branding
- Typography hierarchy follows established patterns
- Button styles and interactions match detail view components
- Badge and status indicators use consistent visual language
- Spacing and layout proportions align with design system

## Technical Dependencies

### **Frontend Components**
- Recharts v2.10.4 for chart implementation
- Existing SellerSmart UI component library
- Lucide React icons for visual elements
- Tailwind CSS for styling consistency
- BrandTaskDialog component integration
- Brand logo API endpoint integration

### **Backend Integration**
- Enhanced RivalRadar API to include historical performance data
- MongoDB aggregation for monitoring status tracking
- SellerSmart-API Keepa integration for trend data
- User preference storage for filter settings

### **Type Definitions**
- Extended SearchResult interface with performance history
- Chart data processing type definitions
- Filter state management types
- Component prop interface definitions

---

**PRD CREATION COMPLETE**

**PRD ID:** PRD_20250605_1320_rivalradar_discovery_enhancement  
**Next Steps:** Review requirements and begin Phase 1 implementation  
**Estimated Timeline:** 2-3 weeks for complete implementation