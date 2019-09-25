console.log("connected");
let shouldStop = false;
let stopped = false;
const recording = document.getElementById("recording");
const downloadLink = document.getElementById("download");
const stopButton = document.getElementById("stop");
const playerContainer = document.querySelector(".player-container");
const analyzeButton = document.querySelector(".formAjaxButton");
const dataContainer = document.querySelector(".emotionData");

stopButton.addEventListener("click", function() {
	shouldStop = true;
	analyzeButton.classList.add("active");
});

const handleSuccess = function(stream) {
	stopButton.addEventListener("click", function() {
		mediaRecorder.stop();
	});
	addEventListener("keyup", function(event) {
		if (event.keyCode == 32) {
			analyzeButton.classList.add("active");
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
		const audioFile = document.getElementById("audioFile");
		const reader = new FileReader();
		let playerEl = document.createElement("div");
		let base64data;
		const playerMarkup = `
	            <audio id="player" controls></audio>
            `;
		downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
		downloadLink.download = "acetest.wav";
		downloadLink.classList.add("active");

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
	}
	console.log(fired);

	addEventListener("keyup", function(event) {
		if (event.keyCode == 32) {
			recording.classList.remove("recording"); // removes recording when space is released
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
	stopButton.classList.add("active");
	navigator.mediaDevices
		.getUserMedia({ audio: true, video: false })
		.then(handleSuccess);
});

analyzeButton.addEventListener("click", (e) => {
	e.preventDefault();
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
});
