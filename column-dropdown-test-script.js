/**
 * Column Dropdown Functionality Test Script
 * 
 * Run this script in the browser console on:
 * - http://localhost:3003/test-layout-manager
 * - http://localhost:3003/inventory/data
 * 
 * Instructions:
 * 1. Open browser dev tools (F12)
 * 2. Navigate to Console tab
 * 3. Paste this script and press Enter
 * 4. Follow the prompts in the console
 */

(function() {
    console.log('🧪 Starting Column Dropdown Functionality Tests...');
    console.log('📍 Current URL:', window.location.href);
    
    // Test results storage
    const testResults = {
        passed: 0,
        failed: 0,
        tests: []
    };
    
    function logTest(testName, passed, details = '') {
        const status = passed ? '✅ PASS' : '❌ FAIL';
        console.log(`${status}: ${testName}${details ? ' - ' + details : ''}`);
        
        testResults.tests.push({ name: testName, passed, details });
        if (passed) testResults.passed++;
        else testResults.failed++;
    }
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Test 1: Check if Columns button exists
    function testColumnsButtonExists() {
        const columnsButtons = document.querySelectorAll('button:has(svg), button');
        const columnsButton = Array.from(columnsButtons).find(btn => 
            btn.textContent.trim().toLowerCase().includes('columns') ||
            btn.querySelector('svg[data-lucide="columns"]') ||
            btn.querySelector('svg[data-lucide="settings-2"]')
        );
        
        logTest('Columns button exists', !!columnsButton, 
            columnsButton ? `Found: "${columnsButton.textContent.trim()}"` : 'Not found');
        
        return columnsButton;
    }
    
    // Test 2: Check if dropdown opens
    async function testDropdownOpens(columnsButton) {
        if (!columnsButton) return false;
        
        // Click the button
        columnsButton.click();
        await sleep(500); // Wait for dropdown to appear
        
        // Check if dropdown content is visible
        const dropdownContent = document.querySelector('[role="menu"], [data-radix-popper-content-wrapper]');
        const isVisible = dropdownContent && dropdownContent.offsetParent !== null;
        
        logTest('Dropdown opens when clicking Columns button', isVisible);
        
        return dropdownContent;
    }
    
    // Test 3: Check if column items with checkboxes exist
    function testColumnItemsExist(dropdownContent) {
        if (!dropdownContent) return [];
        
        const checkboxes = dropdownContent.querySelectorAll('input[type="checkbox"], [role="checkbox"]');
        const columnItems = dropdownContent.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"]');
        
        logTest('Column items with checkboxes exist', checkboxes.length > 0 || columnItems.length > 0, 
            `Found ${checkboxes.length} checkboxes, ${columnItems.length} menu items`);
        
        return Array.from(checkboxes);
    }
    
    // Test 4: Check if drag handles exist
    function testDragHandlesExist(dropdownContent) {
        if (!dropdownContent) return [];
        
        const gripIcons = dropdownContent.querySelectorAll('svg[data-lucide="grip-vertical"], .grip-vertical');
        const dragHandles = dropdownContent.querySelectorAll('[class*="cursor-grab"], [class*="drag"]');
        
        logTest('Drag handles (grip icons) exist', gripIcons.length > 0 || dragHandles.length > 0,
            `Found ${gripIcons.length} grip icons, ${dragHandles.length} drag handles`);
        
        return Array.from(gripIcons);
    }
    
    // Test 5: Test checkbox interaction (dropdown should stay open)
    async function testCheckboxInteraction(checkboxes, dropdownContent) {
        if (!checkboxes.length || !dropdownContent) return false;
        
        const originalDisplay = getComputedStyle(dropdownContent).display;
        const firstCheckbox = checkboxes[0];
        
        // Click first checkbox
        firstCheckbox.click();
        await sleep(200);
        
        // Check if dropdown is still visible
        const stillVisible = dropdownContent.offsetParent !== null && 
                            getComputedStyle(dropdownContent).display !== 'none';
        
        logTest('Dropdown stays open after checkbox click', stillVisible);
        
        return stillVisible;
    }
    
    // Test 6: Check table existence and columns
    function testTableExists() {
        const tables = document.querySelectorAll('table, [role="table"]');
        const tableWrapper = document.querySelector('[class*="table"], .tanstack-table');
        
        logTest('Table exists on page', tables.length > 0 || !!tableWrapper,
            `Found ${tables.length} tables`);
        
        if (tables.length > 0) {
            const firstTable = tables[0];
            const headers = firstTable.querySelectorAll('th, [role="columnheader"]');
            logTest('Table has column headers', headers.length > 0,
                `Found ${headers.length} column headers`);
        }
        
        return tables.length > 0;
    }
    
    // Test 7: Check for dropdown close on outside click
    async function testDropdownClosesOnOutsideClick(dropdownContent) {
        if (!dropdownContent) return false;
        
        // Click outside the dropdown (on body)
        document.body.click();
        await sleep(300);
        
        // Check if dropdown is now hidden
        const isHidden = dropdownContent.offsetParent === null || 
                        getComputedStyle(dropdownContent).display === 'none';
        
        logTest('Dropdown closes when clicking outside', isHidden);
        
        return isHidden;
    }
    
    // Main test execution
    async function runTests() {
        console.log('\n📋 Running automated tests...\n');
        
        // Test 1: Button exists
        const columnsButton = testColumnsButtonExists();
        
        if (!columnsButton) {
            console.log('\n❌ Cannot proceed with tests - Columns button not found');
            console.log('💡 Make sure you are on a page with column management functionality');
            return;
        }
        
        // Test 2: Dropdown opens
        const dropdownContent = await testDropdownOpens(columnsButton);
        
        if (!dropdownContent) {
            console.log('\n❌ Cannot proceed with tests - Dropdown does not open');
            return;
        }
        
        // Test 3: Column items exist
        const checkboxes = testColumnItemsExist(dropdownContent);
        
        // Test 4: Drag handles exist
        testDragHandlesExist(dropdownContent);
        
        // Test 5: Checkbox interaction
        if (checkboxes.length > 0) {
            await testCheckboxInteraction(checkboxes, dropdownContent);
        }
        
        // Test 6: Table exists
        testTableExists();
        
        // Test 7: Outside click closes dropdown
        if (dropdownContent.offsetParent !== null) {
            await testDropdownClosesOnOutsideClick(dropdownContent);
        }
        
        // Show results
        console.log('\n📊 Test Results Summary:');
        console.log(`✅ Passed: ${testResults.passed}`);
        console.log(`❌ Failed: ${testResults.failed}`);
        console.log(`📈 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
        
        if (testResults.failed > 0) {
            console.log('\n❌ Failed Tests:');
            testResults.tests.filter(t => !t.passed).forEach(test => {
                console.log(`   • ${test.name}${test.details ? ' - ' + test.details : ''}`);
            });
        }
        
        console.log('\n🔍 Manual Testing Recommendations:');
        console.log('1. Test drag & drop functionality by dragging grip handles');
        console.log('2. Verify table columns reorder when items are dragged');
        console.log('3. Test on mobile devices for touch interactions');
        console.log('4. Try rapid checkbox clicking to ensure dropdown stability');
        console.log('5. Test with keyboard navigation (Tab, Enter, Escape)');
        
        return testResults;
    }
    
    // Manual testing helpers
    window.columnDropdownTests = {
        // Highlight columns button
        highlightColumnsButton() {
            const button = testColumnsButtonExists();
            if (button) {
                button.style.outline = '3px solid red';
                button.style.outlineOffset = '2px';
                setTimeout(() => {
                    button.style.outline = '';
                    button.style.outlineOffset = '';
                }, 3000);
                console.log('🎯 Columns button highlighted for 3 seconds');
            }
        },
        
        // Force open dropdown for inspection
        async openDropdown() {
            const button = testColumnsButtonExists();
            if (button) {
                button.click();
                await sleep(500);
                console.log('📂 Dropdown opened - inspect in Elements tab');
            }
        },
        
        // Test drag simulation
        simulateDrag() {
            console.log('🖱️ Manual drag test:');
            console.log('1. Find grip handles (⋮⋮) in the dropdown');
            console.log('2. Click and drag them to reorder columns');
            console.log('3. Verify table columns reorder in real-time');
        },
        
        // Show all interactive elements
        highlightInteractiveElements() {
            const dropdown = document.querySelector('[role="menu"], [data-radix-popper-content-wrapper]');
            if (dropdown) {
                const checkboxes = dropdown.querySelectorAll('input[type="checkbox"], [role="checkbox"]');
                const grips = dropdown.querySelectorAll('svg[data-lucide="grip-vertical"]');
                
                checkboxes.forEach(cb => {
                    cb.style.outline = '2px solid blue';
                    cb.style.outlineOffset = '1px';
                });
                
                grips.forEach(grip => {
                    grip.style.outline = '2px solid green';
                    grip.style.outlineOffset = '1px';
                });
                
                setTimeout(() => {
                    checkboxes.forEach(cb => {
                        cb.style.outline = '';
                        cb.style.outlineOffset = '';
                    });
                    grips.forEach(grip => {
                        grip.style.outline = '';
                        grip.style.outlineOffset = '';
                    });
                }, 5000);
                
                console.log('🎨 Interactive elements highlighted:');
                console.log(`   🔵 ${checkboxes.length} checkboxes (blue outline)`);
                console.log(`   🟢 ${grips.length} drag handles (green outline)`);
            }
        }
    };
    
    // Start tests
    runTests();
    
    // Show available manual helpers
    console.log('\n🛠️ Manual Testing Helpers Available:');
    console.log('• columnDropdownTests.highlightColumnsButton() - Highlight the columns button');
    console.log('• columnDropdownTests.openDropdown() - Force open the dropdown');
    console.log('• columnDropdownTests.simulateDrag() - Instructions for drag testing');
    console.log('• columnDropdownTests.highlightInteractiveElements() - Highlight all interactive elements');
    
})();