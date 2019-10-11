const {ipcRenderer} = require('electron')
const properties = require('./../js/properties.js')
const chat = require('./../js/chat.js')

var data = new properties.UserSettingsStore();
var shown = false;

function showAddChannel() {
    if(!shown){
        document.getElementById("channelName").style.display = "block";
        shown=true;
    }else{
        let value = document.getElementById("channelName").value;
        if(value){
            console.info(data);
            let tmp = data.getValue('channels');
            tmp.push(value);
            data.setValue('channels',tmp);
            loadChannels()
        }
        document.getElementById("channelName").value = "";
        document.getElementById("channelName").style.display = "none";
        shown = false;
    }
}

function closeWindow() {
    ipcRenderer.send('config', false);
}

function init() {
   loadChannels();
}

function loadChannels() {
    let channels =data.getValue('channels');
        let select =  document.getElementById("channelSelect");
        let selected = data.getValue("selected");
        for(let c in channels){
            let option = document.createElement("OPTION");
            option.innerHTML = channels[c];
            option.value = channels[c];
            option.addEventListener('click', ()=>{ changeChannel(channels[c])})
            if(channels[c]===selected) option.setAttribute("selected","selected");
            select.appendChild(option);
        }
}
function changeChannel(channel){
    chat.startReading(channel);
    data.setValue("selected", channel);
}

function removeChannel(){
    let channels =data.getValue('channels');
    let select =  document.getElementById("channelSelect");
    let removed = select.options[select.selectedIndex];
    select.options[select.selectedIndex].remove();
    channels = channels.filter((e) =>{
        return e != removed;
    });
    data.setValue("channels",channels);
    loadChannels();
}