var timeout;
const chat = require('./../js/chat');
const {
    ipcRenderer
} = require('electron');

function init() {
    setScrollBottom();
    setDrag();
    startChatReading();
}

function generateMessageView(user, msg) {
    var message = document.createElement("P");
    var userName = document.createElement("B");
    var txtMessage = document.createElement("SPAN");
    if (user.subscriber == true) {
        //SUB del canal
    }
    userName.style.color = (user["color"] == null) ? '#1CC8E2' : user["color"];
    userName.appendChild(document.createTextNode(user["display-name"] + ": "));
    userName.style.color = (user["color"] == null) ? '#1CC8E2' : user["color"];
    userName.appendChild(document.createTextNode(user["display-name"] + ": "));

    txtMessage.className = "txtMessage";
    txtMessage.appendChild(document.createTextNode(msg));

    message.appendChild(userName);
    message.appendChild(txtMessage);

    return message;
}

function removeNoDisplayableMessages() {
    var messages = document.getElementsByTagName("P");
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].getBoundingClientRect().y < 0) {
            messages[i].remove();
        }
    }
}

function innactInterval() { // Intervalo para que se oculte la ventana por inactividad
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        document.body.style.opacity = "0.3";
    }, 100000);
}

function showMessage(user, msg) {
    document.body.style.opacity = "1";
    var messagesDiv = document.getElementById("messages");
    messagesDiv.appendChild(generateMessageView(user, msg));
    setScrollBottom();
    removeNoDisplayableMessages();
    innactInterval();
}

function startChatReading() {
    chat.setOnMessageEventListener(showMessage)
    chat.startReading();
}

function setScrollBottom() {
    window.scrollTo(0, document.querySelector("#messages").scrollHeight);
}

function setDrag() {
    let button = document.getElementById("lock");
    let imglock = document.getElementById("imglock");
    if (button.value == "locked") {
        button.value = "unlocked";
        document.getElementById("arrowlock").style.display = "initial";
        imglock.src = "css/resources/unlock.png";
        ipcRenderer.send("unlock");
        setTimeout(() => {
            showMessage({
                'display-name': "MessageSystem",
                color: "#1F4C34"
            }, "Window unlocked");
        }, 500);

    } else {
        button.value = "locked";
        imglock.src = "css/resources/lock.png";
        document.getElementById("arrowlock").style.display = "none";
        ipcRenderer.send("lock");
        setTimeout(() => {
            showMessage({
                'display-name': "MessageSystem",
                color: "#1F4C34"
            }, "Window locked");
        }, 500);
    }
}