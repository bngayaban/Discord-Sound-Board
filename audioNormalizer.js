const path = require('path');
const {promises: fs} = require('fs');
const normalize = require('ffmpeg-normalize');

/** AudioArray[0]: list of audios
 *  AudioArray[1]: their location
 *
 */
async function normalizeAudio(audioArray, outputDirectory) {

    if(! await checkDir(outputDirectory)) {
        throw new Error('Output directory is invalid');
    }
  
    //let promises = [];
    for(const audio of audioArray) {
        const index = audio[0].lastIndexOf('.');
        const normalizedName = audio[0].slice(0, index) + '_norm' + '.ogg'//audio[0].slice(index);

        const mInput = path.join(__dirname, audio[1], audio[0]);
        const mOutput = path.join(outputDirectory, normalizedName)
        console.log(mInput, mOutput);
        await normalize({
            input: mInput,
            output: mOutput,
            loudness: {
                normalization: 'ebuR128',
                target: {
                    input_i: -23,
                    input_lra: 7.0,
                    input_tp: -2.0
                }
            },
            verbose: false
        });
    }

    
    //await Promise.all(promises);
    console.log('Done');
}

async function checkDir(outputDirectory) {
    let pathExists = true;
    let isDir = false;
    try {
        await fs.access(outputDirectory);
        isDir = (await fs.stat(outputDirectory)).isDirectory();
    } catch (e) {
        pathExists = false;
    }

    console.log(pathExists, isDir)

    return pathExists && isDir;
}

const audioNames = ['dio22.mp3', 'execution.ogg', 'giorno.ogg'];
const directories = ['./Audio', './Audio', './Audio'];

const input = audioNames.map((item, index) => [item, directories[index]])//[audioNames, directories];
const output = path.join(__dirname, './nAudio');

console.log(input);

(async (input, output) => {
    try {
        await normalizeAudio(input, output);
    } catch(e) {
        console.log(e)
    }
    
})(input, output);


module.exports = {
    normalizeAudio
}


/*
// http://k.ylo.ph/2016/04/04/loudnorm.html
normalize({
    input: './Audio/astronomia.ogg',
    output: './Audio/astronomia_norm.ogg',
    loudness: {
        normalization: 'ebuR128',
        target: {
            input_i: -23,
            input_lra: 7.0,
            input_tp: -2.0
        }
    },
    verbose: false
})
.then(normalized  => {
    console.log(normalized)
})
.catch(error => {
    console.log(error)
    // Some error happened
});
*/