const token = 'your_token_here';
const prefix = '!sb';
const audioDirectories = ['./Audio/',
                        ];
const timeoutTime = 5; //in minutes
const maxFileSize = 6; //in megabytes
const normalize = true;

module.exports = {
    token,
    prefix,
    timeoutTime,
    audioDirectories,
    maxFileSize,
    normalize,
};