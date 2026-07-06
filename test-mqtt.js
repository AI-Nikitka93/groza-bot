const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://blitzortung.ha.sed.pl:1883');

client.on('connect', () => {
    console.log('Connected to MQTT!');
    client.subscribe('#', (err) => { // Subscribe to all topics to test
        if (!err) console.log('Subscribed to all topics');
        else console.error('Subscribe error:', err);
    });
});

client.on('message', (topic, message) => {
    console.log(`Topic: ${topic}, Message: ${message.toString()}`);
    process.exit(0);
});

client.on('error', (err) => {
    console.error('MQTT error:', err);
    process.exit(1);
});
