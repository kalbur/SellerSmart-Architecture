# PRD_20250612_1611_removal_orders_inventory_crossref [IN_PROGRESS]

## Problem Statement

The removal orders page in SellerSmart-Web currently displays removal order data without inventory cross-referencing, making it difficult for users to see complete product information including ASIN, product names, and product images. Additionally, the proxy image functionality for Amazon removal orders is not working, preventing users from viewing product thumbnails in the table.

Users need to see enriched removal order data that includes:
- Product images (via ASIN)
- Complete product information from inventory
- Current inventory levels for context
- Consistent user experience matching other tables (orders)

## User Needs

1. **Product Identification**: Users need to quickly identify products in removal orders through images and complete product information
2. **Inventory Context**: Users need to see current inventory levels to understand the impact of removal orders
3. **Consistent Experience**: Users expect the same rich data presentation across all table views in the application
4. **Visual Recognition**: Product images help users quickly scan and identify items in large removal order lists

## MCP Tools Used

- **Repomix**: Analyzed SellerSmart-Web codebase structure, identified existing inventory cross-referencing patterns in orders table, located image proxy implementations, and mapped API route structure
- **MongoDB Atlas Documentation**: Examined inventory and removal_orders collection schemas, identified exact field mappings for SKU matching (removal_orders.sku ↔ inventory.seller_sku)

## Test Specifications (TDD)

### Test Scenarios

1. **Successful SKU Matching**
   - Given: A removal order with sku "TEST-SKU-001" and inventory record with seller_sku "TEST-SKU-001"
   - When: API fetches removal orders data
   - Then: Removal order is enriched with inventory data (product_name, asin, inventory levels)

2. **SKU Match Failure with ASIN Fallback**
   - Given: A removal order with sku "MISSING-SKU" but asin "B01234567" matching inventory record
   - When: API attempts SKU matching first, then ASIN matching
   - Then: Removal order is enriched using ASIN-based inventory match

3. **No Inventory Match Found**
   - Given: A removal order with sku "ORPHAN-SKU" that doesn't exist in inventory
   - When: API attempts both SKU and ASIN matching
   - Then: Removal order displays with original data, inventory fields remain null/empty

4. **Image Proxy Success**
   - Given: A removal order with valid ASIN "B01234567"
   - When: ProductImage component requests image via /api/proxy/amazon-image/B01234567
   - Then: Amazon product image is displayed with proper caching and error handling

5. **Image Proxy Failure**
   - Given: A removal order with invalid ASIN or missing ASIN
   - When: ProductImage component requests image
   - Then: Fallback icon (ScanSearch) is displayed instead of broken image

### Unit Tests Required

- [ ] Test `buildInventoryLookupQuery()` with valid SKU array
- [ ] Test `buildInventoryLookupQuery()` with empty SKU array
- [ ] Test `createInventoryMap()` with inventory data containing seller_sku and asin
- [ ] Test `matchInventoryToRemovalOrder()` with exact SKU match
- [ ] Test `matchInventoryToRemovalOrder()` with ASIN fallback match
- [ ] Test `matchInventoryToRemovalOrder()` with no match found
- [ ] Test `enrichRemovalOrderWithInventory()` data mapping accuracy
- [ ] Test error handling for malformed inventory data
- [ ] Test performance with large datasets (1000+ removal orders)

### Integration Tests Required

- [ ] Test API endpoint: GET /api/amazon/removal-orders with inventory enrichment
- [ ] Test database operations: MongoDB aggregation pipeline for inventory lookup
- [ ] Test service interaction: removal orders service + inventory service integration
- [ ] Test pagination with inventory enrichment maintains performance
- [ ] Test real-time updates via SSE with enriched data
- [ ] Test API response time with inventory cross-referencing (<2s for 100 orders)
- [ ] Test concurrent users accessing enriched removal orders data

### Component Tests Required

- [ ] Test RemovalOrdersTable renders with enriched inventory data
- [ ] Test ProductImage component displays Amazon images correctly
- [ ] Test ProductImage component fallback behavior for missing ASINs
- [ ] Test InventoryCell component shows current inventory levels
- [ ] Test columns.tsx properly maps inventory data to display
- [ ] Test table sorting works with enriched data
- [ ] Test table filtering works with enriched data
- [ ] Test loading states during inventory data fetch
- [ ] Test error states when inventory enrichment fails

