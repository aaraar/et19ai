const DeepAffects = require("deep-affects");
const defaultClient = DeepAffects.ApiClient.instance;
const express = require("express");
require("dotenv").config();
const port = 3000;
const app = express();
let emoData;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
// Configure API key authorization: UserSecurity
const UserSecurity = defaultClient.authentications["UserSecurity"];
UserSecurity.apiKey = process.env.API_KEY;
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//UserSecurity.apiKeyPrefix = 'Token';

const apiInstance = new DeepAffects.EmotionApi();

const body = DeepAffects.Audio.fromFile("./boos.wav"); // {Audio} Audio object
const callback = function(error, data, response) {
	if (error) {
		console.error(error);
	} else {
		console.log("API called successfully. Returned data: " + response);
		emoData = JSON.parse(response.text);
	}
};
apiInstance.syncRecogniseEmotion(body, callback);
app.get("/boos", (req, res) => res.send(emoData));
