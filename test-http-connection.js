const http = require('http');

function testPort(port) {
    return new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}`, (res) => {
            console.log(`✅ Port ${port}: HTTP ${res.statusCode} ${res.statusMessage}`);
            console.log(`   Headers:`, res.headers);
            resolve({ port, status: res.statusCode, headers: res.headers });
        });
        
        req.on('error', (err) => {
            console.log(`❌ Port ${port}: ${err.message}`);
            reject({ port, error: err.message });
        });
        
        req.setTimeout(5000, () => {
            req.abort();
            console.log(`⏰ Port ${port}: Timeout`);
            reject({ port, error: 'Timeout' });
        });
    });
}

async function testAllPorts() {
    console.log('Testing HTTP connections to various ports...');
    
    const ports = [3000, 3001, 3002, 3003, 3004];
    
    for (const port of ports) {
        try {
            await testPort(port);
        } catch (error) {
            // Error already logged in testPort
        }
    }
}

testAllPorts();