const {normalizeAudio} = require('./audioNormalizer.js');
const {audioDirectories} = require('./config.js');
const {promises: fs} = require('fs');

(async () => {
    for(const directory of audioDirectories) {

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
    
        console.log(output);
    }    
})()

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