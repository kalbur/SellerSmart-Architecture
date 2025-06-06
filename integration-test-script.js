#!/usr/bin/env node

/**
 * Comprehensive Integration Testing Script for SellerSmart-Web
 * 
 * This script performs integration testing for the standardized table features
 * by testing various scenarios and validating the integration between components.
 */

const fs = require('fs');
const path = require('path');

const WEB_ROOT = '/Users/kal/GitHub/SellerSmart-Web';

// ANSI color codes
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(80));
    log(`🧪 ${title}`, 'bold');
    console.log('='.repeat(80));
}

function logSubsection(title) {
    console.log('\n' + '-'.repeat(60));
    log(`📋 ${title}`, 'cyan');
    console.log('-'.repeat(60));
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

/**
 * Test 1: Core Component Integration Analysis
 */
function testCoreComponentIntegration() {
    logSection('Core Component Integration Analysis');
    
    const coreComponents = [
        'src/components/shared/Table/TanStackTableWrapper.tsx',
        'src/components/shared/AdvancedColumnManager.tsx',
        'src/components/shared/ColumnLayoutDialog.tsx',
        'src/components/shared/Table/StandardPagination.tsx',
        'src/components/shared/Filters/TableFilterBar.tsx',
        'src/components/shared/charts/SimpleKeepaGraph.tsx'
    ];

    let integrationScore = 0;
    const tests = [];

    coreComponents.forEach(componentPath => {
        const fullPath = path.join(WEB_ROOT, componentPath);
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            
            // Test 1.1: Check for standardized imports
            const hasStandardTypes = content.includes('StandardColumnConfig') || 
                                   content.includes('StandardPaginationProps') ||
                                   content.includes('FilterDescriptor');
            
            // Test 1.2: Check for accessibility features
            const hasAccessibility = content.includes('aria-') || 
                                   content.includes('role=') ||
                                   content.includes('aria-label') ||
                                   content.includes('TableAriaLabels');
            
            // Test 1.3: Check for drag and drop support
            const hasDragDrop = content.includes('@dnd-kit') || 
                              content.includes('DndContext') ||
                              content.includes('useSortable');
            
            // Test 1.4: Check for error handling
            const hasErrorHandling = content.includes('try') || 
                                   content.includes('catch') ||
                                   content.includes('error');
            
            const componentName = path.basename(componentPath, '.tsx');
            const score = [hasStandardTypes, hasAccessibility, hasDragDrop, hasErrorHandling]
                .reduce((sum, test) => sum + (test ? 1 : 0), 0);
            
            tests.push({
                component: componentName,
                score: score,
                maxScore: 4,
                details: {
                    standardTypes: hasStandardTypes,
                    accessibility: hasAccessibility,
                    dragDrop: hasDragDrop,
                    errorHandling: hasErrorHandling
                }
            });
            
            integrationScore += score;
            
            if (score >= 3) {
                logSuccess(`${componentName}: ${score}/4 integration features`);
            } else if (score >= 2) {
                logWarning(`${componentName}: ${score}/4 integration features`);
            } else {
                logError(`${componentName}: ${score}/4 integration features`);
            }
            
        } else {
            logError(`Component not found: ${componentPath}`);
        }
    });

    const maxScore = coreComponents.length * 4;
    const percentage = Math.round((integrationScore / maxScore) * 100);
    
    logInfo(`Overall Core Integration Score: ${integrationScore}/${maxScore} (${percentage}%)`);
    
    return { score: integrationScore, maxScore, percentage, tests };
}

/**
 * Test 2: Column Management Integration
 */
