function Server(guildID) { 
    this.guild = guildID;
    this.dispatcher;
    this.queue = [];
    this.nowPlaying = '';
    this.timeout;
}

// Creates server if it doesn't exist and returns it
Server.getServer = (guildID) => {
    if(!Server.serverList) {
        Server.serverList = {};
    }

    if(!Server.serverList[guildID]) {
        Server.serverList[guildID] = new Server(guildID);
    }

    return Server.serverList[guildID];
}

module.exports = Server;