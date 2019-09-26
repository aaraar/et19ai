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
Start the app by running: `npm run start` in the CLI. <node>
Or by running: `npm run dev` <nodemon>

Your terminal will now look something like this:

> emotionRecognition@1.0.0 dev /Users/wouterh/Documents/Jaar 3/AI/MoodPlayer/et19ai
> nodemon index.js

[nodemon] 1.19.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] starting `node index.js`
App listening on port 3000!

2. Create a `.env` file in root
3. Add `DEEP_AFFECTS_API_KEY=<your deepaffects API-key> SPOTIFY_CLIENT_ID=<your spotify client id> SPOTIFY_CLIENT_SECRET=<your spotify client secret>`
4. Add API key from https://deepaffects.com/
5. Run `npm start`
6. go to localhost:3000
