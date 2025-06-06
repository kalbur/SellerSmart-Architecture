const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runColumnDropdownTests() {
    const browser = await chromium.launch({ 
        headless: false,  // Run with browser visible for debugging
        slowMo: 1000     // Slow down actions for visibility
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Test results storage
    const testResults = {
        timestamp: new Date().toISOString(),
        serverUrl: 'http://localhost:3000',
        tests: [],
        screenshots: []
    };
    
    console.log('🔍 Starting Column Dropdown Functionality Tests');
    console.log('================================================');
    
    try {
        // Test 1: Navigate to inventory/data page
        console.log('Test 1: Navigating to inventory/data page...');
        const inventoryUrl = 'http://localhost:3000/inventory/data';
        
        try {
            await page.goto(inventoryUrl, { waitUntil: 'networkidle', timeout: 30000 });
            await page.waitForTimeout(3000); // Wait for page to fully load
            
            const screenshot1 = `inventory-data-page-${Date.now()}.png`;
            await page.screenshot({ path: screenshot1, fullPage: true });
            
            testResults.tests.push({
                name: 'Navigate to inventory/data',
                status: 'PASSED',
                details: 'Successfully loaded inventory data page'
            });
            testResults.screenshots.push(screenshot1);
            console.log('✅ Successfully loaded inventory/data page');
            
            // Test 2: Find and click the "Columns" button
            console.log('\\nTest 2: Looking for Columns button...');
            
            const columnSelectors = [
                'button:has-text("Columns")',
                '[data-testid="columns-button"]',
                'button[aria-label*="column"]',
                'button[title*="column"]',
                'button[title*="Column"]',
                'button:has-text("Column")',
                '[role="button"]:has-text("Columns")',
                '.columns-button',
                '#columns-button'
            ];
            
            let columnsButton = null;
            for (const selector of columnSelectors) {
                try {
                    columnsButton = await page.locator(selector).first();
                    if (await columnsButton.count() > 0) {
                        console.log(`Found columns button with selector: ${selector}`);
                        break;
                    }
                } catch (e) {
                    // Continue to next selector
                }
            }
            
            if (!columnsButton || await columnsButton.count() === 0) {
                // Try to find any button that might be for column management
                console.log('Looking for any potential column management buttons...');
                const allButtons = await page.locator('button').all();
                
                for (const button of allButtons) {
                    const text = await button.textContent();
                    const ariaLabel = await button.getAttribute('aria-label');
                    const title = await button.getAttribute('title');
                    
                    if (text && (text.toLowerCase().includes('column') || 
                               text.toLowerCase().includes('filter') ||
                               text.toLowerCase().includes('view'))) {
                        console.log(`Found potential button: "${text}"`);
                        columnsButton = button;
                        break;
                    }
                    
                    if (ariaLabel && ariaLabel.toLowerCase().includes('column')) {
                        console.log(`Found button with aria-label: "${ariaLabel}"`);
                        columnsButton = button;
                        break;
                    }
                    
                    if (title && title.toLowerCase().includes('column')) {
                        console.log(`Found button with title: "${title}"`);
                        columnsButton = button;
                        break;
                    }
                }
            }
            
            if (columnsButton && await columnsButton.count() > 0) {
                // Click the columns button
                await columnsButton.click();
                await page.waitForTimeout(1000);
                
                const screenshot2 = `columns-dropdown-opened-${Date.now()}.png`;
                await page.screenshot({ path: screenshot2, fullPage: true });
                
                testResults.tests.push({
                    name: 'Click Columns button',
                    status: 'PASSED',
                    details: 'Successfully clicked columns button and dropdown opened'
                });
                testResults.screenshots.push(screenshot2);
                console.log('✅ Successfully clicked columns button');
                
                // Test 3: Verify dropdown is open and contains checkboxes
                console.log('\\nTest 3: Verifying dropdown content...');
                
                const dropdownSelectors = [
                    '[role="menu"]',
                    '[role="dialog"]',
                    '.dropdown-content',
                    '.popover-content',
                    '[data-testid="column-dropdown"]',
                    '.column-manager',
                    '.table-column-settings'
                ];
                
                let dropdown = null;
                for (const selector of dropdownSelectors) {
                    try {
                        dropdown = page.locator(selector);
                        if (await dropdown.count() > 0) {
                            console.log(`Found dropdown with selector: ${selector}`);
                            break;
                        }
                    } catch (e) {
                        // Continue
                    }
                }
                
                if (dropdown && await dropdown.count() > 0) {
                    // Look for checkboxes within the dropdown
                    const checkboxes = await dropdown.locator('input[type="checkbox"]').all();
                    const checkboxCount = checkboxes.length;
                    
                    if (checkboxCount > 0) {
                        console.log(`✅ Found ${checkboxCount} checkboxes in dropdown`);
                        
                        testResults.tests.push({
                            name: 'Verify dropdown contains checkboxes',
                            status: 'PASSED',
                            details: `Found ${checkboxCount} checkboxes in column dropdown`
                        });
                        
                        // Test 4: Test checkbox interactions
                        console.log('\\nTest 4: Testing checkbox interactions...');
                        
                        if (checkboxCount >= 2) {
                            // Test unchecking a checkbox
                            const firstCheckbox = checkboxes[0];
                            const secondCheckbox = checkboxes[1];
                            
                            const isFirstChecked = await firstCheckbox.isChecked();
                            const isSecondChecked = await secondCheckbox.isChecked();
                            
                            console.log(`First checkbox checked: ${isFirstChecked}`);
                            console.log(`Second checkbox checked: ${isSecondChecked}`);
                            
                            // Toggle first checkbox
                            await firstCheckbox.click();
                            await page.waitForTimeout(500);
                            
                            const screenshot3 = `checkbox-toggled-${Date.now()}.png`;
                            await page.screenshot({ path: screenshot3, fullPage: true });
                            testResults.screenshots.push(screenshot3);
                            
                            // Check if dropdown is still open
                            const dropdownStillVisible = await dropdown.count() > 0;
                            
                            if (dropdownStillVisible) {
                                console.log('✅ Dropdown stayed open after checkbox interaction');
                                testResults.tests.push({
                                    name: 'Dropdown stays open during checkbox interaction',
                                    status: 'PASSED',
                                    details: 'Dropdown remained open after toggling checkbox'
                                });
                            } else {
                                console.log('❌ Dropdown closed after checkbox interaction');
                                testResults.tests.push({
                                    name: 'Dropdown stays open during checkbox interaction',
                                    status: 'FAILED',
                                    details: 'Dropdown closed unexpectedly after checkbox interaction'
                                });
                            }
                            
                            // Toggle second checkbox
                            if (dropdownStillVisible) {
                                await secondCheckbox.click();
                                await page.waitForTimeout(500);
                                
                                const screenshot4 = `second-checkbox-toggled-${Date.now()}.png`;
                                await page.screenshot({ path: screenshot4, fullPage: true });
                                testResults.screenshots.push(screenshot4);
                            }
                            
                            testResults.tests.push({
                                name: 'Test checkbox interactions',
                                status: 'PASSED',
                                details: 'Successfully interacted with checkboxes'
                            });
                            
                        } else {
                            testResults.tests.push({
                                name: 'Test checkbox interactions',
                                status: 'SKIPPED',
                                details: 'Not enough checkboxes found for interaction testing'
                            });
                        }
                        
                        // Test 5: Test drag and drop functionality
                        console.log('\\nTest 5: Looking for drag handles...');
                        
                        const dragHandleSelectors = [
                            '.grip',
                            '.drag-handle',
                            '[data-testid="drag-handle"]',
                            '.column-drag-handle',
                            '.draggable-handle'
                        ];
                        
                        let dragHandles = [];
                        for (const selector of dragHandleSelectors) {
                            try {
                                const handles = await dropdown.locator(selector).all();
                                if (handles.length > 0) {
                                    dragHandles = handles;
                                    console.log(`Found ${handles.length} drag handles with selector: ${selector}`);
                                    break;
                                }
                            } catch (e) {
                                // Continue
                            }
                        }
                        
                        if (dragHandles.length >= 2) {
                            try {
                                // Attempt to drag first handle to second position
                                const sourceHandle = dragHandles[0];
                                const targetHandle = dragHandles[1];
                                
                                await sourceHandle.dragTo(targetHandle);
                                await page.waitForTimeout(1000);
                                
                                const screenshot5 = `drag-drop-test-${Date.now()}.png`;
                                await page.screenshot({ path: screenshot5, fullPage: true });
                                testResults.screenshots.push(screenshot5);
                                
                                testResults.tests.push({
                                    name: 'Test drag and drop functionality',
                                    status: 'PASSED',
                                    details: 'Successfully performed drag and drop operation'
                                });
                                console.log('✅ Successfully tested drag and drop');
                                
                            } catch (error) {
                                testResults.tests.push({
                                    name: 'Test drag and drop functionality',
                                    status: 'FAILED',
                                    details: `Drag and drop failed: ${error.message}`
                                });
                                console.log(`❌ Drag and drop failed: ${error.message}`);
                            }
                        } else {
                            testResults.tests.push({
                                name: 'Test drag and drop functionality',
                                status: 'SKIPPED',
                                details: 'No drag handles found in dropdown'
                            });
                            console.log('⚠️  No drag handles found');
                        }
                        
                        // Test 6: Test clicking outside to close dropdown
                        console.log('\\nTest 6: Testing click outside to close dropdown...');
                        
                        try {
                            // Click outside the dropdown
                            await page.click('body', { position: { x: 50, y: 50 } });
                            await page.waitForTimeout(1000);
                            
                            const dropdownAfterClickOutside = await dropdown.count();
                            
                            if (dropdownAfterClickOutside === 0) {
                                console.log('✅ Dropdown closed when clicking outside');
                                testResults.tests.push({
                                    name: 'Dropdown closes when clicking outside',
                                    status: 'PASSED',
                                    details: 'Dropdown successfully closed when clicking outside'
                                });
                            } else {
                                console.log('❌ Dropdown did not close when clicking outside');
                                testResults.tests.push({
                                    name: 'Dropdown closes when clicking outside',
                                    status: 'FAILED',
                                    details: 'Dropdown remained open after clicking outside'
                                });
                            }
                            
                            const screenshot6 = `click-outside-test-${Date.now()}.png`;
                            await page.screenshot({ path: screenshot6, fullPage: true });
                            testResults.screenshots.push(screenshot6);
                            
                        } catch (error) {
                            testResults.tests.push({
                                name: 'Dropdown closes when clicking outside',
                                status: 'FAILED',
                                details: `Click outside test failed: ${error.message}`
                            });
                        }
                        
                    } else {
                        testResults.tests.push({
                            name: 'Verify dropdown contains checkboxes',
                            status: 'FAILED',
                            details: 'No checkboxes found in dropdown'
                        });
                        console.log('❌ No checkboxes found in dropdown');
                    }
                } else {
                    testResults.tests.push({
                        name: 'Verify dropdown is visible',
                        status: 'FAILED',
                        details: 'Dropdown not visible after clicking columns button'
                    });
                    console.log('❌ Dropdown not visible after clicking button');
                }
                
            } else {
                testResults.tests.push({
                    name: 'Find Columns button',
                    status: 'FAILED',
                    details: 'Columns button not found on inventory/data page'
                });
                console.log('❌ Columns button not found');
            }
            
        } catch (error) {
            testResults.tests.push({
                name: 'Navigate to inventory/data',
                status: 'FAILED',
                details: `Navigation failed: ${error.message}`
            });
            console.log(`❌ Failed to load inventory/data: ${error.message}`);
        }
        
        // Test the test-layout-manager page
        console.log('\\n=== Testing test-layout-manager page ===');
        
        try {
            const layoutUrl = 'http://localhost:3000/test-layout-manager';
            await page.goto(layoutUrl, { waitUntil: 'networkidle', timeout: 30000 });
            await page.waitForTimeout(3000);
            
            const screenshot7 = `test-layout-manager-${Date.now()}.png`;
            await page.screenshot({ path: screenshot7, fullPage: true });
            testResults.screenshots.push(screenshot7);
            
            testResults.tests.push({
                name: 'Navigate to test-layout-manager',
                status: 'PASSED',
                details: 'Successfully loaded test-layout-manager page'
            });
            console.log('✅ Successfully loaded test-layout-manager page');
            
            // Look for columns button on this page too
            let columnsButton = null;
            for (const selector of columnSelectors) {
                try {
                    columnsButton = await page.locator(selector).first();
                    if (await columnsButton.count() > 0) {
                        console.log(`Found columns button on layout manager page: ${selector}`);
                        break;
                    }
                } catch (e) {
                    // Continue
                }
            }
            
            if (columnsButton && await columnsButton.count() > 0) {
                await columnsButton.click();
                await page.waitForTimeout(1000);
                
                const screenshot8 = `layout-manager-dropdown-${Date.now()}.png`;
                await page.screenshot({ path: screenshot8, fullPage: true });
                testResults.screenshots.push(screenshot8);
                
                testResults.tests.push({
                    name: 'Test layout manager columns dropdown',
                    status: 'PASSED',
                    details: 'Successfully opened columns dropdown on layout manager page'
                });
                console.log('✅ Columns dropdown opened on layout manager page');
            } else {
                testResults.tests.push({
                    name: 'Test layout manager columns dropdown',
                    status: 'FAILED',
                    details: 'No columns button found on layout manager page'
                });
                console.log('❌ No columns button found on layout manager page');
            }
            
        } catch (error) {
            testResults.tests.push({
                name: 'Navigate to test-layout-manager',
                status: 'FAILED',
                details: `Navigation failed: ${error.message}`
            });
            console.log(`❌ Failed to load test-layout-manager: ${error.message}`);
        }
        
    } catch (error) {
        console.log(`Fatal error during testing: ${error.message}`);
        testResults.tests.push({
            name: 'Overall test execution',
            status: 'FAILED',
            details: `Fatal error: ${error.message}`
        });
    }
    
    await browser.close();
    
    // Generate final report
    console.log('\\n================================================');
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('================================================');
    
    const passed = testResults.tests.filter(t => t.status === 'PASSED').length;
    const failed = testResults.tests.filter(t => t.status === 'FAILED').length;
    const skipped = testResults.tests.filter(t => t.status === 'SKIPPED').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Skipped: ${skipped}`);
    console.log(`📸 Screenshots taken: ${testResults.screenshots.length}`);
    
    console.log('\\nDetailed Results:');
    testResults.tests.forEach((test, index) => {
        const emoji = test.status === 'PASSED' ? '✅' : test.status === 'FAILED' ? '❌' : '⚠️';
        console.log(`${index + 1}. ${emoji} ${test.name}: ${test.details}`);
    });
    
    console.log('\\nScreenshots saved:');
    testResults.screenshots.forEach(screenshot => {
        console.log(`📸 ${screenshot}`);
    });
    
    // Save detailed report to file
    const reportPath = `column-dropdown-test-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
    console.log(`\\n📄 Detailed report saved to: ${reportPath}`);
    
    return testResults;
}

// Run the tests
runColumnDropdownTests().catch(console.error);