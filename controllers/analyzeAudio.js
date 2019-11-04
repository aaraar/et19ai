const DeepAffects = require("deep-affects");
const defaultClient = DeepAffects.ApiClient.instance;
const UserSecurity = defaultClient.authentications["UserSecurity"];
const http = require("http");
UserSecurity.apiKey = process.env.DEEP_AFFECTS_API_KEY;
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//UserSecurity.apiKeyPrefix = 'Token';

const apiInstance = new DeepAffects.EmotionApi();
let body; // {Audio} Audio object
const fs = require("fs");

function onAnalyzeAudioPost(req, res) {
	let audioFile = req.body.audioFile;
	let base64Audio = audioFile.split(";base64,").pop();

	fs.writeFile("audioTest.wav", base64Audio, { encoding: "base64" }, function(
		err
	) {
		if (err) {
			console.log(err);
		} else {
			console.log("File created");
			body = DeepAffects.Audio.fromFile("./audioTest.wav");
			res.status(202).end(http.STATUS_CODES[202]);
		}
	});
}

function onAnalyzedAudio(req, res) {
	console.log("starting analyzation");
	apiInstance.syncRecogniseEmotion(body, (error, data, response) => {
		if (error) {
			console.error(error);
		} else {
			console.log("API called successfully. Returned data: " + response);
			emotionData = JSON.parse(response.text);
			res.send(emotionData);
		}
	});
}

module.exports = { onAnalyzedAudio, onAnalyzeAudioPost };
