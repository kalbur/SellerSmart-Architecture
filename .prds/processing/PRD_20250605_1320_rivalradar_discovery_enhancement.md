# PRD: Enhanced RivalRadar Discovery Component

**PRD ID:** PRD_20250605_1320_rivalradar_discovery_enhancement  
**Created:** 2025-06-05  
**Priority:** High  
**Epic:** RivalRadar UI Enhancement  
**Status:** Planning Phase  

## Problem Statement

The current RivalRadar discovery section lacks visual polish and consistency with the rest of the SellerSmart webapp. Additionally, both the discovery and detail views need enhanced data visualization with multi-line charts for better at-a-glance insights. Users expect a cohesive experience with comprehensive graphs, consistent styling, and streamlined actions without requiring navigation between views.

## User Needs

- **At-a-glance competitor analysis** with key metrics and trends visible immediately
- **Consistent visual experience** matching the polished SellerSmart design system
- **Streamlined rival management** with add/remove actions directly in discovery cards
- **Advanced filtering options** including excluding already monitored rivals
- **Rich data visualization** with multi-line charts showing all performance trends simultaneously
- **Consistent chart experience** between discovery and detail views
- **Efficient workflow** for discovering and monitoring new competitors
- **Integrated brand actions** with BrandScan and BrandWatch task creation directly from discovery cards
- **Enhanced tooltips** showing comprehensive data points on hover
- **Self-contained discovery cards** with all essential information - no need to navigate to detail views

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

#### **Layout Structure (Following RivalDetailView Pattern)**
```typescript
interface EnhancedDiscoveryCardProps {
  rival: SearchResult;
  isMonitored: boolean;
  onToggleMonitoring: (rivalId: string, action: 'add' | 'remove') => void;
  marketplace?: string; // Current marketplace for brand actions
}
```

#### **Card Header**
- **Seller Info Row**:
  - Country flag icon (10x10) with seller name (text-xl font-semibold) 
  - Domain subtitle (text-sm text-muted-foreground)
  - Action button: "Add to Radar" (blue) or "Remove from Radar" (destructive variant)

#### **Main Content Grid (lg:grid-cols-[250px,1fr] xl:grid-cols-[280px,1fr])**

**Left Sidebar - Statistics Card:**
- **Vertical Stats Layout** (matching RivalDetailView exactly):
  - Products count (text-2xl font-semibold)
  - Feedback Count (text-2xl font-semibold) 
  - Seller Rating with color-coded badge (97% [Excellent])
  - Est. Monthly Orders range (calculated from ratingsLast30Days)
  - VAT Status (Registered/Not Registered)
  - Selling Since (formatted date)

**Right Side - Enhanced Multi-Line Chart Card:**
- **Multi-Line Chart Container** (height: 300px - matching RivalDetailView):
  - Listings trend (solid blue line, left Y-axis)
  - Reviews count (solid green line, left Y-axis) 
  - Feedback score (dotted orange line, right Y-axis 80-100 domain)
  - Interactive tooltips showing all three metrics at each point
  - No tab navigation - all data visible simultaneously

#### **Full-Width Bottom Sections**
- **Top Brands Section** (matching RivalDetailView grid layout):
  - Grid layout (2-5 columns responsive)
  - Clickable brand cards with hover effects and search icon
  - Brand logos with fallback support
  - Product counts per brand
- **Top Categories Section** (matching RivalDetailView grid layout):
  - Grid layout with category icons and names
  - Product counts per category

### **Enhanced Discovery Results Filter**

#### **New Filter Option - Add to Results Filter Panel**
Add "Exclude Watched Rivals" toggle to the discovery results filter panel (where VAT and Fulfillment dropdowns are located):

```typescript
// Add to TaskFilterDropdown or create dedicated RivalRadarResultsFilter
{
  id: "exclude_watched",
  label: "Filter Options",
  type: "checkbox",
  icon: <Eye className="h-4 w-4" />,
  props: {
    options: [
      { 
        label: "Exclude already watched rivals", 
        value: "exclude_watched_rivals",
        icon: <EyeOff className="h-3 w-3" />
      }
    ],
    values: filters.exclude_watched || [],
    onChange: (values: string[]) => handleFilterChange("exclude_watched", values),
  },
}
```

#### **Filter Panel Layout**
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   VAT STATUS    │ │  FULFILLMENT    │ │    MIN ITEMS    │ │ FILTER OPTIONS  │
│  ☑️ VAT Reg     │ │  ☑️ FBA Only    │ │     [100]       │ │ ☑️ Exclude      │
│  ☐ Non-VAT     │ │  ☑️ FBM Only    │ │                 │ │   Watched       │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
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