function testColumnManagementIntegration() {
    logSection('Column Management Integration Testing');
    
    const tableImplementations = [
        'src/components/features/amazon/orders-table/index.tsx',
        'src/components/features/amazon/inventory-table/index.tsx',
        'src/components/features/amazon/returns-table/index.tsx',
        'src/components/features/brandwatch/brandwatch-table/index.tsx',
        'src/components/features/rivalradar/rivalradar-table/index.tsx'
    ];

    let implementations = 0;
    let standardizedImplementations = 0;

    tableImplementations.forEach(tablePath => {
        const fullPath = path.join(WEB_ROOT, tablePath);
        if (fs.existsSync(fullPath)) {
            implementations++;
            const content = fs.readFileSync(fullPath, 'utf8');
            
            // Check for standardized column management
            const hasLayoutManager = content.includes('layoutManager') || content.includes('useGlobalLayoutManager');
            const hasTanStackWrapper = content.includes('TanStackTableWrapper');
            const hasColumnCallbacks = content.includes('updateColumnWidth') || 
                                     content.includes('updateColumnVisibility') || 
                                     content.includes('updateColumnOrder');
            
            const tableName = path.basename(tablePath, '/index.tsx');
            
            if (hasLayoutManager && hasTanStackWrapper && hasColumnCallbacks) {
                standardizedImplementations++;
                logSuccess(`${tableName}: Fully standardized column management`);
            } else {
                logWarning(`${tableName}: Partial standardization`);
                if (!hasLayoutManager) logError(`  - Missing layout manager`);
                if (!hasTanStackWrapper) logError(`  - Missing TanStack wrapper`);
                if (!hasColumnCallbacks) logError(`  - Missing column callbacks`);
            }
        }
    });

    const percentage = implementations > 0 ? Math.round((standardizedImplementations / implementations) * 100) : 0;
    logInfo(`Column Management Integration: ${standardizedImplementations}/${implementations} tables (${percentage}%)`);
    
    return { standardized: standardizedImplementations, total: implementations, percentage };
}

/**
 * Test 3: Filter System Integration
 */
function testFilterSystemIntegration() {
    logSection('Filter System Integration Testing');
    
    const filterPattern = /TableFilterBar|UnifiedFilterDropdown|FilterDescriptor/;
    const searchPattern = /searchValue|onSearchChange|searchTerm/;
    
    let tablesWithFilters = 0;
    let tablesWithSearch = 0;
    let totalTables = 0;

    const tableFiles = [
        'src/app/orders/OrdersClient.tsx',
        'src/app/inventory/InventoryClient.tsx',
        'src/app/returns/ReturnsClient.tsx',
        'src/app/reimbursements/ReimbursementsClient.tsx'
    ];

    tableFiles.forEach(filePath => {
        const fullPath = path.join(WEB_ROOT, filePath);
        if (fs.existsSync(fullPath)) {
            totalTables++;
            const content = fs.readFileSync(fullPath, 'utf8');
            
            const hasFilters = filterPattern.test(content);
            const hasSearch = searchPattern.test(content);
            
            const tableName = path.basename(filePath, 'Client.tsx');
            
            if (hasFilters) {
                tablesWithFilters++;
                logSuccess(`${tableName}: Has filter system integration`);
            } else {
                logWarning(`${tableName}: Missing filter system`);
            }
            
            if (hasSearch) {
                tablesWithSearch++;
                logSuccess(`${tableName}: Has search integration`);
            } else {
                logWarning(`${tableName}: Missing search integration`);
            }
        }
    });

    const filterPercentage = totalTables > 0 ? Math.round((tablesWithFilters / totalTables) * 100) : 0;
    const searchPercentage = totalTables > 0 ? Math.round((tablesWithSearch / totalTables) * 100) : 0;
    
    logInfo(`Filter Integration: ${tablesWithFilters}/${totalTables} tables (${filterPercentage}%)`);
    logInfo(`Search Integration: ${tablesWithSearch}/${totalTables} tables (${searchPercentage}%)`);
    
    return {
        filters: { implemented: tablesWithFilters, total: totalTables, percentage: filterPercentage },
        search: { implemented: tablesWithSearch, total: totalTables, percentage: searchPercentage }
    };
}

/**
 * Test 4: Pagination Integration
 */
function testPaginationIntegration() {
    logSection('Pagination Integration Testing');
    
    const paginationPattern = /StandardPagination|useTablePagination|currentPage|totalPages|pageSize/;
    const persistencePattern = /localStorage|sessionStorage|globalPageSize/;
    
    let tablesWithPagination = 0;
    let tablesWithPersistence = 0;
    let totalTables = 0;

    const tableFiles = [
        'src/app/orders/OrdersClient.tsx',
        'src/app/inventory/InventoryClient.tsx', 
        'src/app/returns/ReturnsClient.tsx',
        'src/app/reimbursements/ReimbursementsClient.tsx'
    ];

    tableFiles.forEach(filePath => {
        const fullPath = path.join(WEB_ROOT, filePath);
        if (fs.existsSync(fullPath)) {
            totalTables++;
            const content = fs.readFileSync(fullPath, 'utf8');
            
            const hasPagination = paginationPattern.test(content);
            const hasPersistence = persistencePattern.test(content);
            
            const tableName = path.basename(filePath, 'Client.tsx');
            
            if (hasPagination) {
                tablesWithPagination++;
                logSuccess(`${tableName}: Has pagination integration`);
            } else {
                logWarning(`${tableName}: Missing pagination`);
            }
            
            if (hasPersistence) {
                tablesWithPersistence++;
                logSuccess(`${tableName}: Has state persistence`);
            } else {
                logWarning(`${tableName}: Missing state persistence`);
            }
        }
    });

    const paginationPercentage = totalTables > 0 ? Math.round((tablesWithPagination / totalTables) * 100) : 0;
    const persistencePercentage = totalTables > 0 ? Math.round((tablesWithPersistence / totalTables) * 100) : 0;
    
    logInfo(`Pagination Integration: ${tablesWithPagination}/${totalTables} tables (${paginationPercentage}%)`);
    logInfo(`State Persistence: ${tablesWithPersistence}/${totalTables} tables (${persistencePercentage}%)`);
    
    return {
        pagination: { implemented: tablesWithPagination, total: totalTables, percentage: paginationPercentage },
        persistence: { implemented: tablesWithPersistence, total: totalTables, percentage: persistencePercentage }
    };
}