### E2E Tests Required

- [ ] Test critical user flow: Navigate to removal orders page and verify product images load
- [ ] Test user flow: Sort removal orders by product name (from inventory data)
- [ ] Test user flow: Filter removal orders and verify enriched data persists
- [ ] Test user flow: Pagination maintains inventory enrichment across pages

### Coverage Targets

- Unit Test Coverage: 100%
- Integration Test Coverage: 100%
- Overall Coverage: 100%
- Exclusions: None - all new code must be fully tested

## Codebase Analysis

### Existing Patterns Found

**1. Orders Table Inventory Cross-Referencing** (`/api/amazon/orders/route.ts`)
- Uses batch inventory lookup with SKU and ASIN extraction
- Creates inventory lookup map for O(1) access: `inventoryMap[sku:${sku}]`
- Primary matching by SKU, fallback to ASIN
- Enriches order data with inventory breakdown (fulfillable, inbound, reserved)

**2. ProductImage Component** (`src/components/shared/ProductImage.tsx`)
- Uses `/api/proxy/amazon-image/[asin]` endpoint
- Implements error handling with ScanSearch fallback icon
- Optimized for 48px size by default
- Includes proper loading states and error boundaries

**3. Image Proxy API** (`/api/proxy/amazon-image/[asin]/route.ts`)
- Handles Amazon image fetching with multiple fallback URLs
- Implements 30-day caching with stale-while-revalidate
- 93% bandwidth reduction through 150x150 optimization
- Proper CORS and error handling

**4. Table Structure Pattern**
- Uses TanStackTableWrapper for consistent behavior
- InventoryDataContext provides inventory data to table cells
- Column definitions in separate files (columns.tsx)
- Server-side pagination with metadata

### Code Examples to Follow

**API Route Pattern** (from orders implementation):
```typescript
// 1. Extract unique SKUs
const skus = new Set<string>();
removalOrders.forEach(order => {
  if (order.sku) skus.add(order.sku);
});

// 2. Inventory lookup
const inventoryQuery = {
  user_id: session.user.id,
  seller_sku: { $in: Array.from(skus) }
};

// 3. Create lookup map
const inventoryMap: Record<string, any> = {};
inventoryItems.forEach(item => {
  if (item.seller_sku) {
    inventoryMap[`sku:${item.seller_sku}`] = item;
  }
});

// 4. Enrich data
const enrichedOrders = removalOrders.map(order => ({
  ...order,
  inventory_data: inventoryMap[`sku:${order.sku}`] || null
}));
```

**Component Pattern** (for table columns):
```typescript
{
  id: "image",
  label: "Image",
  render: (_, item) => (
    <ProductImage
      asin={item.asin || item.inventory_data?.asin || ""}
      title={item.product_name || item.inventory_data?.product_name || "Product"}
      size={48}
    />
  ),
}
```

## Technical Requirements

### API Modifications

**File**: `/Users/kal/GitHub/SellerSmart-Web/src/app/api/amazon/removal-orders/route.ts`

1. **Add inventory cross-referencing logic** following orders pattern:
   - Extract unique SKUs from removal orders data
   - Build MongoDB query for inventory collection
   - Create inventory lookup map for efficient matching
   - Enrich removal orders data with inventory fields

2. **Field mappings**:
   - `removal_orders.sku` → `inventory.seller_sku` (primary match)
   - `removal_orders.asin` → `inventory.asin` (fallback match)
   - Add fields: `inventory_product_name`, `current_inventory_levels`, `inventory_asin`

3. **Performance optimization**:
   - Use single batch query for all inventory lookups
   - Implement lookup map for O(1) matching performance
   - Maintain existing pagination efficiency

### Frontend Component Updates

**File**: `/Users/kal/GitHub/SellerSmart-Web/src/components/features/amazon/removal-orders-table/columns.tsx`

1. **Add image column**:
   - Use existing ProductImage component
   - Primary ASIN source: `item.asin || item.inventory_data?.asin`
   - Fallback to ScanSearch icon for missing ASINs

2. **Add inventory information column**:
   - Display current fulfillable quantity
   - Show inventory condition
   - Format consistently with orders table

