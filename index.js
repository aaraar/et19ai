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

const port = 3000;
const app = express();
let emoData;
const credentials = {
	key: fs.readFileSync("./sslcerts/localhost.key", "utf8"),
	cert: fs.readFileSync("./sslcerts/localhost.crt", "utf8")
};
const httpsServer = https.createServer(credentials, app);

app
	.use("/static", express.static(__dirname + "/public"))
	.use(cors())
	.use(cookieParser());
app.set("views", __dirname + "/views");
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
	.get("/", (req, res) => res.render("home", { title: "home" }))
	.get("/test", (req, res) => res.send(body))
	.get("/boos", (req, res) => res.send(emoData))
	.get("/login", spotifyAuth.onLogin)
	.get("/callback", spotifyAuth.onCallback)
	.get("/refresh_token", spotifyAuth.onRefreshToken);

function postData(url = "", data = {}) {
	// Default options are marked with *
	return fetch(url, {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, *cors, same-origin
		cache: "only-if-cached", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: `bearer ${query}`, // include, *same-origin, omit
		headers: {
			"Content-Type": "application/json"
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: "follow", // manual, *follow, error
		referrer: "no-referrer", // no-referrer, *client
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	}).then((response) => response.json()); // parses JSON response into native JavaScript objects
}

app.listen(port, () => console.log(`App listening on port ${port}!`));
