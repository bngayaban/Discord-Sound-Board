const {token} = require('./token.json');
const prefix = '!sb';
const audioDirectories = ['./Audio/',
                        'E:\\SteamLibrary\\steamapps\\common\\Portal 2\\Soundtrack\\Portal 2 Soundtrack [Songs to Test by]'
                    ];
const timeoutTime = 5; //in minutes

module.exports = {
    token,
    prefix,
    timeoutTime,
    audioDirectories
};