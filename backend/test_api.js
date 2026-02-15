
import http from 'http';

function testEndpoint(path) {
    console.log(`Testing endpoint: ${path}`);
    http.get(`http://localhost:5000${path}`, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log(`Response for ${path}:`);
                console.log(`Status: ${res.statusCode}`);
                console.log(`Product count: ${json.products?.length || 0}`);
                if (json.products?.length > 0) {
                    console.log(`Sample: ${json.products[0].name} (${json.products[0].category})`);
                }
            } catch (e) {
                console.log(`Error parsing response: ${data.substring(0, 100)}`);
            }
        });
    }).on('error', (err) => {
        console.log(`Error: ${err.message}`);
    });
}

testEndpoint('/api/products?category=Dairy,Bakery');
testEndpoint('/api/products?category=Dairy');
testEndpoint('/api/products?category=Bakery');
testEndpoint('/api/products');
