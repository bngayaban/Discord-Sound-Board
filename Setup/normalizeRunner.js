const {normalizeAudio} = require('../Classes/audioNormalizer.js');
const {audioDirectories} = require('../config.js');
const {promises: fs} = require('fs');

const normalize = async () => {
    const directory = audioDirectories[0];
    const audioFiles = await gatherAudioFiles(directory);
    const output = await normalizeAudio({ 
        [directory]: audioFiles
        }, {   
        normalization: 'ebuR128',
        target: {
            input_i: -23,
            input_lra: 7.0,
            input_tp: -2.0
            }
        }, {
            extension: '.ogg',
            append: '_norm'
        }
    );

    return output;   
};

async function gatherAudioFiles(directory) {
    const extensions = ['.ogg', '.mp3', '.wav', '.oga'];

    // https://stackoverflow.com/a/58332163
    let files;
    try {
        files = await fs.readdir(directory);
    }
    catch (e) {
        console.log(e);
    }
    
    if(files === undefined) {
        console.log(`No files found in ${directory}`);
        return [];
    }

    let audioFiles = [];
    for(const ext of extensions)
        audioFiles = audioFiles.concat(files.filter(file => file.endsWith(ext)));

    

    return audioFiles;
}
module.exports = {
    normalize
};