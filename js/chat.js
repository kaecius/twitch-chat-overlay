const tmi = require('tmi.js');
const { EventEmitter } = require('events');


const opts = { channels: [] }; // Get selected one
var client;

readingEventEmitter = new EventEmitter();

var shown = false

function handleMessages(channel, user, msg, self) {
    console.info(channel);
    console.info(user);
    console.info(msg);
    readingEventEmitter.emit('message', user, msg);
}

function handleChangeChannel(channel){
    if(channel){
        stopReading();
        startReading(channel);
    }else{
        if(opts.channels){
            readingEventEmitter.emit('chat-error',{
                'display-name': "System Error",
                color: "#1F4C34"
            }, "Channel no selected");
        }
    }
}

function initClient(channel){
    opts.channels = [channel];
    client = new tmi.client(opts);
    client.on("message", handleMessages);
    client.on("change-channel",handleChangeChannel);
}

exports.startReading = function startReadingChat(channel) {
    if(channel){
        console.log("cambiando");
        client.disconnect();
        initClient(channel);
        client.connect();
    }else{
        readingEventEmitter.emit('chat-error',{
            'display-name': "System Error",
            color: "#1F4C34"
        }, "Channel no selected");
    }
}

exports.stopReading = function stopReadingChat() {
    if(opts.channels == 0){
        client.disconnect();
        opts.channels = [];
        client = null;
    }else{
        readingEventEmitter.emit('chat-error',{
            'display-name': "System Error",
            color: "#1F4C34"
        }, "Channel no selected");
    }
}

exports.reconnect = function reconnectChat() {
    if (client.readyState() != 'OPEN' && client.readyState() != 'CONNECTING') {
        client.connect();
    }
}

exports.setOnMessageEventListener = function setOnMessageEventListener(f) {
    readingEventEmitter.on("message", f);
}

exports.setChatErrorEventListener = function setChatErrorEventListener(f){
    readingEventEmitter.on("chat-error",f);
}