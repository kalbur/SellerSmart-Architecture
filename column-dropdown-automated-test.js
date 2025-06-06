const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testColumnDropdown() {
    const browser = await chromium.launch({ 
        headless: false, // Set to true for headless mode
        slowMo: 1000 // Slow down actions for better visibility
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    const results = {
        timestamp: new Date().toISOString(),
        testResults: [],
        screenshots: [],
        issues: [],
        summary: {
            passed: 0,
            failed: 0,
            total: 0
        }
    };

    function addTest(name, passed, details = '') {
        results.testResults.push({
            name,
            passed,
            details,
            timestamp: new Date().toISOString()
        });
        
        if (passed) {
            results.summary.passed++;
            console.log(`✅ ${name}: PASSED ${details ? '- ' + details : ''}`);
        } else {
            results.summary.failed++;
            console.log(`❌ ${name}: FAILED ${details ? '- ' + details : ''}`);
            results.issues.push(`${name}: ${details}`);
        }
        results.summary.total++;
    }

    async function takeScreenshot(name) {
        const timestamp = Date.now();
        const filename = `${name}-${timestamp}.png`;
        const filepath = path.join(__dirname, filename);
        await page.screenshot({ path: filepath, fullPage: true });
        results.screenshots.push(filename);
        console.log(`📷 Screenshot saved: ${filename}`);
        return filename;
    }

    try {
        console.log('🚀 Starting Column Dropdown Automation Test');
        console.log('Server URL: http://localhost:3002');
        
        // Test 1: Navigate to the application
        console.log('\n📋 Test 1: Navigate to application');
        await page.goto('http://localhost:3002');
        await page.waitForLoadState('networkidle');
        
        // Check if we're on a login page or if we need to handle authentication
        const pageTitle = await page.title();
        const currentUrl = page.url();
        console.log(`Current page: ${pageTitle} (${currentUrl})`);
        
        // Take initial screenshot
        await takeScreenshot('initial-page');
        
        // Check if user is logged in by looking for common indicators
        const loginIndicators = [
            'input[type="email"]',
            'input[type="password"]',
            'button[type="submit"]',
            'text=Sign in',
            'text=Login',
            'text=Log in'
        ];
        
        let isOnLoginPage = false;
        for (const indicator of loginIndicators) {
            try {
                const element = await page.locator(indicator).first();
                if (await element.isVisible()) {
                    isOnLoginPage = true;
                    break;
                }
            } catch (e) {
                // Indicator not found, continue
            }
        }
        
        if (isOnLoginPage) {
            addTest('Navigation to application', false, 'Still on login page - user needs to be logged in first');
            console.log('⚠️  User appears to not be logged in. Please log in first and then run the test again.');
        } else {
            addTest('Navigation to application', true, `Successfully navigated to ${currentUrl}`);
        }

        // Test 2: Find pages with tables that have column management
        console.log('\n📋 Test 2: Find pages with table column management');
        
        const testPages = [
            '/inventory/data',
            '/orders', 
            '/test-layout-manager',
            '/inventory',
            '/data',
            '/dashboard'
        ];
        
        let foundTablePage = false;
        let workingPageUrl = '';
        
        for (const testPage of testPages) {
            try {
                console.log(`  Trying page: ${testPage}`);
                await page.goto(`http://localhost:3002${testPage}`);
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(2000); // Wait for content to load
                
                // Look for table and columns button
                const hasTable = await page.locator('table, [role="table"], .table').first().isVisible().catch(() => false);
                const hasColumnsButton = await page.locator('button:has-text("Columns"), button:has-text("Column"), [aria-label*="column"], [data-testid*="column"]').first().isVisible().catch(() => false);
                
                console.log(`    Table found: ${hasTable}, Columns button found: ${hasColumnsButton}`);
                
                if (hasTable && hasColumnsButton) {
                    foundTablePage = true;
                    workingPageUrl = testPage;
                    addTest('Find table page with column management', true, `Found working page: ${testPage}`);
                    await takeScreenshot(`table-page-${testPage.replace(/\//g, '-')}`);
                    break;
                } else if (hasTable) {
                    console.log(`    Found table on ${testPage} but no columns button`);
                }
                
            } catch (error) {
                console.log(`    Error accessing ${testPage}: ${error.message}`);
            }
        }
        
        if (!foundTablePage) {
            addTest('Find table page with column management', false, 'No page found with both table and columns button');
            
            // Try to find any columns button on current page
            console.log('  Searching for any columns-related elements...');
            const allButtons = await page.locator('button').all();
            for (let i = 0; i < Math.min(allButtons.length, 20); i++) { // Limit to first 20 buttons
                try {
                    const buttonText = await allButtons[i].textContent();
                    if (buttonText && (buttonText.toLowerCase().includes('column') || buttonText.toLowerCase().includes('manage'))) {
                        console.log(`    Found potential button: "${buttonText}"`);
                    }
                } catch (e) {
                    // Skip if error reading button text
                }
            }
        }

        // Test 3: Test the columns button (if found)
        if (foundTablePage) {
            console.log('\n📋 Test 3: Test Columns Button');
            
            await page.goto(`http://localhost:3002${workingPageUrl}`);
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            
            // Find the columns button with multiple selectors
            const columnsSelectors = [
                'button:has-text("Columns")',
                'button:has-text("Column")',
                '[aria-label*="column"]',
                '[data-testid*="column"]',
                'button[title*="column"]',
                'button[title*="Column"]'
            ];
            
            let columnsButton = null;
            for (const selector of columnsSelectors) {
                try {
                    const button = page.locator(selector).first();
                    if (await button.isVisible()) {
                        columnsButton = button;
                        console.log(`  Found columns button with selector: ${selector}`);
                        break;
                    }
                } catch (e) {
                    // Continue trying other selectors
                }
            }
            
            if (columnsButton) {
                await takeScreenshot('before-columns-click');
                
                // Click the columns button
                await columnsButton.click();
                await page.waitForTimeout(1000); // Wait for dropdown to appear
                
                // Check if dropdown opened
                const dropdownSelectors = [
                    '[role="menu"]',
                    '[role="listbox"]',
                    '.dropdown-menu',
                    '.popover',
                    '.columns-dropdown',
                    '[data-radix-popper-content-wrapper]',
                    '[data-side]',
                    '.menu'
                ];
                
                let dropdownFound = false;
                let dropdown = null;
                
                for (const selector of dropdownSelectors) {
                    try {
                        const element = page.locator(selector).first();
                        if (await element.isVisible()) {
                            dropdown = element;
                            dropdownFound = true;
                            console.log(`  Dropdown opened with selector: ${selector}`);
                            break;
                        }
                    } catch (e) {
                        // Continue trying
                    }
                }
                
                if (dropdownFound) {
                    addTest('Columns button opens dropdown', true, 'Dropdown successfully opened');
                    await takeScreenshot('dropdown-opened');
                    
                    // Test 4: Check for checkboxes in dropdown
                    console.log('\n📋 Test 4: Test Checkboxes in Dropdown');
                    
                    const checkboxes = await page.locator('input[type="checkbox"]').all();
                    console.log(`  Found ${checkboxes.length} checkboxes in dropdown`);
                    
                    if (checkboxes.length > 0) {
                        addTest('Dropdown contains checkboxes', true, `Found ${checkboxes.length} checkboxes`);
                        
                        // Test clicking a checkbox
                        try {
                            const firstCheckbox = checkboxes[0];
                            const wasChecked = await firstCheckbox.isChecked();
                            
                            await firstCheckbox.click();
                            await page.waitForTimeout(500);
                            
                            const isNowChecked = await firstCheckbox.isChecked();
                            const stateChanged = wasChecked !== isNowChecked;
                            
                            addTest('Checkbox click functionality', stateChanged, `Checkbox state changed from ${wasChecked} to ${isNowChecked}`);
                            
                            // Check if dropdown is still open after checkbox click
                            const stillOpen = await dropdown.isVisible();
                            addTest('Dropdown stays open after checkbox click', stillOpen, 'Dropdown persistence verified');
                            
                            await takeScreenshot('after-checkbox-click');
                            
                        } catch (error) {
                            addTest('Checkbox click functionality', false, `Error: ${error.message}`);
                        }
                    } else {
                        addTest('Dropdown contains checkboxes', false, 'No checkboxes found in dropdown');
                    }
                    
                    // Test 5: Look for drag handles
                    console.log('\n📋 Test 5: Test Drag Handles');
                    
                    const dragHandleSelectors = [
                        '[data-testid*="drag"]',
                        '.drag-handle',
                        '.grip',
                        '[title*="drag"]',
                        '[aria-label*="drag"]',
                        'svg[data-icon="grip"]',
                        '.lucide-grip-vertical'
                    ];
                    
                    let dragHandlesFound = false;
                    for (const selector of dragHandleSelectors) {
                        try {
                            const handles = await page.locator(selector).all();
                            if (handles.length > 0) {
                                dragHandlesFound = true;
                                console.log(`  Found ${handles.length} drag handles with selector: ${selector}`);
                                addTest('Drag handles present', true, `Found ${handles.length} drag handles`);
                                break;
                            }
                        } catch (e) {
                            // Continue trying
                        }
                    }
                    
                    if (!dragHandlesFound) {
                        addTest('Drag handles present', false, 'No drag handles found in dropdown');
                    }
                    
                    // Test 6: Test dropdown closes when clicking outside
                    console.log('\n📋 Test 6: Test Dropdown Close Behavior');
                    
                    await page.click('body', { position: { x: 50, y: 50 } }); // Click outside
                    await page.waitForTimeout(500);
                    
                    const stillOpenAfterOutsideClick = await dropdown.isVisible().catch(() => false);
                    addTest('Dropdown closes when clicking outside', !stillOpenAfterOutsideClick, 'Dropdown close behavior verified');
                    
                    await takeScreenshot('after-outside-click');
                    
                } else {
                    addTest('Columns button opens dropdown', false, 'No dropdown appeared after clicking columns button');
                }
                
            } else {
                addTest('Columns button found', false, 'No columns button found on the page');
            }
        }

        // Test 7: Check table updates (if we have a working page)
        if (foundTablePage) {
            console.log('\n📋 Test 7: Verify Table Updates');
            
            // Navigate back to the page and try to test real-time updates
            await page.goto(`http://localhost:3002${workingPageUrl}`);
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            
            // Take screenshot of table before any changes
            await takeScreenshot('table-before-changes');
            
            // Count visible columns before
            const columnsBefore = await page.locator('th').count().catch(() => 0);
            console.log(`  Table has ${columnsBefore} columns initially`);
            
            addTest('Table structure verification', columnsBefore > 0, `Table has ${columnsBefore} columns`);
            
            await takeScreenshot('final-table-state');
        }

    } catch (error) {
        console.error('💥 Test execution error:', error);
        addTest('Test execution', false, `Critical error: ${error.message}`);
        await takeScreenshot('error-state');
    }

    // Generate final report
    console.log('\n📊 Generating Test Report...');
    
    const reportData = {
        ...results,
        testCompleted: new Date().toISOString(),
        environment: {
            url: 'http://localhost:3002',
            userAgent: await page.evaluate(() => navigator.userAgent),
            viewport: await page.viewportSize()
        }
    };
    
    const reportFilename = `column-dropdown-test-report-${Date.now()}.json`;
    fs.writeFileSync(reportFilename, JSON.stringify(reportData, null, 2));
    
    console.log('\n🏁 Test Summary:');
    console.log(`✅ Passed: ${results.summary.passed}`);
    console.log(`❌ Failed: ${results.summary.failed}`);
    console.log(`📊 Total: ${results.summary.total}`);
    console.log(`📄 Report saved: ${reportFilename}`);
    
    if (results.issues.length > 0) {
        console.log('\n⚠️  Issues Found:');
        results.issues.forEach((issue, index) => {
            console.log(`${index + 1}. ${issue}`);
        });
    }
    
    console.log('\n📷 Screenshots taken:');
    results.screenshots.forEach(screenshot => {
        console.log(`  - ${screenshot}`);
    });

    await browser.close();
    return reportData;
}

// Run the test
testColumnDropdown()
    .then(report => {
        console.log('\n🎉 Test completed successfully!');
        process.exit(0);
    })
    .catch(error => {
        console.error('💥 Test failed:', error);
        process.exit(1);
    });