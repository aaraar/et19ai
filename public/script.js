console.log("connected");
let shouldStop = false;
let stopped = false;
const recording = document.getElementById("recording");
const recordingSign = document.querySelector(".recordingSign");
const downloadLink = document.getElementById("download");
const stopButton = document.getElementById("stop");
const playerContainer = document.querySelector(".player-container");
const analyzeButton = document.querySelector(".formAjaxButton");
const dataDisplay = document.querySelector(".emotionData");
const loaderSVG = document.querySelector(".loader");
const spotifySong = document.querySelector(".spotify-container");


const angerSong = `<iframe src="https://open.spotify.com/embed/track/2DlHlPMa4M17kufBvI2lEN" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
const disgustSong = `<iframe src="https://open.spotify.com/embed/track/6TwOdVpSVSd7QtwMRm05nR" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
const fearSong = `<iframe src="https://open.spotify.com/embed/track/6A9mKXlFRPMPem6ygQSt7z" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
const happinessSong = `<iframe src="https://open.spotify.com/embed/track/1PmXm1881bonBI1AlG5uaH" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
const sadnessSong = `<iframe src="https://open.spotify.com/embed/track/3JOVTQ5h8HGFnDdp4VT3MP" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
const surpriseSong = `<iframe src="https://open.spotify.com/embed/track/2x5QAdEPa0lEZMr38APFY6" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
const neutralSong = `<iframe src="https://open.spotify.com/embed/track/51rPRW8NjxZoWPPjnRGzHw" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;

stopButton.addEventListener("click", () => {
	shouldStop = true;
	recording.classList.remove("recording"); // changes background when pressing spacebar
	recordingSign.classList.remove("rec");
	stopButton.setAttribute("disabled", "");
	analyzeButton.removeAttribute("disabled");
	analyzeButton.classList.remove("disabled");
});

const handleSuccess = function(stream) {
	stopButton.addEventListener("click", function() {
		mediaRecorder.stop();
	});

	addEventListener("keyup", function(event) {
		if (event.keyCode == 32) {
			analyzeButton.classList.remove("disabled");
			analyzeButton.removeAttribute("disabled");
			recording.classList.remove("recording"); // removes recording when space is released
			fired = false;
			mediaRecorder.stop();
		}
	});
	const options = { mimeType: "audio/webm" };
	const recordedChunks = [];
	const mediaRecorder = new MediaRecorder(stream, options);

	mediaRecorder.addEventListener("dataavailable", function(e) {
		if (e.data.size > 0) {
			recordedChunks.push(e.data);
		}

		if (shouldStop === true && stopped === false) {
			console.log("should DEFINITELY stop now");
			mediaRecorder.stop();
			stopped = true;
		}
	});

	mediaRecorder.addEventListener("stop", function() {
		if (document.querySelector(".audio-player")) {
			const x = document.querySelector(".audio-player");
			x.parentNode.removeChild(x);
		}
		const audioFile = document.getElementById("audioFile");
		const reader = new FileReader();
		let playerEl = document.createElement("div");
		let base64data;
		const playerMarkup = `
	            <audio id="player" controls></audio>
            `;
		downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
		downloadLink.download = "acetest.wav";
		downloadLink.classList.remove("disabled");

		playerEl.classList.add("audio-player");
		playerEl.innerHTML = playerMarkup;
		playerContainer.appendChild(playerEl);
		const player = document.querySelector("#player");

		reader.readAsDataURL(new Blob(recordedChunks));
		reader.onloadend = function() {
			base64data = reader.result;
			audioFile.value = base64data;
		};
		player.src = downloadLink.href;
	});

	mediaRecorder.start();
};
//============== SPACEBAR RECORD =================
window.onkeydown = function(e) {
	return !(e.keyCode == 32); // prevent pagescroll on space bar
};
let fired = false;
addEventListener("keydown", function(event) {
	if (event.repeat) {
		return;
	}
	if (event.keyCode == 32) {
		fired = true;
		record();

		recording.classList.add("recording"); // changes background when pressing spacebar
		recordingSign.classList.add("rec");
	}
	console.log(fired);

	addEventListener("keyup", function(event) {
		if (event.keyCode == 32) {
			recording.classList.remove("recording"); // removes recording when space is released
			recordingSign.classList.remove("rec");
			fired = false;
		}
	});
});
//==================================================================================

function record() {
	navigator.mediaDevices
		.getUserMedia({ audio: true, video: false })
		.then(handleSuccess);
}

document.querySelector("#start").addEventListener("click", () => {
	stopButton.removeAttribute("disabled");
	recording.classList.add("recording"); // changes background when pressing spacebar
	recordingSign.classList.add("rec");
	navigator.mediaDevices
		.getUserMedia({ audio: true, video: false })
		.then(handleSuccess);
});

analyzeButton.addEventListener("click", (e) => {
	e.preventDefault();
	loaderSVG.classList.remove("hidden");
	if (analyzeButton.classList.contains("disabled")) {
		return;
	} else {
		const audioBlob = document.getElementById("audioFile");
		async function getEmotionData() {
			let emotionCall = await fetch("/analyzeAudio", {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json"
				},

				body: JSON.stringify({ audioFile: audioBlob.value })
			});
			let emotion = await emotionCall;
			console.log(emotion);
		}
		async function getAnalyzedData() {
			let analyzedDataCall = await fetch("/analyzedAudio");
			let analyzedData = await analyzedDataCall
				.json()
				.then(loaderSVG.classList.add("hidden"))
				.then(dataDisplay.classList.remove("hidden"));
			return analyzedData;
		}
		getEmotionData().then(() => {
			getAnalyzedData().then((data) => {
				let emo = data;
				let emoLength = document.createElement("h1");
				if (emo.length <= 1) {
					emoLength.innerHTML = `there is ${emo.length} emotion recognized`;
				} else {
					emoLength.innerHTML = `there are ${emo.length} emotions recognized`;
				}
				dataDisplay.appendChild(emoLength);

				for (let i = 0; i < emo.length; i++) {
					let emoNode = document.createElement("h3");
					let h4 = document.createElement("h4");
					let div = document.createElement("div");
					let end = emo[i].end;
					let start = emo[i].start;
					let totalOf = end - start;
					emoNode.innerHTML = `${emo[i].emotion} for a total of ${totalOf} seconds`;
					
					emoNode.classList.add(emo[i].emotion);
					
					switch (emo[i].emotion) {
						case 'anger':
							div.innerHTML = angerSong
							break;
						case 'surprise':
							div.innerHTML = surpriseSong
							break;
						case 'neutral':
							div.innerHTML = neutralSong
							break;
						case 'happy':
							div.innerHTML = neutralSong
							break;
						case 'fear':
							div.innerHTML = fearSong
							break;
						case 'sad':
								div.innerHTML = sadnessSong
								break;
						}
					dataDisplay.appendChild(emoNode);
					spotifySong.appendChild(h4); 
					h4.innerHTML= `We picked this song for you based on ${emo[i].emotion} emotion`;
					spotifySong.appendChild(div);
						
				}
			});
		});
	}
});
