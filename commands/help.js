function help(message, args) {
    const data = [];
    const { commands } = message.client;

    if(!args.length) {
        data.push('Here\'s a list of available commands:');
        data.push(commands.map(command => command.name).join(', '));
        data.push('\nYou can send !sb help [command name] to get info on a specific command!');

        return message.reply(data, { split: true});
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name);
    
    if(!command) {
        return message.reply('Not a command.');
    }

    data.push(`Name: ${command.name}`);

    if(command.description) data.push(`Description: ${command.description}`);


    message.channel.send(data, {split: true});
}

module.exports = {
    name: 'help',
    description: 'List all available commands or info about a specific command.',
    execute(message, args) {
        return help(message, args);
    },
};