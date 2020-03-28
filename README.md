# Requirements

Prerequisites:
     - python2.7 or later with its path environment set
     - npm : https://www.npmjs.com/
     - windows build tools(for node-gyp) : https://github.com/nodejs/node-gyp
     - Chocolatey(for FFMPEG) : https://chocolatey.org/install
      - FFMPEG : use choco install ffmpeg, to install once chocolately is installed.
                    Alternatively, you can FFMPEG directly https://www.ffmpeg.org/ but the environment path must be set manually
*nix:
     - install Node.js v12.x
     - then install NPM
Once installed the following npm packages can be installed with : npm discord.js ffmpeg node-opus

- discord.js : all discord interactions
- ffmpeg : audio streaming
- node-opus : audio codec


TODO:
 - update documentation
 - future stuff
   - add other folders to scan besides ./Audio
   - permissions for changing tags
   - give users option to add their own files??
 - lint code