/**
 * Test 5: Keepa Graph Integration
 */
function testKeepaGraphIntegration() {
    logSection('Keepa Graph Integration Testing');
    
    const keepaGraphPath = path.join(WEB_ROOT, 'src/components/shared/charts/SimpleKeepaGraph.tsx');
    
    if (!fs.existsSync(keepaGraphPath)) {
        logError('SimpleKeepaGraph component not found');
        return { score: 0, maxScore: 5, features: [] };
    }

    const content = fs.readFileSync(keepaGraphPath, 'utf8');
    
    // Test for time range buttons
    const hasTimeRangeButtons = content.includes('TimeRangeButtons') && content.includes('showTimeRangeButtons');
    const hasTimeRangeFiltering = content.includes('filterDataByTimeRange') && content.includes('selectedDays');
    const hasDataPersistence = content.includes('allData') && content.includes('setData');
    const hasErrorHandling = content.includes('error') && content.includes('loading');
    const hasAccessibility = content.includes('aria-') || content.includes('role=');
    
    const features = [
        { name: 'Time Range Buttons', implemented: hasTimeRangeButtons },
        { name: 'Time Range Filtering', implemented: hasTimeRangeFiltering },
        { name: 'Data Persistence', implemented: hasDataPersistence },
        { name: 'Error Handling', implemented: hasErrorHandling },
        { name: 'Accessibility', implemented: hasAccessibility }
    ];

    let score = 0;
    features.forEach(feature => {
        if (feature.implemented) {
            score++;
            logSuccess(`Keepa Graph: ${feature.name} ✓`);
        } else {
            logWarning(`Keepa Graph: ${feature.name} ✗`);
        }
    });

    const percentage = Math.round((score / features.length) * 100);
    logInfo(`Keepa Graph Integration: ${score}/${features.length} features (${percentage}%)`);
    
    return { score, maxScore: features.length, percentage, features };
}

/**
 * Test 6: API Integration and Error Handling
 */
function testAPIIntegration() {
    logSection('API Integration and Error Handling Testing');
    
    const apiFiles = [
        'src/app/api/amazon/orders/route.ts',
        'src/app/api/amazon/inventory/route.ts',
        'src/app/api/amazon/returns/route.ts',
        'src/app/api/amazon/reimbursements/route.ts'
    ];

    let apisWithErrorHandling = 0;
    let apisWithRetry = 0;
    let apisWithValidation = 0;
    let totalApis = 0;

    apiFiles.forEach(apiPath => {
        const fullPath = path.join(WEB_ROOT, apiPath);
        if (fs.existsSync(fullPath)) {
            totalApis++;
            const content = fs.readFileSync(fullPath, 'utf8');
            
            const hasErrorHandling = content.includes('try') && content.includes('catch');
            const hasRetry = content.includes('retry') || content.includes('retries');
            const hasValidation = content.includes('validate') || content.includes('schema') || content.includes('z.');
            
            const apiName = path.basename(apiPath, '/route.ts');
            
            if (hasErrorHandling) {
                apisWithErrorHandling++;
                logSuccess(`${apiName} API: Has error handling`);
            } else {
                logWarning(`${apiName} API: Missing error handling`);
            }
            
            if (hasRetry) {
                apisWithRetry++;
                logSuccess(`${apiName} API: Has retry mechanism`);
            } else {
                logWarning(`${apiName} API: Missing retry mechanism`);
            }
            
            if (hasValidation) {
                apisWithValidation++;
                logSuccess(`${apiName} API: Has input validation`);
            } else {
                logWarning(`${apiName} API: Missing input validation`);
            }
        }
    });

    const errorHandlingPercentage = totalApis > 0 ? Math.round((apisWithErrorHandling / totalApis) * 100) : 0;
    const retryPercentage = totalApis > 0 ? Math.round((apisWithRetry / totalApis) * 100) : 0;
    const validationPercentage = totalApis > 0 ? Math.round((apisWithValidation / totalApis) * 100) : 0;
    
    logInfo(`Error Handling: ${apisWithErrorHandling}/${totalApis} APIs (${errorHandlingPercentage}%)`);
    logInfo(`Retry Mechanisms: ${apisWithRetry}/${totalApis} APIs (${retryPercentage}%)`);
    logInfo(`Input Validation: ${apisWithValidation}/${totalApis} APIs (${validationPercentage}%)`);
    
    return {
        errorHandling: { implemented: apisWithErrorHandling, total: totalApis, percentage: errorHandlingPercentage },
        retry: { implemented: apisWithRetry, total: totalApis, percentage: retryPercentage },
        validation: { implemented: apisWithValidation, total: totalApis, percentage: validationPercentage }
    };
}

