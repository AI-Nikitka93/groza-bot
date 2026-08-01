const WebSocket = require('ws');

let reconnectCount = 0;
function connect() {
    console.log('Connecting to WS...');
    const ws = new WebSocket('wss://echo.websocket.org');
    
    ws.on('open', () => {
        console.log('WS connected. Closing forcibly to simulate drop...');
        ws.close();
    });

    ws.on('close', () => {
        console.log('WS closed event received.');
        reconnectCount++;
        if (reconnectCount >= 1) {
            console.log('[SUCCESS] Reconnect logic triggered.');
            process.exit(0);
        }
        setTimeout(connect, 1000);
    });
    
    ws.on('error', (err) => {
        console.log('WS error', err.message);
        ws.close();
    });
}
connect();
