# Favour tracking application
This repo is the API for the favour tracking application. It will be developed with nodejs using typescript

## Setup
1. It is highly recommended to use VSCode (https://code.visualstudio.com/download).
2. Install the latest LTS version of Nodejs and NPM.
3. Clone the repo.
4. Run `npm i`. This will install all the dependancies and create the `node_modules` folder.
5. If you are using VScode, install and enable the `Prettier` and `TSLint` exptensions.

## Starting the application
1. Before staring you will need the environment varialbes in the `.env` file. `.env` file is to not be commited and storred into the repo at all for security reasons. But a `sample.env` will have sample variables in there
2. Run `npm start`. This will start up nodemon which compiles the code and creates the `build` folder. Nodemon also observes any file changes and will automatially reset the server with the changes made.
