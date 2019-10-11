const tmi = require('tmi.js');
const { EventEmitter } = require('events');


const opts = { channels: ["pepiinero"] }; // Get selected one
const client = new tmi.client(opts);

readingEventEmitter = new EventEmitter();


client.on("message", handleMessages);

var shown = false

function handleMessages(channel, user, msg, self) {
    readingEventEmitter.emit('message', user, msg);
}


exports.startReading = function startReadingChat() {
    client.connect();
}

exports.stopReading = function stopReadingChat() {
    client.disconnect();
}

exports.reconnect = function reconnectChat() {
    if (client.readyState() != 'OPEN' && client.readyState() != 'CONNECTING') {
        client.connect();
    }
}

exports.setOnMessageEventListener = function setOnMessageEventListener(f) {
    readingEventEmitter.on("message", f);
}