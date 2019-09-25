function routes(){
	const {
		onAnalyzedAudio,
		onAnalyzeAudioPost
	} = require ("./analyzeAudio");

	const router = require("express").Router();
	const bodyParser = require("body-parser");
	const urlencodedParser = bodyParser.urlencoded({ extended: true });

	router.post("/analyzeAudio", onAnalyzeAudioPost);
	router.get("/analyzedAudio", onAnalyzedAudio);
	
	return router;
}

exports.routes = routes();