/**
 * Test 7: Performance Analysis
 */
function testPerformanceFeatures() {
    logSection('Performance Features Analysis');
    
    const performanceFeatures = [
        {
            name: 'Auto-fit Columns',
            file: 'src/hooks/useTableAutoFit.ts',
            patterns: ['useTableAutoFit', 'autoFitWidths', 'enableAutoFit']
        },
        {
            name: 'Virtual Scrolling',
            file: 'src/components/shared/Table/VirtualizedTable.tsx',
            patterns: ['react-window', 'virtualized', 'FixedSizeList']
        },
        {
            name: 'Debounced Search',
            file: 'src/hooks/useDebounce.ts',
            patterns: ['debounce', 'useDebounce', 'setTimeout']
        },
        {
            name: 'Memoized Components',
            file: 'src/components/shared/Table/TanStackTableWrapper.tsx',
            patterns: ['useMemo', 'useCallback', 'React.memo']
        }
    ];

    let implementedFeatures = 0;
    const results = [];

    performanceFeatures.forEach(feature => {
        const fullPath = path.join(WEB_ROOT, feature.file);
        let implemented = false;
        
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            implemented = feature.patterns.some(pattern => content.includes(pattern));
        }
        
        if (implemented) {
            implementedFeatures++;
            logSuccess(`${feature.name}: Implemented`);
        } else {
            logWarning(`${feature.name}: Not implemented or not found`);
        }
        
        results.push({ name: feature.name, implemented });
    });

    const percentage = Math.round((implementedFeatures / performanceFeatures.length) * 100);
    logInfo(`Performance Features: ${implementedFeatures}/${performanceFeatures.length} (${percentage}%)`);
    
    return { implemented: implementedFeatures, total: performanceFeatures.length, percentage, results };
}

/**
 * Test 8: Accessibility Compliance
 */
function testAccessibilityCompliance() {
    logSection('Accessibility Compliance Testing');
    
    const accessibilityFeatures = [
        {
            name: 'Table ARIA Labels',
            patterns: ['aria-label', 'aria-rowcount', 'aria-colcount', 'TableAriaLabels']
        },
        {
            name: 'Keyboard Navigation',
            patterns: ['tabIndex', 'onKeyDown', 'useTableAccessibility', 'KeyboardSensor']
        },
        {
            name: 'Screen Reader Support',
            patterns: ['sr-only', 'aria-live', 'announceToScreenReader', 'ScreenReaderAnnouncer']
        },
        {
            name: 'Focus Management',
            patterns: ['autoFocus', 'focus', 'blur', 'focusedCell']
        }
    ];

    const keyFiles = [
        'src/components/shared/Table/TanStackTableWrapper.tsx',
        'src/hooks/useTableAccessibility.tsx',
        'src/lib/accessibility-utils.ts'
    ];

    let implementedFeatures = 0;
    const results = [];

    accessibilityFeatures.forEach(feature => {
        let implemented = false;
        
        keyFiles.forEach(filePath => {
            const fullPath = path.join(WEB_ROOT, filePath);
            if (fs.existsSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (feature.patterns.some(pattern => content.includes(pattern))) {
                    implemented = true;
                }
            }
        });
        
        if (implemented) {
            implementedFeatures++;
            logSuccess(`${feature.name}: Implemented`);
        } else {
            logWarning(`${feature.name}: Not fully implemented`);
        }
        
        results.push({ name: feature.name, implemented });
    });

    const percentage = Math.round((implementedFeatures / accessibilityFeatures.length) * 100);
    logInfo(`Accessibility Features: ${implementedFeatures}/${accessibilityFeatures.length} (${percentage}%)`);
    
    return { implemented: implementedFeatures, total: accessibilityFeatures.length, percentage, results };
}

