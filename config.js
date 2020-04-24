const {token} = require('./token.json');
const prefix = '!sb';
const audioDirectories = ['./Audio/',
                        ];
const timeoutTime = 5; //in minutes
const maxFileSize = 6; //in megabytes

module.exports = {
    token,
    prefix,
    timeoutTime,
    audioDirectories,
    maxFileSize
};