function Server(guildID) { 
    this.guild = guildID;
    this.dispatcher;
    this.queue = [];
    this.nowPlaying = '';
    this.timeout;
}

// IIFE for creating the serverList
(() => {
    Server.serverList = {};
})();


// Creates server if it doesn't exist and returns it
Server.getServer = (guildID) => {
    if(!Server.serverList[guildID]) {
        console.log(`Creating server for ${guildID}`);
        Server.serverList[guildID] = new Server(guildID);
    }

    return Server.serverList[guildID];
}

module.exports = Server;