console.log("connected");
let shouldStop = false;
let stopped = false;
const recording = document.getElementById("recording");
const recordingSign = document.querySelector(".recordingSign");
const downloadLink = document.getElementById("download");
const stopButton = document.getElementById("stop");
const playerContainer = document.querySelector(".player-container");
const analyzeButton = document.querySelector(".formAjaxButton");
const dataDisplay = document.getElementById("emotionData");

stopButton.addEventListener("click", () => {
	shouldStop = true;
	recording.classList.remove("recording"); // changes background when pressing spacebar
	recordingSign.classList.remove("rec");
	stopButton.setAttribute("disabled", "");
	analyzeButton.classList.remove("disabled");
});

const handleSuccess = function(stream) {
	stopButton.addEventListener("click", function() {
		mediaRecorder.stop();
	});
	addEventListener("keyup", function(event) {
		if (event.keyCode == 32) {
			analyzeButton.classList.remove("disabled");
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
			let analyzedData = await analyzedDataCall.json();
			return analyzedData;
		}
		getEmotionData().then(() => {
			console.log("file created on server");
			getAnalyzedData().then((data) => {
				console.log(data);
			});
		});
	}
<<<<<<< HEAD
	async function getAnalyzedData() {
		let analyzedDataCall = await fetch("/analyzedAudio");
		let analyzedData = await analyzedDataCall.json();
		return analyzedData;
	}
	getEmotionData().then(() => {
		console.log("file created on server");
		getAnalyzedData().then((data) => {
			let emo = data;
			let emoLength = document.createElement('h1');
			emoLength.innerHTML = `there are ${emo.length} emotions recognized`;
			dataDisplay.appendChild(emoLength);
			console.log(`there are ${emo.length} emotions recognized`);
			for(let i = 0 ; i<emo.length; i++){
				let emoNode = document.createElement('h2');
				emoNode.innerHTML = emo[i].emotion;
				dataDisplay.appendChild(emoNode);
				let end = emo[i].end;
				let start = emo[i].start;
				end - start;
			}
				
		});
	});
=======
>>>>>>> d6dbe8c1b0e54255c2313a0563e20ad34df5239a
});