#### **Enhanced Multi-Line Chart Component (Replaces RivalGrowthChart)**
```typescript
interface EnhancedRivalChartProps {
  ratings: Array<[string, number]>;
  reviews: Array<[string, number]>;
  listings: Array<[string, number]>;
  height?: number;
}

const EnhancedRivalChart: React.FC<EnhancedRivalChartProps> = ({
  ratings,
  reviews,
  listings,
  height = 300
}) => {
  // Process and merge historical data arrays with interpolation (following RapidReviews pattern)
  const chartData = useMemo(() => {
    const processedData = processMultipleHistoricalDataSeries({
      listings,
      reviews,
      ratings
    });
    
    // Apply forward fill interpolation (following keepa-forward-fill.ts pattern)
    return forwardFillRivalData(processedData, ['listings', 'reviews', 'feedbackScore']);
  }, [listings, reviews, ratings]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="date" 
          interval="preserveStartEnd"
          tick={{ fontSize: 12 }}
        />
        <YAxis yAxisId="count" />
        <YAxis yAxisId="score" orientation="right" domain={[80, 100]} />
        
        <Tooltip content={<EnhancedMultiLineTooltip />} />
        
        <Line 
          yAxisId="count"
          dataKey="listings" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Listings"
          connectNulls={true}
        />
        
        <Line 
          yAxisId="count"
          dataKey="reviews" 
          stroke="#10b981" 
          strokeWidth={2}
          name="Reviews"
          connectNulls={true}
        />
        
        <Line 
          yAxisId="score"
          dataKey="feedbackScore" 
          stroke="#f59e0b" 
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Feedback Score"
          connectNulls={true}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// Enhanced tooltip showing all three metrics (following RapidReviews pattern)
const EnhancedMultiLineTooltip: React.FC<TooltipProps<any, any>> = ({ 
  active, payload, label 
}) => {
  if (active && payload && payload.length) {
    // Check if any data is interpolated (following ReviewHistoryGraph pattern)
    const hasInterpolatedData = payload.some((p: any) => 
      p.value === null || p.value === undefined || p.payload?.isInterpolated
    );
    
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium">{entry.name}:</span>
            <span>{entry.value?.toLocaleString()}</span>
            {entry.name === "Feedback Score" && <span>%</span>}
          </div>
        ))}
        
        {/* Interpolation indicator (following RapidReviews pattern) */}
        {hasInterpolatedData && (
          <p className="mt-2 text-xs italic text-muted-foreground">
            Data interpolated from nearby dates
          </p>
        )}
      </div>
    );
  }
  return null;
};
```

### **Data Processing Utilities (Following RapidReviews Pattern)**

```typescript
// Forward fill interpolation utility (adapted from keepa-forward-fill.ts)
export function forwardFillRivalData(
  data: Array<{date: string, [key: string]: any}>, 
  metrics: string[]
): Array<{date: string, [key: string]: any}> {
  const sorted = [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const lastKnown: Record<string, number | null> = {};
  
  return sorted.map((point) => {
    const filled = { ...point };
    let hasInterpolation = false;
    
    for (const metric of metrics) {
      if (point[metric] !== undefined && point[metric] !== null) {
        lastKnown[metric] = point[metric];
      } else if (lastKnown[metric] !== undefined) {
        filled[metric] = lastKnown[metric];
        hasInterpolation = true;
      }
    }
    
    // Mark interpolated points for tooltip indication
    if (hasInterpolation) {
      filled.isInterpolated = true;
    }
    
    return filled;
  });
}

// Multi-series data processing (merging listings, reviews, ratings arrays)
export function processMultipleHistoricalDataSeries(data: {
  listings: Array<[string, number]>;
  reviews: Array<[string, number]>;
  ratings: Array<[string, number]>;
}): Array<{date: string, listings?: number, reviews?: number, feedbackScore?: number}> {
  // Implementation following rivalradar-data-mapping.ts patterns
  // Merge all three arrays by date, handle missing values
  // Sort chronologically and format for charts
}
```

### **RivalDetailView Enhancement Requirements**

#### **Update Existing RivalDetailView Component**
- **Remove Tab Navigation**: Eliminate the current tab system (Listings/Reviews/Feedback Score)
- **Replace RivalGrowthChart**: Use new EnhancedRivalChart component
- **Maintain Layout**: Keep existing grid layout and styling exactly the same
- **Enhanced Tooltips**: Show all three metrics in comprehensive tooltip
- **Same Height**: Maintain 300px chart height for consistency

#### **Updated RivalDetailView Chart Section**
```typescript
// Replace existing chart section in RivalDetailView
<div className="h-[300px] w-full">
  <EnhancedRivalChart
    ratings={mappedResult.ratings || []}
    reviews={mappedResult.reviews || []}
    listings={mappedResult.listings || []}
    height={300}
  />
</div>
```

#### **Remove Tab Controls**
- Remove Tabs, TabsList, TabsTrigger components
- Remove activeTab state management
- Simplify chart header to just "Performance History"

## Implementation Checklist

