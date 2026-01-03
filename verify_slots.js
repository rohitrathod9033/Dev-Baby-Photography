import http from 'http';

const queryDate = "2025-01-01";
const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/slots?date=${queryDate}`,
    method: 'GET',
};

console.log(`Getting slots for ${queryDate} from http://localhost:3000/api/slots...`);

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('BODY JSON:', JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('BODY (Not JSON):', data.substring(0, 500));
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
