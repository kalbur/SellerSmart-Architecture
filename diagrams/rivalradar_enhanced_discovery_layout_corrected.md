# Enhanced RivalRadar Discovery Page Layout - CORRECTED

## Key Layout Corrections Based on Actual RivalDetailView:

### ❌ **INCONSISTENCIES IDENTIFIED:**

1. **Layout Structure**: RivalDetailView uses a **left sidebar approach**, not 60/40 split
2. **Chart Design**: Single chart with tabs (Listings/Reviews/Feedback), not multi-line
3. **Statistics Layout**: Vertical stack in left sidebar, not 2x3 grid
4. **Brand Section**: Full-width bottom section, not inline
5. **Card Positioning**: Stats and charts are in separate cards, not one card

### ✅ **CORRECTED LAYOUT:**

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            RIVALRADAR DISCOVERY PAGE                                │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  DISCOVERY SETTINGS PANEL                                                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐  │
│  │   VAT STATUS    │ │  FULFILLMENT    │ │    MIN ITEMS    │ │ ✅ EXCLUDE      │  │
│  │  ☑️ VAT Reg     │ │  ☑️ FBA Only    │ │     [100]       │ │   WATCHED       │  │
│  │  ☐ Non-VAT     │ │  ☑️ FBM Only    │ │                 │ │   RIVALS        │  │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                             DISCOVERY RESULTS                                      │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                        ENHANCED DISCOVERY CARD #1                          │   │
│  │                                                                             │   │
│  │  ┌─────────────────────────────────────────────────────────────────────┐   │   │
│  │  │ HEADER ROW                                                          │   │   │
│  │  │ 🇬🇧 TechnoGadgets Ltd                            [ADD TO RADAR]    │   │   │
│  │  │ amazon.co.uk                                                        │   │   │
│  │  └─────────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                             │   │
│  │  LEFT SIDEBAR (280px)           │           MAIN CONTENT AREA              │   │
│  │  ┌─────────────────────────────┐   │   ┌─────────────────────────────────┐   │   │
│  │  │ STATS CARD                  │   │   │    PERFORMANCE CHART            │   │   │
│  │  │                             │   │   │                                 │   │   │
│  │  │ Products                    │   │   │  ┌ Listings │ Reviews │ Score ┐  │   │
│  │  │ 2,450                       │   │   │  │                           │  │   │
│  │  │                             │   │   │  │       ╭─╮                 │  │   │
│  │  │ Feedback Count              │   │   │  │      ╱   ╲                │  │   │
│  │  │ 5,234                       │   │   │  │     ╱     ╲               │  │   │
│  │  │                             │   │   │  │    ╱       ╲              │ 300px│
│  │  │ Seller Rating               │   │   │  │   ╱         ╲             │  │   │
│  │  │ 97% [Excellent]             │   │   │  │  ╱           ╲            │  │   │
│  │  │                             │   │   │  │ ╱             ╲           │  │   │
│  │  │ Est. Monthly Orders         │   │   │  │╱               ╲          │  │   │
│  │  │ 150 - 300                   │   │   │  │                           │  │   │
│  │  │                             │   │   │  │                           │  │   │
│  │  │ VAT Status                  │   │   │  └───────────────────────────────┘  │   │
│  │  │ Registered                  │   │   │                                 │   │   │
│  │  │                             │   │   │                                 │   │   │
│  │  │ Selling Since               │   │   │                                 │   │   │
│  │  │ Mar 2019                    │   │   │                                 │   │   │
│  │  └─────────────────────────────┘   │   └─────────────────────────────────┘   │   │
│  │                                                                             │   │
│  │  ┌─────────────────────────────────────────────────────────────────────┐   │   │
│  │  │ TOP BRANDS (Full Width - Clickable)                                │   │   │
│  │  │ 🔍 Click to scan                                                   │   │   │
│  │  │                                                                     │   │   │
│  │  │ [🏷️ Samsung  ]  [🏷️ Apple   ]  [🏷️ Sony    ]  [🏷️ LG      ]     │   │   │
│  │  │  150 products    89 products    67 products    45 products      │   │   │
│  │  │                                                                     │   │   │
│  │  │ [🏷️ Philips ]  [🏷️ Xiaomi  ]  [🏷️ OnePlus ]  [+ 12 more... ]     │   │   │
│  │  │  34 products    28 products    21 products                       │   │   │
│  │  └─────────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                             │   │
│  │  ┌─────────────────────────────────────────────────────────────────────┐   │   │
│  │  │ TOP CATEGORIES (Full Width)                                         │   │   │
│  │  │                                                                     │   │   │
│  │  │ [📱 Electronics]  [🏠 Home & Garden]  [🎮 Gaming]  [⌚ Watches]     │   │   │
│  │  │  890 products     567 products       234 products   189 products  │   │   │
│  │  └─────────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  [Additional discovery cards follow same pattern...]                               │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        BRAND TASK DIALOG (TRIGGERED)                               │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                        🏷️ Samsung                                           │   │
│  │                                                                             │   │
│  │  Select Task Type                                                           │   │
│  │                                                                             │   │
│  │  ┌─────────────────────────┐     ┌─────────────────────────┐                │   │
│  │  │   🔍 BRANDSCAN         │     │   👁️ BRANDWATCH         │                │   │
│  │  │                         │     │                         │                │   │
│  │  │ Find profitable         │     │ Monitor price           │                │   │
│  │  │ products               │     │ changes                 │                │   │
│  │  │                         │     │                         │                │   │
│  │  │    [SELECTED]           │     │                         │                │   │
│  │  └─────────────────────────┘     └─────────────────────────┘                │   │
│  │                                                                             │   │
│  │                      [🔍 Create BrandScan Task]                            │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## CORRECTED Key Features:

