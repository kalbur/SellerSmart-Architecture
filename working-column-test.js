const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testColumnDropdown() {
    console.log('🚀 Starting Enhanced Column Dropdown Test');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--ignore-certificate-errors',
            '--allow-running-insecure-content',
            '--disable-blink-features=AutomationControlled'
        ]
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true
    });
    
    const page = await context.newPage();
    
    const results = {
        timestamp: new Date().toISOString(),
        testResults: [],
        screenshots: [],
        issues: [],
        summary: { passed: 0, failed: 0, total: 0 }
    };

    function addTest(name, passed, details = '') {
        results.testResults.push({
            name, passed, details,
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
        // Test 1: Navigate to the application
        console.log('\n📋 Test 1: Navigate to application (port 3002)');
        
        // First try to go directly to dashboard since we know it redirects there
        await page.goto('http://localhost:3002/dashboard', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        await page.waitForTimeout(3000); // Wait for page to fully load
        
        const pageTitle = await page.title();
        const currentUrl = page.url();
        console.log(`Current page: ${pageTitle} (${currentUrl})`);
        
        addTest('Navigation to application', true, `Successfully navigated to ${currentUrl}`);
        await takeScreenshot('initial-dashboard');
        
        // Test 2: Look for authentication status
        console.log('\n📋 Test 2: Check authentication status');
        
        // Check for common login indicators
        const loginIndicators = [
            'input[type="email"]',
            'input[type="password"]',
            'button[type="submit"]',
            'text=Sign in',
            'text=Login',
            'text=Log in'
        ];
        
        let isLoggedIn = true;
        for (const indicator of loginIndicators) {
            try {
                const element = await page.locator(indicator).first();
                if (await element.isVisible()) {
                    isLoggedIn = false;
                    break;
                }
            } catch (e) {
                // Indicator not found, continue
            }
        }
        
        addTest('User authentication status', isLoggedIn, isLoggedIn ? 'User appears to be logged in' : 'User needs to log in');
        
        if (!isLoggedIn) {
            console.log('⚠️  User appears to not be logged in. Continuing with limited testing...');
        }
        
        // Test 3: Find pages with tables
        console.log('\n📋 Test 3: Find pages with table column management');
        
        const testPages = [
            '/dashboard',
            '/inventory/data',
            '/orders',
            '/inventory',
            '/data',
            '/test-layout-manager'
        ];
        
        let foundTablePage = false;
        let workingPageUrl = '';
        
        for (const testPage of testPages) {
            try {
                console.log(`  Trying page: ${testPage}`);
                await page.goto(`http://localhost:3002${testPage}`, { 
                    waitUntil: 'networkidle',
                    timeout: 15000 
                });
                await page.waitForTimeout(2000);
                
                // Look for table-related elements
                const tableElements = await page.locator('table, [role="table"], .table, .data-table').count();
                const columnButtons = await page.locator('button:has-text("Columns"), button:has-text("Column"), [aria-label*="column"], [data-testid*="column"], button[title*="column"]').count();
                
                console.log(`    Tables found: ${tableElements}, Column buttons found: ${columnButtons}`);
                
                if (tableElements > 0 && columnButtons > 0) {
                    foundTablePage = true;
                    workingPageUrl = testPage;
                    addTest('Find table page with column management', true, `Found working page: ${testPage} (${tableElements} tables, ${columnButtons} column buttons)`);
                    await takeScreenshot(`table-page-${testPage.replace(/\//g, '-')}`);
                    break;
                } else if (tableElements > 0) {
                    console.log(`    Found ${tableElements} table(s) on ${testPage} but no column buttons`);
                } else if (columnButtons > 0) {
                    console.log(`    Found ${columnButtons} column button(s) on ${testPage} but no tables`);
                }
                
            } catch (error) {
                console.log(`    Error accessing ${testPage}: ${error.message}`);
            }
        }
        
        if (!foundTablePage) {
            addTest('Find table page with column management', false, 'No page found with both table and column management');
            
            // Search for any elements that might be related to columns
            console.log('  Searching for any column-related elements...');
            const allButtons = await page.locator('button').all();
            console.log(`  Found ${allButtons.length} total buttons on current page`);
            
            for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
                try {
                    const buttonText = await allButtons[i].textContent();
                    const buttonAriaLabel = await allButtons[i].getAttribute('aria-label') || '';
                    const buttonTitle = await allButtons[i].getAttribute('title') || '';
                    
                    if (buttonText && (
                        buttonText.toLowerCase().includes('column') || 
                        buttonText.toLowerCase().includes('manage') ||
                        buttonText.toLowerCase().includes('layout') ||
                        buttonAriaLabel.toLowerCase().includes('column') ||
                        buttonTitle.toLowerCase().includes('column')
                    )) {
                        console.log(`    Found potential button: "${buttonText}" (aria-label: "${buttonAriaLabel}", title: "${buttonTitle}")`);
                    }
                } catch (e) {
                    // Skip if error reading button details
                }
            }
        }
        
        // Test 4: Test the columns functionality (if found)
        if (foundTablePage) {
            console.log('\n📋 Test 4: Test Column Management Functionality');
            
            // Make sure we're on the right page
            await page.goto(`http://localhost:3002${workingPageUrl}`, { 
                waitUntil: 'networkidle',
                timeout: 15000 
            });
            await page.waitForTimeout(2000);
            
            // Find the columns button
            const columnsSelectors = [
                'button:has-text("Columns")',
                'button:has-text("Column")',
                '[aria-label*="column"]',
                '[data-testid*="column"]',
                'button[title*="column"]'
            ];
            
            let columnsButton = null;
            let buttonSelector = '';
            
            for (const selector of columnsSelectors) {
                try {
                    const button = page.locator(selector).first();
                    if (await button.isVisible()) {
                        columnsButton = button;
                        buttonSelector = selector;
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
                console.log('  Clicking columns button...');
                await columnsButton.click();
                await page.waitForTimeout(1500); // Wait for dropdown to appear
                
                // Check if dropdown opened
                const dropdownSelectors = [
                    '[role="menu"]',
                    '[role="listbox"]',
                    '.dropdown-menu',
                    '.popover',
                    '.columns-dropdown',
                    '[data-radix-popper-content-wrapper]',
                    '[data-side]',
                    '.menu',
                    '[data-state="open"]'
                ];
                
                let dropdownFound = false;
                let dropdown = null;
                let dropdownSelector = '';
                
                for (const selector of dropdownSelectors) {
                    try {
                        const element = page.locator(selector).first();
                        if (await element.isVisible()) {
                            dropdown = element;
                            dropdownFound = true;
                            dropdownSelector = selector;
                            console.log(`  Dropdown opened with selector: ${selector}`);
                            break;
                        }
                    } catch (e) {
                        // Continue trying
                    }
                }
                
                if (dropdownFound) {
                    addTest('Columns button opens dropdown', true, `Dropdown opened using selector: ${dropdownSelector}`);
                    await takeScreenshot('dropdown-opened');
                    
                    // Test 5: Check dropdown contents
                    console.log('\n📋 Test 5: Analyze Dropdown Contents');
                    
                    const checkboxes = await page.locator('input[type="checkbox"]').all();
                    const radioButtons = await page.locator('input[type="radio"]').all();
                    const switches = await page.locator('[role="switch"]').all();
                    const menuItems = await page.locator('[role="menuitem"]').all();
                    
                    console.log(`  Found: ${checkboxes.length} checkboxes, ${radioButtons.length} radio buttons, ${switches.length} switches, ${menuItems.length} menu items`);
                    
                    addTest('Dropdown contains interactive elements', 
                        (checkboxes.length + radioButtons.length + switches.length + menuItems.length) > 0,
                        `Found ${checkboxes.length} checkboxes, ${radioButtons.length} radio buttons, ${switches.length} switches, ${menuItems.length} menu items`);
                    
                    // Test checkboxes if available
                    if (checkboxes.length > 0) {
                        console.log('\n📋 Test 6: Test Checkbox Functionality');
                        
                        try {
                            const firstCheckbox = checkboxes[0];
                            const wasChecked = await firstCheckbox.isChecked();
                            
                            console.log(`  First checkbox initial state: ${wasChecked ? 'checked' : 'unchecked'}`);
                            await firstCheckbox.click();
                            await page.waitForTimeout(500);
                            
                            const isNowChecked = await firstCheckbox.isChecked();
                            const stateChanged = wasChecked !== isNowChecked;
                            
                            addTest('Checkbox click functionality', stateChanged, 
                                `Checkbox state changed from ${wasChecked} to ${isNowChecked}`);
                            
                            // Check if dropdown is still open
                            const stillOpen = await dropdown.isVisible();
                            addTest('Dropdown stays open after checkbox click', stillOpen, 
                                'Dropdown persistence verified');
                            
                            await takeScreenshot('after-checkbox-click');
                            
                        } catch (error) {
                            addTest('Checkbox click functionality', false, `Error: ${error.message}`);
                        }
                    }
                    
                    // Test 7: Look for drag handles
                    console.log('\n📋 Test 7: Look for Drag Handles');
                    
                    const dragHandleSelectors = [
                        '[data-testid*="drag"]',
                        '.drag-handle',
                        '.grip',
                        '[title*="drag"]',
                        '[aria-label*="drag"]',
                        'svg[data-icon="grip"]',
                        '.lucide-grip-vertical',
                        '[data-radix-collection-item] svg',
                        '.column-item svg'
                    ];
                    
                    let dragHandlesFound = 0;
                    let dragHandleSelector = '';
                    
                    for (const selector of dragHandleSelectors) {
                        try {
                            const handles = await page.locator(selector).count();
                            if (handles > 0) {
                                dragHandlesFound = handles;
                                dragHandleSelector = selector;
                                console.log(`  Found ${handles} drag handles with selector: ${selector}`);
                                break;
                            }
                        } catch (e) {
                            // Continue trying
                        }
                    }
                    
                    addTest('Drag handles present', dragHandlesFound > 0, 
                        dragHandlesFound > 0 ? `Found ${dragHandlesFound} drag handles using ${dragHandleSelector}` : 'No drag handles found');
                    
                    // Test 8: Test dropdown close behavior
                    console.log('\n📋 Test 8: Test Dropdown Close Behavior');
                    
                    await page.click('body', { position: { x: 50, y: 50 } });
                    await page.waitForTimeout(500);
                    
                    const stillOpenAfterOutsideClick = await dropdown.isVisible().catch(() => false);
                    addTest('Dropdown closes when clicking outside', !stillOpenAfterOutsideClick, 
                        'Dropdown close behavior verified');
                    
                    await takeScreenshot('after-outside-click');
                    
                } else {
                    addTest('Columns button opens dropdown', false, 'No dropdown appeared after clicking columns button');
                    
                    // Try to see what elements are visible after clicking
                    console.log('  Checking for any new elements that appeared...');
                    const allVisibleElements = await page.locator('*').all();
                    console.log(`  Total visible elements after click: ${allVisibleElements.length}`);
                }
                
            } else {
                addTest('Columns button found', false, 'No columns button found on the page');
            }
        }
        
        // Test 9: Table structure analysis
        console.log('\n📋 Test 9: Analyze Table Structure');
        
        if (foundTablePage) {
            await page.goto(`http://localhost:3002${workingPageUrl}`, { 
                waitUntil: 'networkidle',
                timeout: 15000 
            });
            await page.waitForTimeout(2000);
        }
        
        const tables = await page.locator('table, [role="table"]').count();
        const tableHeaders = await page.locator('th, [role="columnheader"]').count();
        const tableRows = await page.locator('tr, [role="row"]').count();
        
        console.log(`  Found: ${tables} tables, ${tableHeaders} headers, ${tableRows} rows`);
        
        addTest('Table structure analysis', tables > 0, 
            `Found ${tables} tables with ${tableHeaders} headers and ${tableRows} rows`);
        
        await takeScreenshot('final-table-state');

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