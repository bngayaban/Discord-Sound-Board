const {promises: fs} = require('fs');

class DirectoryUtility {
    static async isDirectory(directory) {
        let isDir = false;

        try {
            isDir = (await fs.stat(directory)).isDirectory();
        } catch(e) {

        }
        return isDir;
    }

    // finds files unique to either directory and returns object containing 2 arrays of the unique items
    static findUniqueFiles(directoryA, directoryB) {
        let uniqueToA = []; 
        let uniqueToB = [];
    
        directoryA.sort();
        directoryB.sort();
    
        let i = 0;
        let j = 0;
        while( i < directoryB.length && j < directoryA.length) {
            if(directoryB[i] > directoryA[j]) {
                uniqueToA.push(directoryA[j]);
                j++;
            } else if (directoryB[i] < directoryA[j]) {
                uniqueToB.push(directoryB[i]);
                i++;
            } else {
                i++;
                j++;
            }
        }
    
        while ( j < directoryA.length) {
            uniqueToA.push(directoryA[j]);
            j++;
        }
        while ( i < directoryB.length) {
            uniqueToB.push(directoryB[i]);
            i++;
        }
    
        return {uniqueToA: uniqueToA, uniqueToB: uniqueToB};
    }

    static removeExtension(directoryAudio, normalize) {
        if(normalize) {
            const lengthToSlice = '_norm.ogg'.length;
            return directoryAudio.map((file) => {return file.slice(0, -lengthToSlice).toLowerCase()});
        }
        return directoryAudio.map((file) => {return file.split('.').slice(0, -1).join('.').toLowerCase()});
    }
}

module.exports = DirectoryUtility;