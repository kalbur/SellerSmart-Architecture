#!/bin/bash

echo "🔍 WRAPPER STANDARDIZATION VERIFICATION REPORT"
echo "================================================"
echo ""

# Define table paths and their requirements
declare -A tables_with_keepa=(
    ["Inventory"]="/Users/kal/GitHub/SellerSmart-Web/src/components/features/amazon/inventory-table/index.tsx"
    ["Wholesale"]="/Users/kal/GitHub/SellerSmart-Web/src/components/features/wholesale/wholesale-table/index.tsx"
    ["BrandScan"]="/Users/kal/GitHub/SellerSmart-Web/src/components/features/brandscan/brandscan-table/index.tsx"
    ["RivalRadar"]="/Users/kal/GitHub/SellerSmart-Web/src/components/features/rivalradar/rivalradar-table/index.tsx"
    ["Qogita"]="/Users/kal/GitHub/SellerSmart-Web/src/components/features/qogita/qogita-table/index.tsx"
    ["ReplenSmart"]="/Users/kal/GitHub/SellerSmart-Web/src/components/features/amazon/replensmart-table/index.tsx"
)

declare -A tables_without_keepa=(
    ["Orders"]="/Users/kal/GitHub/SellerSmart-Web/src/components/features/amazon/orders-table/index.tsx"
    ["Returns"]="/Users/kal/GitHub/SellerSmart-Web/src/components/features/amazon/returns-table/index.tsx"
    ["Reimbursements"]="/Users/kal/GitHub/SellerSmart-Web/src/components/features/amazon/reimbursements-table/index.tsx"
    ["Removal Orders"]="/Users/kal/GitHub/SellerSmart-Web/src/components/features/amazon/removal-orders-table/RemovalOrdersTable.tsx"
    ["Review Requests"]="/Users/kal/GitHub/SellerSmart-Web/src/components/features/amazon/review-request-table/ReviewRequestTable.tsx"
)

echo "📊 TABLES WITH KEEPA GRAPHS (should have TooltipProvider + SimpleKeepaWrapper + TanStackTableWrapper):"
echo "============================================================================================"
for table in "${!tables_with_keepa[@]}"; do
    file="${tables_with_keepa[$table]}"
    if [ -f "$file" ]; then
        tooltip_count=$(grep -c "TooltipProvider" "$file" 2>/dev/null || echo "0")
        keepa_count=$(grep -c "SimpleKeepaWrapper" "$file" 2>/dev/null || echo "0")
        tanstack_count=$(grep -c "TanStackTableWrapper" "$file" 2>/dev/null || echo "0")
        
        if [ "$tooltip_count" -gt 0 ] && [ "$keepa_count" -gt 0 ] && [ "$tanstack_count" -gt 0 ]; then
            echo "✅ $table: TooltipProvider($tooltip_count) + SimpleKeepaWrapper($keepa_count) + TanStackTableWrapper($tanstack_count)"
        else
            echo "❌ $table: Missing required wrappers - TooltipProvider($tooltip_count) + SimpleKeepaWrapper($keepa_count) + TanStackTableWrapper($tanstack_count)"
        fi
    else
        echo "❓ $table: File not found"
    fi
done

echo ""
echo "📊 TABLES WITHOUT KEEPA GRAPHS (should have TooltipProvider + TanStackTableWrapper only):"
echo "======================================================================================"
for table in "${!tables_without_keepa[@]}"; do
    file="${tables_without_keepa[$table]}"
    if [ -f "$file" ]; then
        tooltip_count=$(grep -c "TooltipProvider" "$file" 2>/dev/null || echo "0")
        keepa_count=$(grep -c "SimpleKeepaWrapper" "$file" 2>/dev/null || echo "0")
        tanstack_count=$(grep -c "TanStackTableWrapper" "$file" 2>/dev/null || echo "0")
        
        if [ "$tooltip_count" -gt 0 ] && [ "$keepa_count" -eq 0 ] && [ "$tanstack_count" -gt 0 ]; then
            echo "✅ $table: TooltipProvider($tooltip_count) + TanStackTableWrapper($tanstack_count) (no SimpleKeepaWrapper)"
        else
            echo "❌ $table: Incorrect wrapper pattern - TooltipProvider($tooltip_count) + SimpleKeepaWrapper($keepa_count) + TanStackTableWrapper($tanstack_count)"
        fi
    else
        echo "❓ $table: File not found"
    fi
done

echo ""
echo "🎯 STANDARDIZATION SUMMARY:"
echo "=========================="

# Count successful standardizations
with_keepa_success=0
with_keepa_total=${#tables_with_keepa[@]}
without_keepa_success=0
without_keepa_total=${#tables_without_keepa[@]}

for table in "${!tables_with_keepa[@]}"; do
    file="${tables_with_keepa[$table]}"
    if [ -f "$file" ]; then
        tooltip_count=$(grep -c "TooltipProvider" "$file" 2>/dev/null || echo "0")
        keepa_count=$(grep -c "SimpleKeepaWrapper" "$file" 2>/dev/null || echo "0")
        tanstack_count=$(grep -c "TanStackTableWrapper" "$file" 2>/dev/null || echo "0")
        
        if [ "$tooltip_count" -gt 0 ] && [ "$keepa_count" -gt 0 ] && [ "$tanstack_count" -gt 0 ]; then
            ((with_keepa_success++))
        fi
    fi
done

for table in "${!tables_without_keepa[@]}"; do
    file="${tables_without_keepa[$table]}"
    if [ -f "$file" ]; then
        tooltip_count=$(grep -c "TooltipProvider" "$file" 2>/dev/null || echo "0")
        keepa_count=$(grep -c "SimpleKeepaWrapper" "$file" 2>/dev/null || echo "0")
        tanstack_count=$(grep -c "TanStackTableWrapper" "$file" 2>/dev/null || echo "0")
        
        if [ "$tooltip_count" -gt 0 ] && [ "$keepa_count" -eq 0 ] && [ "$tanstack_count" -gt 0 ]; then
            ((without_keepa_success++))
        fi
    fi
done

total_success=$((with_keepa_success + without_keepa_success))
total_tables=$((with_keepa_total + without_keepa_total))

echo "📈 Tables with Keepa graphs: $with_keepa_success/$with_keepa_total correctly standardized"
echo "📈 Tables without Keepa graphs: $without_keepa_success/$without_keepa_total correctly standardized" 
echo "🎉 Overall: $total_success/$total_tables tables successfully standardized"

if [ "$total_success" -eq "$total_tables" ]; then
    echo ""
    echo "🎊 STANDARDIZATION COMPLETE! All tables follow the correct wrapper patterns."
else
    echo ""
    echo "⚠️  Some tables still need standardization work."
fi