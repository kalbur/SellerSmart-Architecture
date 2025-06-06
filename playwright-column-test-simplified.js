const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testColumnDropdownsSimplified() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
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
  
  try {
    console.log('🚀 Starting simplified column dropdown tests on localhost:3000');
    
    // Navigate to localhost:3000
    await page.goto('http://localhost:3000', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    console.log('📍 Navigated to localhost:3000');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    await page.screenshot({ 
      path: path.join(screenshotDir, '01-homepage-initial.png'),
      fullPage: true 
    });
    
    // Check what's on the homepage - look for navigation links
    console.log('\n🔍 Examining homepage content...');
    
    // Look for any navigation links or buttons
    const links = await page.locator('a[href], button').all();
    const linkInfo = [];
    
    for (let i = 0; i < Math.min(20, links.length); i++) {
      try {
        const link = links[i];
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        const visible = await link.isVisible();
        
        if (visible && (href || text)) {
          linkInfo.push({
            text: text?.trim(),
            href: href,
            visible: visible
          });
        }
      } catch (e) {
        // Skip if we can't get info
      }
    }
    
    console.log('📋 Found navigation options:');
    linkInfo.forEach((info, i) => {
      console.log(`   ${i + 1}. "${info.text}" -> ${info.href || 'button'}`);
    });
    
    // Look for tables on current page
    const tables = await page.locator('table, [role="table"], .table, [data-table]').count();
    console.log(`\n📊 Found ${tables} table(s) on homepage`);
    
    if (tables > 0) {
      await testTablesOnPage(page, 'homepage', screenshotDir);
    }
    
    // Try to navigate to some common pages by clicking links
    const pagesToTry = [
      { text: 'inventory', href: '/inventory' },
      { text: 'orders', href: '/orders' },
      { text: 'products', href: '/products' },
      { text: 'dashboard', href: '/dashboard' },
      { text: 'data', href: '/data' }
    ];
    
    for (const pageInfo of pagesToTry) {
      console.log(`\n🎯 Trying to navigate to page with text containing "${pageInfo.text}"`);
      
      try {
        // Look for links containing the text
        const matchingLinks = await page.locator(`a:has-text("${pageInfo.text}"), button:has-text("${pageInfo.text}")`).all();
        
        if (matchingLinks.length > 0) {
          console.log(`   Found ${matchingLinks.length} matching link(s)`);
          
          const link = matchingLinks[0];
          const linkText = await link.textContent();
          console.log(`   Clicking: "${linkText}"`);
          
          await link.click();
          await page.waitForTimeout(3000); // Wait for navigation
          
          const currentUrl = page.url();
          console.log(`   Current URL: ${currentUrl}`);
          
          // Take screenshot
          await page.screenshot({ 
            path: path.join(screenshotDir, `page-${pageInfo.text}-${Date.now()}.png`),
            fullPage: true 
          });
          
          // Check for tables on this page
          const tablesOnPage = await page.locator('table, [role="table"], .table, [data-table]').count();
          console.log(`   Found ${tablesOnPage} table(s) on this page`);
          
          if (tablesOnPage > 0) {
            await testTablesOnPage(page, pageInfo.text, screenshotDir);
          }
          
        } else {
          console.log(`   No links found for "${pageInfo.text}"`);
        }
        
      } catch (e) {
        console.log(`   ❌ Error navigating to ${pageInfo.text}: ${e.message}`);
      }
    }
    
    // Try direct navigation as backup
    console.log('\n🔄 Trying direct navigation to known paths...');
    
    const directPaths = ['/inventory/data', '/orders', '/test-layout-manager'];
    
    for (const directPath of directPaths) {
      try {
        console.log(`   Trying direct navigation to: ${directPath}`);
        
        await page.goto(`http://localhost:3000${directPath}`, { 
          waitUntil: 'domcontentloaded',
          timeout: 15000 
        });
        
        await page.waitForTimeout(2000);
        
        console.log(`   ✅ Successfully navigated to ${directPath}`);
        
        // Take screenshot
        await page.screenshot({ 
          path: path.join(screenshotDir, `direct-${directPath.replace(/\//g, '_')}-${Date.now()}.png`),
          fullPage: true 
        });
        
        // Check for tables
        const tablesOnPage = await page.locator('table, [role="table"], .table, [data-table]').count();
        console.log(`   Found ${tablesOnPage} table(s) on ${directPath}`);
        
        if (tablesOnPage > 0) {
          await testTablesOnPage(page, directPath, screenshotDir);
        }
        
      } catch (e) {
        console.log(`   ❌ Direct navigation to ${directPath} failed: ${e.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Fatal error during testing:', error);
  } finally {
    await browser.close();
  }
}

async function testTablesOnPage(page, pageName, screenshotDir) {
  console.log(`\n🔍 Testing tables on ${pageName}...`);
  
  try {
    // Look for column management buttons with more specific selectors
    const columnButtonSelectors = [
      'button:has-text("Columns")',
      'button:has-text("Column")', 
      '[data-testid*="column"]',
      '.column-toggle',
      '.columns-button',
      'button[aria-label*="column"]',
      'button[title*="column"]',
      '[data-state] button', // Radix UI buttons
      '.dropdown-trigger'
    ];
    
    for (const selector of columnButtonSelectors) {
      const buttons = await page.locator(selector).count();
      if (buttons > 0) {
        console.log(`   Found ${buttons} button(s) with selector: ${selector}`);
        
        const button = page.locator(selector).first();
        const buttonText = await button.textContent();
        const isVisible = await button.isVisible();
        
        console.log(`   Button text: "${buttonText}", Visible: ${isVisible}`);
        
        if (isVisible) {
          // Test the column dropdown
          await testColumnDropdown(page, button, pageName, screenshotDir);
        }
      }
    }
    
    // Also look for any dropdowns that might already be open
    const openDropdowns = await page.locator('[data-radix-popper-content-wrapper], .dropdown-menu, [role="menu"]').count();
    if (openDropdowns > 0) {
      console.log(`   Found ${openDropdowns} potentially open dropdown(s)`);
      
      await page.screenshot({ 
        path: path.join(screenshotDir, `${pageName}-potential-dropdown-${Date.now()}.png`),
        fullPage: true 
      });
    }
    
  } catch (e) {
    console.log(`   ❌ Error testing tables on ${pageName}: ${e.message}`);
  }
}

async function testColumnDropdown(page, button, pageName, screenshotDir) {
  try {
    console.log(`   🎯 Testing column dropdown on ${pageName}`);
    
    // Click the button
    await button.click();
    console.log('     ✅ Clicked column button');
    
    await page.waitForTimeout(1000);
    
    // Take screenshot after clicking
    await page.screenshot({ 
      path: path.join(screenshotDir, `${pageName}-dropdown-opened-${Date.now()}.png`),
      fullPage: true 
    });
    
    // Look for dropdown content
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
      // Look for checkboxes
      const checkboxes = await dropdown.locator('input[type="checkbox"], [role="checkbox"]').count();
      console.log(`     Found ${checkboxes} checkbox(es) in dropdown`);
      
      if (checkboxes > 0) {
        // Test first checkbox
        const checkbox = dropdown.locator('input[type="checkbox"], [role="checkbox"]').first();
        const initialState = await checkbox.isChecked();
        
        console.log(`     🔲 Testing checkbox - initial state: ${initialState}`);
        
        await checkbox.click();
        await page.waitForTimeout(500);
        
        const newState = await checkbox.isChecked();
        const dropdownStillVisible = await dropdown.isVisible();
        
        console.log(`     New state: ${newState}, Dropdown still visible: ${dropdownStillVisible}`);
        
        // Take screenshot after checkbox click
        await page.screenshot({ 
          path: path.join(screenshotDir, `${pageName}-checkbox-clicked-${Date.now()}.png`),
          fullPage: true 
        });
      }
      
      // Look for drag handles
      const dragHandles = await dropdown.locator('[data-testid*="drag"], .drag-handle, .grip, [title*="drag"]').count();
      console.log(`     Found ${dragHandles} drag handle(s)`);
      
      // Test clicking outside to close
      await page.click('body', { position: { x: 100, y: 100 } });
      await page.waitForTimeout(500);
      
      const dropdownClosed = !(await dropdown.isVisible());
      console.log(`     Dropdown closed by click outside: ${dropdownClosed}`);
      
    } else {
      console.log('     ❌ No dropdown found after clicking button');
      
      // Try clicking outside to reset state
      await page.click('body', { position: { x: 100, y: 100 } });
      await page.waitForTimeout(500);
    }
    
  } catch (e) {
    console.log(`     ❌ Error testing column dropdown: ${e.message}`);
  }
}

// Run the simplified test
testColumnDropdownsSimplified().then(() => {
  console.log('\n✅ Simplified testing completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Simplified test failed:', error);
  process.exit(1);
});