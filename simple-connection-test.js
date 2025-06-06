const { chromium } = require('playwright');

async function testConnection() {
    console.log('Testing connection to SellerSmart-Web...');
    
    const browser = await chromium.launch({ 
        headless: false, 
        args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'] 
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        console.log('Attempting to connect to http://localhost:3002...');
        await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
        console.log('✅ Successfully connected!');
        
        const title = await page.title();
        const url = page.url();
        console.log(`Page title: ${title}`);
        console.log(`Current URL: ${url}`);
        
        // Take a screenshot
        await page.screenshot({ path: 'connection-test.png', fullPage: true });
        console.log('📷 Screenshot saved: connection-test.png');
        
        await page.waitForTimeout(3000); // Wait 3 seconds to see the page
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
    
    await browser.close();
}

testConnection();