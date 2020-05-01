# Discord Sound Board Bot

## About

This is a Discord Bot that plays sound effects locally from your computer to the server channel. The sound effects must be obtained by the user, none are provided by default. This can also play music, provided their file path is given.



## Installation

First, download node.js from their [website](https://nodejs.org/en/download/). Install it and then we will create the bot.

Navigate to the [Discord Developer website](https://discordapp.com/developers/applications). Sign in with your discord username and password. In the upper right corner, click on "New Application", name it(I used "Sound Board") and then click "create". In the new menu, click the "Copy" button under "CLIENT ID" and save it to a text file. Then, on the left side of the new menu, click on "Bot", then click "Add Bot" and select "Yes". In the new menu, under token, click "Copy" and save the token in the same text file as the client id. 

Now we need to setup permissions. Navigate to the [Permissions Calculator Website](https://finitereality.github.io/permissions-calculator/?v=0) and check off "View Channels", "Send Messages", "Connect", "Speak", and "Use Voice Activity". Copy the "Client ID" from earlier into the Client ID box. Then click "ADD". This will prompt you with the list of servers you can add it to, select all of them you want to add to. If you want other people to add the bot, you can copy the URL at the top and give it to them to add.

To install the bot, navigate to the top of this repository and click "Clone or download" and select ["Download ZIP"]((https://github.com/bngayaban/Discord-Sound-Board/archive/master.zip)). Unzip it in the directory you want to install it in. Open the directory in a terminal/powershell. Type: `npm install`. To begin installing the necessary packages. Once that has finished, we can setup the bot.

Open the config.js file in your preferred text editor. In the token section, copy and paste the token from earlier in between the quotes. It should like this:

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
If you want to use the default directory, paste the audio into the "audio" directory where the bot was unzipped.

Once the directories are setup, you can initialize the bot's database. Open a powershell/terminal window in the directory the bot was installed. Then run `node databaseInit.js`.

Once the database is setup, we can start the bot by typing `node app.js`.

If no problems were encountered, you should see the bot online in Discord.

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
- future stuff
  - permissions for changing nickname

- lint code
- batch convert audio to ogg
- add tag system and method for playing random song based on tag

## DONE

- Added timeout feature
  - Can be modified in config.js, default 5 minutes
- Can read from multiple directories
  - Add as another entry in audioDirectories array in config.js
  - For Windows systems make sure to escape using \\\\ instead of single \\
- give users option to add their own files??
- add other folders to scan besides ./Audio

## Suggestions and modifications

Any suggestions are welcome and people are welcome to do with this code as they please, some credit would be nice if possible.