### **1. Layout Structure (Following RivalDetailView)**
- **Header Row**: Flag, seller name, domain, action button
- **Left Sidebar**: 280px width with vertically stacked statistics
- **Main Area**: Single chart with tab navigation (matching RivalDetailView)
- **Full-Width Sections**: Brands and categories below main content

### **2. Statistics Layout (Matching RivalDetailView)**
- **Vertical Stack**: Each stat in its own section with label/value
- **Typography**: Same text sizes and styling as detail view
- **Badge Integration**: Color-coded rating badges
- **Spacing**: Consistent with existing card padding

### **3. Chart Implementation (Consistent)**
- **Single Chart**: 300px height (same as RivalDetailView)
- **Tab Navigation**: Listings | Reviews | Feedback Score
- **Same Component**: Use existing RivalGrowthChart
- **Responsive**: Same responsive container approach

### **4. Brand Section (Matching Pattern)**
- **Full-Width Card**: Below main content area
- **Grid Layout**: 2-5 columns responsive (same as detail view)
- **Brand Cards**: Same styling with logo, name, product count
- **Hover Effects**: Search icon in top-right on hover
- **Click Handler**: Opens BrandTaskDialog (same implementation)

### **5. Action Buttons (Consistent Styling)**
- **Add to Radar**: Blue primary button (matching detail view)
- **Already Monitored**: Green or destructive variant
- **Loading States**: Loader2 with animate-spin

## Updated Technical Requirements:

### **Card Layout**
```typescript
// Match RivalDetailView layout structure
<Card className="border-border/50 bg-card/50 backdrop-blur-sm">
  <CardContent className="p-6">
    {/* Header Row */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-muted">
          <span className="text-base font-medium">{country.flag}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold">{sellerName}</h3>
          <p className="text-sm text-muted-foreground">{domain}</p>
        </div>
      </div>
      <Button /* Add/Remove action *//>
    </div>
    
    {/* Grid Layout: Sidebar + Main */}
    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[250px,1fr] xl:grid-cols-[280px,1fr]">
      <StatsCard />
      <ChartCard />
    </div>
    
    {/* Full-width sections */}
    <BrandsSection />
    <CategoriesSection />
  </CardContent>
</Card>
```

This corrected layout maintains full consistency with the existing RivalDetailView while providing the enhanced discovery experience in a more compact, scannable format.