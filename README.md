# Installation

## Requirements

- Copy of Git Repo
- Your own token, in token.json file
- Made a discord bot on the developer website
- Populated Audio Directory or file path properly formatted in the config.js file

## Instructions

1. With a populated Audio Directory, run databaseInit.js
2. Then run app.js

## TODO

- update documentation
- future stuff
  - add other folders to scan besides ./Audio
  - permissions for changing tags
- give users option to add their own files??
- lint code
- batch convert audio to ogg

## DONE

- Added timeout feature
  - Can be modified in config.js, default 5 minutes
- Can read from multiple directories
  - Add as another entry in audioDirectories array in config.js
  - For Windows systems make sure to escape using \\\\ instead of single \\
