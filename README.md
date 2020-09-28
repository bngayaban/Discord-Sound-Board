# Discord Sound Board Bot

## About

This is a Discord Bot that plays sound effects locally from your computer to a voice channel. The sound effects must be obtained by the user, none are provided by default. This can also play music, provided their file path is given.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installation](#installation)
  - [Downloading and Installing Node.js](#downloading-and-installing-nodejs)
  - [Setting Up A Developer Account](#setting-up-a-developer-account)
  - [Calculating Permissions](#calculating-permissions)
  - [Downloading and Installing Sound Board Bot](#downloading-and-installing-sound-board-bot)
  - [Setting Up Sound Board Bot](#setting-up-sound-board-bot)
  - [Normalizing Audio and Initializing Database](#normalizing-audio-and-initializing-database)
    - [Adding Additional Audio After Setup](#adding-additional-audio-after-setup)
    - [Removing Audio](#removing-audio)
  - [Running Sound Board Bot](#running-sound-board-bot)
- [Usage](#usage)
  - [Music](#music)
  - [Tagging](#tagging)
  - [Permissions](#permissions)
- [Customization](#customization)
- [TODO](#todo)
- [DONE](#done)
- [Suggestions and modifications](#suggestions-and-modifications)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

### Downloading and Installing Node.js

First, navigate to the [nodeJS website](https://nodejs.org/en/download/) and then download and install the appropriate version of nodeJS for your system.

### Setting Up A Developer Account

While nodeJS is installing, we will setup the Developer Account. Navigate to the [Discord Developer Website](https://discord.com/developers) and sign in with your Discord username and password. In the upper right corner, click on "New Application", name it and then click on "Create". In the new menu, click "Copy" under "Client ID" and save it to a text file. On the left side, click on "Bot", then "Add Bot", and then "Yes". In the new screen, click "Copy" under token and save it to the same text file.

### Calculating Permissions

Now that the account is setup, we need to figure out the permissions for the bot. Navigate to the [Permission Calculator Website](https://finitereality.github.io/permissions-calculator/?v=0) and select "View Channels", "Send Messages", "Connect", "Speak", "View Channel", and "Use Voice Activity". Copy the "Client ID" from earlier into the Client ID box. Then click "ADD". This will prompt you with the list of servers you can add the bot to. Select all that apply and click "Continue".

NOTE 1: If you want other people to add the bot, save the URL at the top of your browser and send it to them.

NOTE 2: If a voice channel has custom permissions, the bot will needed to be granted permissions to join that channel.

### Downloading and Installing Sound Board Bot

Once permissions are setup, we will begin installing the bot. Navigate to the top of this repository and click "Clone or Download" and select [Download ZIP](https://github.com/bngayaban/Discord-Sound-Board/archive/master.zip). Once downloaded, unzip the files in the directory you want to install it in. Then open the directory in a terminal/powershell and type: `npm install` to begin installing the necessary packages.

### Setting Up Sound Board Bot

After npm has finished installing the packages, we can configure the bot. In the directory where the bot is installed, open the `config.js` file in your preferred text editor. In the token section, copy and paste the token from earlier in between the quotes. It should look like this:

`token: 'your_token_here',`

Here is where you will also add sound files from other directories, if you do not wish to use the default directory. For Windows, use File Explorer and navigate to the directory where the sound files are stored. Click the address bar at the top and copy the directory location. 

NOTE: For Windows the file paths need to be "escaped" by adding a second backslash to each slash.

Example:

Unformatted: `C:\Your\Path\To\Your\Audio`

Formatted: `C:\\Your\\Path\\To\\Your\\Audio`

Then in the config.js file, paste it in a new line under "audioDirectories" in single quotes.

Example:

```javascript
const audioDirectories = ['./Audio/',
                            'C:\\Your\\Path\\To\\Your\\Audio'
                        ];
```

NOTE: Make sure it is separated by a comma "," and is before the right bracket "]".

If you want to add more directories, add another line under the previous example separated by a comma ",".

Example:

```javascript
const audioDirectories = ['./Audio/',
                            'C:\\Your\\Path\\To\\Your\\Audio',
                            'C:\\Another\\Path\\To\\Audio',
                            'D:\\More\\Audio'
                        ];
```

If you want to use the default directory, paste the audio into the "Audio" directory where the bot was unzipped.

### Normalizing Audio and Initializing Database

Once the directories are setup, you can initialize the bot's database and normalize files. Open a powershell/terminal window in the directory the bot was installed and run `node setup.js`. This will run a script to normalize audio in the "Audio" directory and will then add all the files to the bot's database. Once the script finishes, the bot will be ready to run.

#### Adding Additional Audio After Setup

If after setup, you wish to add additional audio by:

 - Adding a folder
    - See example in Setting Up Sound Board Bot
 - Adding a file to the "Audio" directory
    - Copy the file to the directory

 Then simply run the `setups.js` file again for the bot to recognize it.

#### Removing Audio

If you wish to remove Audio from the bot. Either delete the folder from `config.js` file or delete the audio from the "Audio" directory. Then rerun `setup.js`.


### Running Sound Board Bot

Once the bot has been configured, we can start the bot by typing `node app.js` in the same terminal.

If no problems were encountered, you should see the bot online in Discord.

For continuous usage, usage consider buying a cheap computer such as a raspberry pi and hosting the bot there.

## Usage

Once the bot is running, you can command the bot using the prefix "!sb" followed by the command and it's arguments. For example `!sb play sound1` will play sound1.

When the bot is first initialized, each song gets their own nickname, which is their file name without the extension. Ex. `song1.mp3` nickname is `song1`.

If you are trying to add something with a space in it, put it in quotes to treat it as one thing. Ex. `song with space.mp3` should be `"song with space.mp3"`.

The following is a list of the commands organized by function.

Key:

`< >` - required argument

`[ ]` - optional argument

### Music

`<add> [nickname]` + attach sound file

- Users can add their own sounds through discord by using the add command with an optional nickname for it and attaching the file to the message. The max file size is 6MB, and can be changed in config.js. (Discord has an upper limit of 8MB)

- By default, only server owners and admins can use this feature to prevent abuse as currently it does not limit the number of songs that can be added. Other users can use this feature by giving them permission. (See permissions)

`<clear>`

- Clears the current song and the queue.

`<help> [command name]`

- Lists details similar to this section.
- Gives more details on a command if given.

`<list>`

- Lists all available songs.

`<play> <song name>` or `<nickname>`

- Plays a song either by giving the song name on the computer or its nickname. Playing additional songs while one is currently playing will place it into a queue. If no command is given, the bot will default to play.
- Examples:

  - `!sb sound1`

  - `!sb sound1.mp3`

  - `!sb play sound1`

`<pause>`

- Pause the current song.

`<rename> <current nickname> <new nickname>`

- Renames the nickname of a sound to a new sound.
- When songs are initially added, by default the nickname will be file's name without the extension.

`<resume>`

- Resumes the current song.

### Tagging

Tagging allows you to tag multiple songs with a tag, so that when you the play the tag, it will randomly pick a song with that tag. Tags are case insensitive.

`<addtag> <tag name> <song nickname> [0 or more additional song nicknames]`

- Tags multiple songs with the same tag.

`<removetag> <tag name> <song nickname> [0 or more additional song nicknames]`

- Removes tag from the given songs.

`<play> <tag name>`

- Play a random song tagged with the tag name.

### Permissions

The currently available permissions to be added are `add` and `modify` for giving people permission to add songs and modify other user's permissions. By default server admins and owners have `modify` and `add` permissions.

`<grant> <Discord Name> <permission name>`

- Grants another user's permissions.

`<revoke> <Discord Name> <permission name>`

- Revokes another user's permissions.

## Customization

The features that can be customized so far are the prefix, timeout time and file size.

All of this can be changed in the config.js file.

`prefix`

- The default prefix is `!sb` which is used to command the bot.

`file size`

- This is used to control the largest file that can given to `add`. The default is 6MB, but Discord has max limit of 8MB.

`timeout time`

- Controls how long the bot will remain in the channel after it has finished playing. Default is 5 minutes.

## TODO

- update documentation
- permissions for changing nickname and tags
- combine playtag() and play()
- lint code



## DONE

- Added timeout feature
  - Can be modified in config.js, default 5 minutes
- Can read from multiple directories
  - Add as another entry in audioDirectories array in config.js
  - For Windows systems make sure to escape using \\\\ instead of single \\
- give users option to add their own files??
- add other folders to scan besides ./Audio
- add tag system and method for playing random song based on tag
- batch convert audio to ogg, will probably use ffmpeg-normalize
- setup file for installation

## Suggestions and modifications

Any suggestions are welcomed and you are free to do with code under the MIT license.
