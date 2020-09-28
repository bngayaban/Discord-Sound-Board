// References
// http://k.ylo.ph/2016/04/04/loudnorm.html

const path = require('path');
const {promises: fs} = require('fs');
const normalize = require('ffmpeg-normalize');
const DirectoryUtility = require('./directoryUtility');
/** AudioArray[0]: list of audios
 *  AudioArray[1]: their location
 *
 */
async function normalizeAudio(directories, loudness, options={}) {
    const {
        outputDirectory,
        extension,
        bitrate,
        append = '',
        verbose = false
    } = options;

    if(Object.keys(loudness).length === 0) {
        loudness = normalizeAudio.defaultLoudness();
    }

    if(outputDirectory && ! await DirectoryUtility.isDirectory(outputDirectory)) {
        throw new Error('Output directory is invalid');
    } else if (outputDirectory) {
        console.log(`Output folder detected, using ${outputDirectory} for all audio.`);
    }

    let promises = [];
    for(const dir in directories) {
        const outputDir = outputDirectory || normalizeAudio.getNormalizedDirectory(dir);
        if(!await DirectoryUtility.isDirectory(outputDir)){
            console.log(`No output folder detected, creating folder for ${dir} named ${outputDir}.`)
            await fs.mkdir(outputDir);
        } else {
            console.log(`Using ${outputDir} for audio from ${dir}.\n`);
        }

        for(const audio of directories[dir]) {
            const index = audio.lastIndexOf('.');
            const ext = extension || audio.slice(index);
            const normalizedName = audio.slice(0, index) + append + ext;

            const input = path.join(dir, audio);
            const output = path.join(outputDir, normalizedName);

            console.log(input, output);
            promises.push( normalize({
                input: input,
                output: output,
                loudness: loudness,
                verbose: verbose
            }));
        }
    }
    const results = await Promise.allSettled(promises);
    console.log('Done');

    return results.map(result => filterOutputDir(result));

    function filterOutputDir(output) {
        return ('info' in output.value) ? output.value.info.output : output.value.output;
    }
}

normalizeAudio.defaultLoudness = () => {
    return {   
        normalization: 'ebuR128',
        target: {
            input_i: -23,
            input_lra: 7.0,
            input_tp: -2.0
        }
    }
}

// returns the location of where the normalized version of an audio directory SHOULD be
// which is located as a sub directory of the given directory
// Returns: audioDirectoryName/audioDirectory_normalized
normalizeAudio.getNormalizedDirectory = (directory) => {
    const baseDir = path.basename(directory) + '_normalized';

    return path.join(directory, baseDir);
}

module.exports = {
    normalizeAudio
}
