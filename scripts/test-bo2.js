const WebSocket = require('ws');

function testPayload(payload, duration) {
    return new Promise(resolve => {
        const ws = new WebSocket('wss://ws1.blitzortung.org/');
        let strikes = 0;
        ws.on('open', () => {
            ws.send(JSON.stringify(payload));
        });
        ws.on('message', () => strikes++);
        setTimeout(() => {
            ws.close();
            resolve(strikes);
        }, duration);
    });
}

(async () => {
    const s1 = await testPayload({a: 111}, 5000);
    console.log('{a: 111} ->', s1);
    
    // Test region bitmask 255 (all 8 bits)
    const s2 = await testPayload({a: 255}, 5000);
    console.log('{a: 255} ->', s2);
    
    // Test what blitzortungapi does
    const s3 = await testPayload({time: 0}, 5000);
    console.log('{time: 0} ->', s3);
})();
