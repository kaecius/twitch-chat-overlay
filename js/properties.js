const electron = require('electron');
const path = require('path');
const fs = require('fs');

const FILE_NAME = "user_data.json";


function UserSettingsStore(){
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath,FILE_NAME);
    console.log(this.path);
    try{
        this.data = JSON.parse(fs.readFileSync(this.path));
        console.info("archivo leido");
    }catch(e){
        console.log(e);
        fs.writeFileSync(this.path,'{ "channels" : [] , "selected": null }');
        this.data = { 'channels' : []};
        console.error("archivo creado por un error");
    }
    this.getValue = function(key){
        return this.data[key]
    };
    this.setValue = function(key,value){
        this.data[key] = value;
        this.saveFile();
    }
    this.saveFile = function(){
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
    return this;
}


module.exports.UserSettingsStore = UserSettingsStore;