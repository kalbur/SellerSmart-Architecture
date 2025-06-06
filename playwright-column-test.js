const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testColumnDropdowns() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down for better observation
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  // Create screenshots directory
  const screenshotDir = '/Users/kal/GitHub/SellerSmart-Architecture/column-test-screenshots';
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  const results = {
    pagesWithTables: [],
    columnDropdownTests: [],
    errors: []
  };
  
  try {
    console.log('🚀 Starting column dropdown tests on localhost:3000');
    
    // Navigate to localhost:3000
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('📍 Navigated to localhost:3000');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: path.join(screenshotDir, '01-homepage.png'),
      fullPage: true 
    });
    
    // List of pages to test
    const pagesToTest = [
      '/',
      '/inventory/data',
      '/orders',
      '/test-layout-manager',
      '/dashboard',
      '/products',
      '/analytics',
      '/settings'
    ];
    
    for (let i = 0; i < pagesToTest.length; i++) {
      const testPage = pagesToTest[i];
      console.log(`\n🔍 Testing page: ${testPage}`);
      
      try {
        // Navigate to the page
        await page.goto(`http://localhost:3000${testPage}`, { 
          waitUntil: 'networkidle',
          timeout: 10000 
        });
        
        // Wait a moment for page to settle
        await page.waitForTimeout(2000);
        
        // Take screenshot of the page
        await page.screenshot({ 
          path: path.join(screenshotDir, `${String(i+2).padStart(2, '0')}-page-${testPage.replace(/\//g, '_')}.png`),
          fullPage: true 
        });
        
        // Look for tables
        const tables = await page.locator('table, [role="table"], .table, [data-table]').count();
        console.log(`   Found ${tables} table(s) on ${testPage}`);
        
        if (tables > 0) {
          results.pagesWithTables.push({
            page: testPage,
            tableCount: tables
          });
          
          // Look for column management buttons
          const columnButtons = await page.locator('button:has-text("Columns"), button:has-text("Column"), [data-testid*="column"], .column-toggle, .columns-button').count();
          console.log(`   Found ${columnButtons} column button(s)`);
          
          if (columnButtons > 0) {
            // Test each column button
            const columnButtonElements = await page.locator('button:has-text("Columns"), button:has-text("Column"), [data-testid*="column"], .column-toggle, .columns-button').all();
            
            for (let j = 0; j < columnButtonElements.length; j++) {
              const button = columnButtonElements[j];
              
              try {
                console.log(`   🎯 Testing column button ${j + 1}`);
                
                // Get button info
                const buttonText = await button.textContent();
                const buttonVisible = await button.isVisible();
                
                console.log(`     Button text: "${buttonText}", Visible: ${buttonVisible}`);
                
                if (!buttonVisible) continue;
                
                // Click the column button
                await button.click();
                console.log('     ✅ Clicked column button');
                
                // Wait for dropdown to appear
                await page.waitForTimeout(1000);
                
                // Take screenshot of opened dropdown
                await page.screenshot({ 
                  path: path.join(screenshotDir, `${String(i+2).padStart(2, '0')}-${testPage.replace(/\//g, '_')}-dropdown-${j+1}-opened.png`),
                  fullPage: true 
                });
                
                // Look for dropdown/popover content
                const dropdownSelectors = [
                  '[data-radix-popper-content-wrapper]',
                  '.dropdown-menu',
                  '.popover',
                  '[role="menu"]',
                  '[role="listbox"]',
                  '.column-selector',
                  '.columns-dropdown'
                ];
                
                let dropdown = null;
                for (const selector of dropdownSelectors) {
                  const element = page.locator(selector).first();
                  if (await element.isVisible()) {
                    dropdown = element;
                    console.log(`     📋 Found dropdown with selector: ${selector}`);
                    break;
                  }
                }
                
                if (dropdown) {
                  // Look for checkboxes in the dropdown
                  const checkboxes = await dropdown.locator('input[type="checkbox"], [role="checkbox"]').count();
                  console.log(`     Found ${checkboxes} checkbox(es) in dropdown`);
                  
                  const testResult = {
                    page: testPage,
                    buttonIndex: j + 1,
                    buttonText: buttonText,
                    dropdownFound: true,
                    checkboxCount: checkboxes,
                    tests: {}
                  };
                  
                  if (checkboxes > 0) {
                    // Test clicking checkboxes
                    const checkboxElements = await dropdown.locator('input[type="checkbox"], [role="checkbox"]').all();
                    
                    for (let k = 0; k < Math.min(3, checkboxElements.length); k++) {
                      const checkbox = checkboxElements[k];
                      
                      try {
                        console.log(`     🔲 Testing checkbox ${k + 1}`);
                        
                        const isChecked = await checkbox.isChecked();
                        console.log(`       Initial state: ${isChecked ? 'checked' : 'unchecked'}`);
                        
                        // Click the checkbox
                        await checkbox.click();
                        await page.waitForTimeout(500);
                        
                        const newState = await checkbox.isChecked();
                        console.log(`       New state: ${newState ? 'checked' : 'unchecked'}`);
                        
                        // Check if dropdown is still visible
                        const dropdownStillVisible = await dropdown.isVisible();
                        console.log(`       Dropdown still visible: ${dropdownStillVisible}`);
                        
                        testResult.tests[`checkbox_${k + 1}`] = {
                          initialState: isChecked,
                          newState: newState,
                          dropdownStillVisible: dropdownStillVisible,
                          stateChanged: isChecked !== newState
                        };
                        
                        // Take screenshot after checkbox interaction
                        await page.screenshot({ 
                          path: path.join(screenshotDir, `${String(i+2).padStart(2, '0')}-${testPage.replace(/\//g, '_')}-checkbox-${j+1}-${k+1}-clicked.png`),
                          fullPage: true 
                        });
                        
                      } catch (checkboxError) {
                        console.log(`       ❌ Error testing checkbox ${k + 1}: ${checkboxError.message}`);
                        testResult.tests[`checkbox_${k + 1}`] = {
                          error: checkboxError.message
                        };
                      }
                    }
                  }
                  
                  // Look for drag handles
                  const dragHandles = await dropdown.locator('[data-testid*="drag"], .drag-handle, .grip, [title*="drag"], [aria-label*="drag"]').count();
                  console.log(`     Found ${dragHandles} drag handle(s)`);
                  
                  if (dragHandles > 0) {
                    testResult.dragHandleCount = dragHandles;
                    console.log('     🤏 Testing drag functionality');
                    
                    try {
                      const dragHandle = dropdown.locator('[data-testid*="drag"], .drag-handle, .grip, [title*="drag"], [aria-label*="drag"]').first();
                      const dragBox = await dragHandle.boundingBox();
                      
                      if (dragBox) {
                        // Attempt to drag
                        await page.mouse.move(dragBox.x + dragBox.width/2, dragBox.y + dragBox.height/2);
                        await page.mouse.down();
                        await page.mouse.move(dragBox.x + dragBox.width/2, dragBox.y + dragBox.height/2 + 50);
                        await page.mouse.up();
                        
                        await page.waitForTimeout(500);
                        
                        // Take screenshot after drag attempt
                        await page.screenshot({ 
                          path: path.join(screenshotDir, `${String(i+2).padStart(2, '0')}-${testPage.replace(/\//g, '_')}-drag-${j+1}-attempted.png`),
                          fullPage: true 
                        });
                        
                        testResult.tests.dragTest = {
                          attempted: true,
                          dropdownStillVisible: await dropdown.isVisible()
                        };
                        
                        console.log('     ✅ Drag test attempted');
                      }
                    } catch (dragError) {
                      console.log(`     ❌ Error testing drag: ${dragError.message}`);
                      testResult.tests.dragTest = {
                        error: dragError.message
                      };
                    }
                  }
                  
                  // Test clicking outside to close dropdown
                  console.log('     🎯 Testing click outside to close dropdown');
                  await page.click('body', { position: { x: 100, y: 100 } });
                  await page.waitForTimeout(500);
                  
                  const dropdownClosedByClickOutside = !(await dropdown.isVisible());
                  testResult.tests.clickOutsideClose = dropdownClosedByClickOutside;
                  console.log(`     Dropdown closed by click outside: ${dropdownClosedByClickOutside}`);
                  
                  // Take final screenshot
                  await page.screenshot({ 
                    path: path.join(screenshotDir, `${String(i+2).padStart(2, '0')}-${testPage.replace(/\//g, '_')}-dropdown-${j+1}-final.png`),
                    fullPage: true 
                  });
                  
                  results.columnDropdownTests.push(testResult);
                  
                } else {
                  console.log('     ❌ No dropdown found after clicking button');
                  results.columnDropdownTests.push({
                    page: testPage,
                    buttonIndex: j + 1,
                    buttonText: buttonText,
                    dropdownFound: false,
                    error: 'No dropdown found after clicking'
                  });
                  
                  // Click outside to ensure we're in clean state
                  await page.click('body', { position: { x: 100, y: 100 } });
                  await page.waitForTimeout(500);
                }
                
              } catch (buttonError) {
                console.log(`   ❌ Error testing column button ${j + 1}: ${buttonError.message}`);
                results.columnDropdownTests.push({
                  page: testPage,
                  buttonIndex: j + 1,
                  error: buttonError.message
                });
              }
            }
          } else {
            console.log('   ⚠️  No column management buttons found');
          }
        }
        
      } catch (pageError) {
        console.log(`❌ Error testing page ${testPage}: ${pageError.message}`);
        results.errors.push({
          page: testPage,
          error: pageError.message
        });
      }
    }
    
    // Generate summary report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalPagesTest: pagesToTest.length,
        pagesWithTables: results.pagesWithTables.length,
        totalColumnDropdowns: results.columnDropdownTests.length,
        errors: results.errors.length
      },
      results: results
    };
    
    // Save report
    const reportPath = path.join(screenshotDir, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Test Summary:');
    console.log(`   Pages tested: ${pagesToTest.length}`);
    console.log(`   Pages with tables: ${results.pagesWithTables.length}`);
    console.log(`   Column dropdowns tested: ${results.columnDropdownTests.length}`);
    console.log(`   Errors encountered: ${results.errors.length}`);
    console.log(`\n📸 Screenshots saved to: ${screenshotDir}`);
    console.log(`📄 Report saved to: ${reportPath}`);
    
    return report;
    
  } catch (error) {
    console.error('❌ Fatal error during testing:', error);
    results.errors.push({
      type: 'fatal',
      error: error.message,
      stack: error.stack
    });
    return results;
  } finally {
    await browser.close();
  }
}

// Run the test
testColumnDropdowns().then(report => {
  console.log('\n✅ Testing completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});