const {token} = require('./token.json');
const prefix = '!sb';
const audioDirectories = ['./Audio/',
                        ];
const timeoutTime = 5; //in minutes

module.exports = {
    token,
    prefix,
    timeoutTime,
    audioDirectories
};