### **Phase 1: Enhanced Chart Component** ✅ Must Have
- [ ] Create `EnhancedRivalChart` component with multi-line support
- [ ] Implement `forwardFillRivalData` utility (following keepa-forward-fill.ts pattern)
- [ ] Implement `processMultipleHistoricalDataSeries` utility for merging time series
- [ ] Create enhanced tooltip component with interpolation indicators
- [ ] Add proper Y-axis scaling for different data types
- [ ] Configure `connectNulls={true}` for smooth line interpolation
- [ ] Ensure consistent data interpolation with RapidReviews behavior

### **Phase 2: RivalDetailView Update** ✅ Must Have
- [ ] Update RivalDetailView to use EnhancedRivalChart
- [ ] Remove tab navigation system (Tabs, TabsList, TabsTrigger)
- [ ] Remove activeTab state management
- [ ] Update chart header to remove tab controls
- [ ] Test existing functionality remains intact

### **Phase 3: Discovery Card Structure** ✅ Must Have
- [ ] Create `EnhancedDiscoveryCard` component following RivalDetailView layout
- [ ] Implement header row with flag, seller name, action button
- [ ] Add left sidebar statistics section (matching RivalDetailView)
- [ ] Integrate EnhancedRivalChart in main content area
- [ ] Add full-width brand and category sections

### **Phase 4: Enhanced Filtering** ✅ Must Have
- [ ] Add "Exclude Watched Rivals" toggle to results filter dropdowns (alongside VAT/Fulfillment filters)
- [ ] Implement filtering logic in discovery results
- [ ] Update search/filter state management
- [ ] Add filter persistence to user preferences

### **Phase 5: Brand Action Integration** ✅ Must Have
- [ ] Implement clickable brand tags in discovery cards
- [ ] Integrate with existing BrandTaskDialog event system
- [ ] Add hover effects and visual feedback for brand interactions
- [ ] Include brand logos with fallback support
- [ ] Ensure marketplace context is passed to brand actions

### **Phase 6: Interactive Features** ✅ Must Have
- [ ] Add add/remove rival functionality directly in cards
- [ ] Implement loading states for all async actions
- [ ] Add error handling and user feedback
- [ ] Test BrandScan and BrandWatch task creation from discovery cards

### **Phase 7: Integration & Polish** ✅ Must Have
- [ ] Replace existing discovery card component
- [ ] Update RivalDiscovery to use EnhancedDiscoveryCard
- [ ] Ensure responsive design for mobile/tablet
- [ ] Add animation transitions matching SellerSmart patterns
- [ ] Implement proper skeleton loading states

### **Phase 8: Data Processing** ✅ Must Have
- [ ] Enhance backend API to include historical performance data
- [ ] Implement data transformation utilities
- [ ] Add monitoring status tracking in search results
- [ ] Optimize chart data processing for performance

### **Phase 9: Testing & Validation** ✅ Should Have
- [ ] Unit tests for new components
- [ ] Integration tests for monitoring actions and brand actions
- [ ] Visual regression tests for design consistency
- [ ] Performance testing for chart rendering
- [ ] User acceptance testing with discovery workflow
- [ ] Test BrandTaskDialog integration with discovery cards
- [ ] Test RivalDetailView chart enhancement

## Success Criteria

### **Functional Requirements**
- Discovery cards are **self-contained** with all essential competitor information
- **No navigation needed** - discovery cards replace the need for detail view navigation
- Multi-line performance charts show all historical trends simultaneously
- Add/remove rival actions work seamlessly without navigation
- Brand click actions successfully trigger BrandTaskDialog with both BrandScan and BrandWatch options
- Brand logos display correctly with fallback support
- Filter excludes already monitored rivals correctly
- Marketplace context is correctly passed to brand action dialogs

### **Information Parity with RivalDetailView**
Discovery cards include **all key information** from RivalDetailView:
- ✅ **Header Information**: Country flag, seller name, domain, monitoring status
- ✅ **Core Statistics**: Products count, feedback count, seller rating with badge
- ✅ **Business Information**: Est. monthly orders, VAT status, selling since date
- ✅ **Performance Visualization**: Multi-line chart showing listings/reviews/feedback trends
- ✅ **Brand Analysis**: Top brands with logos, product counts, clickable actions
- ✅ **Category Analysis**: Top categories with icons and product counts
- ✅ **Action Capabilities**: Add/remove monitoring, brand task creation

### **User Experience Requirements**
- Discovery section visual design matches SellerSmart detail views
- Chart interactions are intuitive and responsive
- Loading states provide clear feedback during async operations
- Component layout remains readable across different screen sizes
- Brand and category information is easily scannable
- Brand hover effects provide clear indication of interactivity
- BrandTaskDialog opens smoothly with appropriate brand and marketplace context
- **Streamlined workflow** - users can complete entire discovery → analysis → action workflow without navigation
- **Reduced cognitive load** - all necessary information visible in single cards

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