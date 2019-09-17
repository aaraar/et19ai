const DeepAffects = require("deep-affects");
const defaultClient = DeepAffects.ApiClient.instance;
const express = require("express");
const https = require("https");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const spotifyAuth = require("./spotifyAuthorization/userAuthorization");
const fs = require("fs");
const ejs = require("ejs");
require("dotenv").config();

const port = 8443;
const app = express();
let emoData;
var credentials = {
	key: fs.readFileSync(__dirname + "/sslcerts/node-selfsigned.key", "utf8"),
	cert: fs.readFileSync(__dirname + "/sslcerts/node-selfsigned.crt", "utf8")
};
var httpsServer = https.createServer(credentials, app);

app
	.use(express.static(__dirname + "/public"))
	.use(cors())
	.use(cookieParser());
app.set("view engine", "ejs");

const UserSecurity = defaultClient.authentications["UserSecurity"];
UserSecurity.apiKey = process.env.DEEP_AFFECTS_API_KEY;
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//UserSecurity.apiKeyPrefix = 'Token';

const apiInstance = new DeepAffects.EmotionApi();
const body = DeepAffects.Audio.fromFile("./boos.wav"); // {Audio} Audio object

apiInstance.syncRecogniseEmotion(body, (error, data, response) => {
	if (error) {
		console.error(error);
	} else {
		console.log("API called successfully. Returned data: " + response);
		emoData = JSON.parse(response.text);
	}
});

app
	.get("/test", (req, res) => res.send(body))
	.get("/boos", (req, res) => res.send(emoData))
	.get("/login", spotifyAuth.onLogin)
	.get("/callback", spotifyAuth.onCallback)
	.get("/refresh_token", spotifyAuth.onRefreshToken);

httpsServer.listen(port, () => console.log(`App listening on port ${port}!`));
