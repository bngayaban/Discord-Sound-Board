// References
// http://k.ylo.ph/2016/04/04/loudnorm.html

const path = require('path');
const {promises: fs} = require('fs');
const normalize = require('ffmpeg-normalize');

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

    if(!loudness || loudness == 'default') {
        loudness = normalizeAudio.defaultLoudness();
    }

    if(outputDirectory && ! await checkDir(outputDirectory)) {
        throw new Error('Output directory is invalid');
    } else if (outputDirectory) {
        console.log(`Output folder detected, using ${outputDirectory} for all audio.`);
    }

    let promises = [];
    for(const dir in directories) {
        const outputDir = outputDirectory || normalizeAudio.getNormalizedDirectory(dir);
        if(!await checkDir(outputDir)){
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

    return results;
}

// returns true if path to dir exists and is a directory
async function checkDir(outputDirectory) {
    let pathExists = true;
    let isDir = false;
    try {
        await fs.access(outputDirectory);
        isDir = (await fs.stat(outputDirectory)).isDirectory();
    } catch (e) {
        pathExists = false;
    }

    //console.log(pathExists, isDir)

    return pathExists && isDir;
}

normalize.defaultLoudness = () => {
    return {   
        normalization: 'ebuR128',
        target: {
            input_i: -23,
            input_lra: 7.0,
            input_tp: -2.0
        }
    }
}


normalizeAudio.getNormalizedDirectory = (directory) => {
    return directory + '_normalized';
}

/* //test code
const audioNames = ['execution.ogg', 'giorno.ogg','dio23.mp3'];
const directories = ['./Audio'];

let input = {}; 
for(const dir of directories) {
    input[dir] = audioNames;
}

const output = path.join(__dirname, './nAudio');

(async (input, output) => {
    loudness = {
        normalization: 'ebuR128',
        target: {
            input_i: -23,
            input_lra: 7.0,
            input_tp: -2.0
        }
    }

    try {
        const results = await normalizeAudio(input, loudness, {outputDirectory: output});
        console.log(results);
    } catch(e) {
        console.log(e)
    }
    
})(input, output);
*/

module.exports = {
    normalizeAudio
}
