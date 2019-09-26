# et19ai

Emerging tech AI assignment


## 1 How to set up the project local (CLI)
- Clone the repo to your local folder with the CLI
    - `$ git clone https://github.com/aaraar/et19ai.git`

## 2 Install dependencies
- Run `npm install`

## 3. Configuration
Before you can use moodPlayer locally you'll have to make some configurations on pre hand: create a `.env` - configure `DEEP_AFFECTS_API_KEY`, `PORT`, `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`

__Get your `DEEP_AFFECTS_API_KEY` from https://deepaffects.com/
__Get your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` from https://developer.spotify.com/documentation/web-api/

Open your CLI and run the following commands
For local setups:

- touch .env
- echo "DEEP_AFFECTS_API_KEY=<YOUR_KEY_HERE>" >> .env
- echo "PORT=<YOUR_PORT_HERE>" >> .env (default is 3000)
- echo "SPOTIFY_CLIENT_ID=<YOUR_CLIENT_ID_HERE>" >> .env
- echo "SPOTIFY_CLIENT_SECRET=<YOUR_SECRET_HERE>" >> .env

You are now setup!
Start the app by running: `npm run start` in the CLI. [node]
Or by running: `npm run dev` [nodemon]

Your terminal will now look something like this:

> emotionRecognition@1.0.0 dev /yourSpecificFileStructure/et19ai
> 
>nodemon index.js
>
>[nodemon] 1.19.2
>
>[nodemon] to restart at any time, enter `rs`
>
>[nodemon] watching dir(s): *.*
>
>[nodemon] starting `node index.js`

>App listening on port 3000!

- Browse to http://localhost:3000/
Your browser will look like this:
![Screenshot from moodPlayer](https://github.com/aaraar/et19ai/blob/develop/wiki/Screenshot%202019-09-26%20at%2014.43.02.png?=200)
## 4. Usage

To use the app simply press start to record en stop to end the record. You could also hold spacebar to record, the recording will stop when you release. After you recorded a sample you can start analyzing for emotion with the Analyze Audio button.

When a succesfull analyze had taken place the results will be available below
Example of analyzed audio:
![Screenshot from Analyzed audio fragment](https://github.com/aaraar/et19ai/blob/master/wiki/Screenshot%202019-09-26%20at%2016.58.36.png)
