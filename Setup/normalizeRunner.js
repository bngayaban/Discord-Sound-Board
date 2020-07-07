const {normalizeAudio} = require('../Classes/audioNormalizer.js');
const {audioDirectories} = require('../config.js');
const {promises: fs} = require('fs');
const DirectoryUtility = require('../Classes/directoryUtility');
const {join} = require('path');

const normalize = async () => {
    const directory = audioDirectories[0];
    const audioFiles = await getFilesToNormalize(directory);
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

async function getFilesToNormalize(directory) {

    // if normalized directory hasn't been created yet, just return audio files.
    if (!(await DirectoryUtility.isDirectory(normalizeAudio.getNormalizedDirectory(directory)))) {
        console.log('No normalized directory found. Continuing...');
        return await gatherAudioFiles(directory);
    }

    //need to remove extensions because the last few chars will be different between normalized and unnormalized files
    const audioFiles = await gatherAudioFiles(directory);
    const audioNoExt = DirectoryUtility.removeExtension(audioFiles);
    
    const normalizedFiles = await gatherAudioFiles(normalizeAudio.getNormalizedDirectory(directory));
    const normalizedFilesNoExt = DirectoryUtility.removeExtension(normalizedFiles, true);

    // finds the non duplicates in each, but need to add extensions back
    const {uniqueToA: filesToAdd, uniqueToB: filesToRemove} = DirectoryUtility.findUniqueFiles(audioNoExt, normalizedFilesNoExt);
    // removes files
    for(const file of filesToRemove) {
        try{
            await fs.unlink(join(normalizeAudio.getNormalizedDirectory(directory), file + '_norm.ogg'));
        } catch (e) {
            console.log(e);
        }
    }

    // maps each file to the corresponding file with the proper extension
    // uses lowercase() because removingExtension() also makes it lowercase
    const filesToAddWithExt = filesToAdd.map(file => { 
        return audioFiles.find(af => {
            if (af.substring(0, file.length).toLowerCase() === file) return af
        })
    });

    return filesToAddWithExt;
}

async function gatherAudioFiles(directory) {
    const extensions = ['.ogg', '.mp3', '.wav', '.oga'];

    // https://stackoverflow.com/a/58332163
    let files;
    try {
        files = await fs.readdir(directory);
    }
    catch (e) {

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