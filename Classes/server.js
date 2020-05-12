function Server(guildID) {
    this.guild = guildID;
    this.dispatcher;
    this.queue = [];
    this.nowPlaying = '';
    this.timeout;
}

module.exports = Server;