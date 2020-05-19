const normalize = require('ffmpeg-normalize');
// http://k.ylo.ph/2016/04/04/loudnorm.html
normalize({
    input: './Audio/astronomia.ogg',
    output: './Audio/astronomia_norm.ogg',
    loudness: {
        normalization: 'ebuR128',
    },
    verbose: true
})
.then(normalized  => {
    console.log(normalized)
})
.catch(error => {
    console.log(error)
    // Some error happened
});