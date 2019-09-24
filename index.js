const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const spotifyAuth = require("./spotifyAuthorization/userAuthorization");
const {
	onAnalyzedAudio,
	onAnalyzeAudioPost
} = require("./controllers/analyzeAudio");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = 3000;
const app = express();
let emoData;
// const credentials = {
// 	key: fs.readFileSync("./sslcerts/localhost.key", "utf8"),
// 	cert: fs.readFileSync("./sslcerts/localhost.crt", "utf8")
// };
// const httpsServer = https.createServer(credentials, app);

app
	.use("/static", express.static(__dirname + "/public"))
	.use(bodyParser.json({ limit: "50mb", extended: true }))
	.use(bodyParser.urlencoded({ limit: "50mb", extended: true })) //Hoog limiet op bodyparser voor audio files en JSON response
	.use(cors())
	.use(cookieParser());
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app
	.get("/", (req, res) => res.render("home", { title: "home" }))
	.get("/test", (req, res) => res.send(body))
	.get("/boos", (req, res) => res.send(emoData))
	.get("/login", spotifyAuth.onLogin)
	.get("/callback", spotifyAuth.onCallback)
	.get("/refresh_token", spotifyAuth.onRefreshToken);
app.post("/analyzeAudio", onAnalyzeAudioPost);
app.get("/analyzedAudio", onAnalyzedAudio);

app.listen(port, () => console.log(`App listening on port ${port}!`));