3. **Enhance existing columns**:
   - Product name: Use inventory data if available for richer information
   - Add inventory context to relevant columns

### Data Flow Architecture

```
Removal Orders API Request
    ↓
Extract SKUs from removal orders
    ↓
Query inventory collection (batch)
    ↓
Create inventory lookup map
    ↓
Enrich removal orders with inventory data
    ↓
Return paginated response with enriched data
    ↓
Frontend receives enriched data
    ↓
ProductImage component requests ASIN images
    ↓
Display enriched removal orders table
```

## Implementation Checklist (TDD Order)

### Phase 1: Test Development

- [ ] Write unit tests for inventory lookup utilities (`buildInventoryLookupQuery`, `createInventoryMap`, `matchInventoryToRemovalOrder`)
- [ ] Write unit tests for data enrichment functions (`enrichRemovalOrderWithInventory`)
- [ ] Write integration tests for modified `/api/amazon/removal-orders` endpoint
- [ ] Write component tests for updated RemovalOrdersTable with inventory data
- [ ] Write component tests for ProductImage usage in removal orders context
- [ ] Write E2E tests for removal orders page with images and inventory data
- [ ] Verify all tests fail correctly (red phase)
- [ ] Document test cases and expected behaviors in code comments

### Phase 2: Implementation

- [ ] Implement inventory cross-referencing utilities following orders pattern
- [ ] Modify `/api/amazon/removal-orders/route.ts` to include inventory enrichment
- [ ] Update `RemovalOrdersTable` columns to display product images
- [ ] Add inventory information display to removal orders table
- [ ] Implement proper error handling for inventory lookup failures
- [ ] Add loading states for inventory data fetching
- [ ] Refactor code while keeping all tests green

### Phase 3: Quality Assurance

- [ ] Run test coverage report and verify 100% coverage
- [ ] Run linting: `npm run lint` and fix any issues
- [ ] Run type checking: `npm run type-check` and fix any issues
- [ ] Performance testing: Verify API response times <2s for 100 orders
- [ ] Visual testing: Verify images load correctly and fallbacks work
- [ ] Update component documentation and API documentation

### Phase 4: Completion

- [ ] All unit tests passing (100% coverage)
- [ ] All integration tests passing
- [ ] All component tests passing
- [ ] All E2E tests passing
- [ ] Performance benchmarks met
- [ ] Code review completed
- [ ] PRD implementation checklist completed
- [ ] Move PRD to completed folder

## Success Criteria

- [ ] Removal orders table displays product images via ASIN proxy
- [ ] Inventory cross-referencing works with SKU-to-SKU matching
- [ ] Fallback to ASIN matching when SKU match fails
- [ ] Graceful handling of products not found in inventory
- [ ] Performance maintained: API responses <2s for typical datasets
- [ ] 100% test coverage for all new functionality
- [ ] No regression in existing removal orders functionality
- [ ] Consistent user experience with orders table
- [ ] Real-time updates continue to work with enriched data
- [ ] Image proxy errors handled gracefully with appropriate fallbacks

## Database Schema References

### Removal Orders Collection
```javascript
{
  sku: "string",           // Maps to inventory.seller_sku
  asin: "string",          // Maps to inventory.asin
  product_name: "string",  // Enhanced with inventory.product_name
  order_id: "string",
  requested_quantity: "int",
  // ... other fields
}
```

### Inventory Collection  
```javascript
{
  seller_sku: "string",    // Primary field for SKU matching
  asin: "string",          // Secondary field for ASIN matching
  product_name: "string",  // Rich product information
  total_quantity: "int",   // Current inventory levels
  inventory_details: {     // Detailed inventory breakdown
    fulfillable: { quantity: "int" },
    reserved: { total: "int" },
    // ... other breakdowns
  }
}
```

## API Enhancement Summary

The implementation will enhance the existing `/api/amazon/removal-orders` endpoint to include inventory cross-referencing without breaking existing functionality. The enriched response will include inventory data alongside removal order information, enabling the frontend to display product images and complete product context.

Key technical decisions:
- Reuse proven patterns from orders table implementation
- Maintain backward compatibility with existing API consumers
- Optimize for performance with batch inventory queries
- Follow existing error handling and caching strategies
- Leverage existing ProductImage component and image proxy infrastructure