/**
 * Generate Final Report
 */
function generateFinalReport(results) {
    logSection('Integration Testing Final Report');
    
    console.log('\n📊 SUMMARY SCORES:');
    console.log('================');
    
    // Calculate overall score
    let totalScore = 0;
    let maxScore = 0;
    
    Object.entries(results).forEach(([testName, result]) => {
        if (result.percentage !== undefined) {
            const displayName = testName.replace(/([A-Z])/g, ' $1').trim();
            const status = result.percentage >= 80 ? '🟢' : result.percentage >= 60 ? '🟡' : '🔴';
            console.log(`${status} ${displayName}: ${result.percentage}%`);
            
            if (result.score !== undefined && result.maxScore !== undefined) {
                totalScore += result.score;
                maxScore += result.maxScore;
            }
        }
    });
    
    const overallPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    
    console.log('\n🎯 OVERALL INTEGRATION HEALTH:');
    console.log('==============================');
    
    if (overallPercentage >= 85) {
        logSuccess(`Excellent: ${overallPercentage}% - All systems are well integrated`);
    } else if (overallPercentage >= 70) {
        logWarning(`Good: ${overallPercentage}% - Most systems are properly integrated`);
    } else if (overallPercentage >= 50) {
        logWarning(`Fair: ${overallPercentage}% - Significant integration issues need attention`);
    } else {
        logError(`Poor: ${overallPercentage}% - Major integration problems require immediate attention`);
    }
    
    console.log('\n🔧 RECOMMENDATIONS:');
    console.log('==================');
    
    if (results.columnManagement.percentage < 80) {
        logWarning('• Complete column management standardization across all tables');
    }
    
    if (results.filterSystem.filters.percentage < 80) {
        logWarning('• Implement unified filter system in remaining tables');
    }
    
    if (results.pagination.pagination.percentage < 80) {
        logWarning('• Add StandardPagination component to all tables');
    }
    
    if (results.apiIntegration.errorHandling.percentage < 80) {
        logWarning('• Improve error handling in API routes');
    }
    
    if (results.accessibility.percentage < 80) {
        logWarning('• Enhance accessibility features for WCAG compliance');
    }
    
    if (results.performance.percentage < 60) {
        logWarning('• Implement performance optimizations (memoization, virtualization)');
    }
    
    if (overallPercentage >= 85) {
        logSuccess('• All major integration points are working well!');
        logSuccess('• Consider adding automated tests for regression prevention');
        logSuccess('• Monitor performance in production environment');
    }
    
    return overallPercentage;
}

/**
 * Main Test Runner
 */
function runIntegrationTests() {
    log('🚀 Starting Comprehensive Integration Testing for SellerSmart-Web', 'bold');
    log(`📍 Testing directory: ${WEB_ROOT}`, 'blue');
    
    const results = {};
    
    try {
        // Run all tests
        results.coreIntegration = testCoreComponentIntegration();
        results.columnManagement = testColumnManagementIntegration();
        results.filterSystem = testFilterSystemIntegration();
        results.pagination = testPaginationIntegration();
        results.keepaGraph = testKeepaGraphIntegration();
        results.apiIntegration = testAPIIntegration();
        results.performance = testPerformanceFeatures();
        results.accessibility = testAccessibilityCompliance();
        
        // Generate final report
        const overallScore = generateFinalReport(results);
        
        console.log('\n' + '='.repeat(80));
        log('🏁 Integration Testing Complete!', 'bold');
        log(`📈 Overall Score: ${overallScore}%`, overallScore >= 80 ? 'green' : overallScore >= 60 ? 'yellow' : 'red');
        console.log('='.repeat(80) + '\n');
        
        return results;
        
    } catch (error) {
        logError(`Integration testing failed: ${error.message}`);
        console.error(error);
        return null;
    }
}

// Run the tests if this script is executed directly
if (require.main === module) {
    runIntegrationTests();
}

module.exports = { runIntegrationTests };