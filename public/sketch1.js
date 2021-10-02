//RTC version

// /*jshint esversion: 8 */
var soundFile; let cheer; var audioCtx; let musicFiles; let delayS = 1000;
var amplitude; 
var backgroundColor = [200, 155, 100, 0];
let danceMonkey; let senorita; let yummy; let cheapThrills

// rectangle parameters
var rectRotate = true;
var rectMin = 15;
var rectOffset = 20;
var numRects = 10;

var beatHoldFrames = 30;

// what amplitude level can trigger a beat?
var beatThreshold = 0.11; 

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
var beatCutoff = 0;
var beatDecayRate = 0.98; // how fast does beat cutoff decay?
var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.

let brain;
let video; var myCanvas;
let poseNet;
let pose;
let skeleton;
// Player Dance Points
let playerScore = 0; let beatScore = 0; let danceScore;
let rhythmT = 0; let beatT = 0;
// Calories variables
let curRT; let prevRT; let kcal = 0; let mass = 90;
// Praise text
let textFade = 0; let imgFade = 0;
let label = ""; let labelCoord = ""; let labelBeat = ""
// Winner
let winnerId; let partyStatus; let winScore = 500; let winnerText;
// Coordination time
let coordQueue = []; 
// user ID
let uID; let dj; let peerId; 
// stream Promise
let streamPromise; 
// UI variable
let lWX = 0; let lWY = 0;
// Fireworks
let flakes = [];
// Record status
let recording = false; let recorder; let recordStream; let partyURL;
// Chat/Playlist status
let chatIsOpen = false; let playlistIsOpen = false;
// Trail bubbles =====================
// All the paths
var paths = [];
// Are we painting?
var painting = false;
// How long until the next circle
var next = 0;
// Where are we now and where were we?
var current;
var previous;
// ===================================
// FFmpeg convert to mp4
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
  log: true,
});
// Keypoint rhythm dictionary
let nose = {
  'x': {
       'dtUp': 0,
       'dtDown': 0,
       'prevdtUp': 0,
       'prevdtDown': 0,
       'prevT': 0,
       'prevJoint': 0,
       'jointAxis': 'nose.x',
       'threshold': 10,
       'count': 0
  },
  'y': {
       'dtUp': 0,
       'dtDown': 0,
       'prevdtUp': 0,
       'prevdtDown': 0,
       'prevT': 0,
       'prevJoint': 0,
       'jointAxis': 'nose.y',
       'threshold': 10,
       'count': 0
  }
}

let shoulder = {
    'left': {
        'x': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'shoulder.left.x',
          'threshold': 10,
          'count': 0
        },
        'y': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'shoulder.left.y',
          'threshold': 10,
          'count': 0
      }
    },
    'right': {
        'x': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'shoulder.right.x',
          'threshold': 10,
          'count': 0
        },
        'y': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'shoulder.right.y',
          'threshold': 10,
          'count': 0
        }
    }
}
let wrist = {
    'left': {
        'x': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'wrist.left.x',
          'threshold': 30,
          'count': 0
        },
        'y': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'wrist.left.y',
          'threshold': 30,
          'count': 0
        }
    },
    'right': {
          'x': {
            'dtUp': 0,
            'dtDown': 0,
            'prevdtUp': 0,
            'prevdtDown': 0,
            'prevT': 0,
            'prevJoint': 0,
            'jointAxis': 'wrist.right.x',
            'threshold': 30,
            'count': 0
          },
          'y': {
            'dtUp': 0,
            'dtDown': 0,
            'prevdtUp': 0,
            'prevdtDown': 0,
            'prevT': 0,
            'prevJoint': 0,
            'jointAxis': 'wrist.right.y',
            'threshold': 30,
            'count': 0
          }
    }
}
let hip = {
    'left': {
        'x': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'hip.left.x',
          'threshold': 15,
          'count': 0
        },
        'y': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'hip.left.y',
          'threshold': 15,
          'count': 0
        }
    },
    'right': {
        'x': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'hip.right.x',
          'threshold': 15,
          'count': 0
        },
        'y': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'hip.right.y',
          'threshold': 15,
          'count': 0
        }
    }
}
let knee = {
    'left': {
        'x': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'knee.left.x',
          'threshold': 20,
          'count': 0
        },
        'y': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'knee.left.y',
          'threshold': 20,
          'count': 0
        }
    },
    'right': {
        'x': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'knee.right.x',
          'threshold': 20,
          'count': 0
        },
        'y': {
          'dtUp': 0,
          'dtDown': 0,
          'prevdtUp': 0,
          'prevdtDown': 0,
          'prevT': 0,
          'prevJoint': 0,
          'jointAxis': 'knee.right.y',
          'threshold': 20,
          'count': 0
        }
    }
}
///////////////////////////////////////////////////////////////////////
const socket = io('/');
let myVideoStream; let myAudioStream;
let dancer; let kcalIcon; let danceIcon;

function preload() {
  cheapThrills = loadSound('/music/music.mp3');
  danceMonkey = loadSound('/music/dancemonkey.mp3');
  yummy = loadSound('/music/yummy.mp3');
  senorita = loadSound('/music/senorita.mp3');
  cheering = loadSound('/music/Cheering.mp3');
  dancer = loadImage("/imgs/dancing_smiley1.png");
  kcalIcon = loadImage('/imgs/caloriesIcon.png');
  danceIcon = loadImage('/imgs/danceIcon.png');
}

//Agora API ============================================
// Handle errors.
let handleError = function(err){
        console.log("Error: ", err);
};
// 1. Create and initalize client
let client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
});

// Subscribe to the remote stream when it is published
client.on("stream-added", function(evt){
    client.subscribe(evt.stream, handleError);
});
// Play the remote stream when it is subsribed
client.on("stream-subscribed", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    addVideoStream(streamId, false);
    stream.play(streamId, function(errState){
	    if (errState && errState.status !== "aborted"){
	        // The playback fails, probably due to browser policy. You can resume the playback by user gesture.
	    }
	    debouncedRecalculateLayout();
	});
});

// Remove the corresponding view when a remote user unpublishes.
client.on("stream-removed", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});
// Remove the corresponding view when a remote user leaves the channel.
client.on("peer-leave", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});
//======================================================
// window.addEventListener('DOMContentLoaded', (event) => {
//   if (ROOM_ID) {
//     socket.emit('channelName', ROOM_ID);
//   } else {
//     console.log('ROOM_ID is not ready yet')
//   }
//   console.log('DOM fully loaded and parsed');
// });

socket.on('connect', () => {
  console.log("socket connection", socket.connected); // true
});
socket.on('disconnect', () => {
  console.log('socket disconnected', socket.disconnected);
})

let chat = $('input')

$('html').keydown((e) => {
    if (e.which == 13 && chat.val().length != 0) {
        // console.log(chat.val())
        socket.emit('message', chat.val());
        chat.val('');
    }
})

socket.on('createMessage', message => {
    console.log('this is coming from server', message)
    $('ul').append(`<li class="messages"><b>user</b><br/>${message}</li>`)
})
socket.on('winnerName', winner => {
    winnerId = winner;
    console.log('winner received from server is ', winner);
    // musicPlay();
    dancePlay();
    const videoBorder = document.getElementById(winner + "-1");
    videoBorder.className = "winner";
    cheering.play();
    // final calories burned
    if (!prevRT) {
      prevRT = curRT;
      curRT = Date.now();
      kcal += 1.8*mass*(curRT-prevRT)/3600000;
    } else {
      prevRT = curRT;
      curRT = Date.now();
      if ( (curRT-prevRT) > 5000 ) {
        kcal += 7.3*mass*5000/3600000 + 1.8*mass*(curRT-prevRT-5000)/3600000;
      } else {
        kcal += 7.3*mass*(curRT-prevRT)/3600000;
      }  
    }    
})
socket.on('danceStatus', danceObj => {
  partyStatus = danceObj.partyStatus;
  console.log('new partyStatus', partyStatus);
  // const h1 = document.getElementById("winner");  
  // Sound play in all peers
  if (partyStatus) {
    // Mute mic
    myAudioStream.enabled = false;
    // Play audio
    if (soundFile && soundFile.isPlaying()) {
      soundFile.stop();
      console.log('song stopped');
      delayS = 1500;
    }
    let musicObj = musicFiles.find( (obj) => obj.name === danceObj.name );
    soundFile = musicObj.file;
    setTimeout(function(){ 
      soundFile.play(); 
    }, delayS);    
    // Play video
    const srcUrl = danceObj.srcURL;
    let warmup = document.getElementById("warmup");
    warmup.src = srcUrl;
    // if (warmup) {
    //   removeVideoStream("warmup");
    // }
    // Reset dance floor
    winnerText = "";
    if (winnerId) {
      const videoBorder = document.getElementById(winnerId + "-1");
      videoBorder.className = "not-winner";  
    }
    // calories calculator start time
    curRT = Date.now();
  } else {
    // winnertext for non-winners
    winnerText = "Congratulations!"
    myAudioStream.enabled = true; 
    soundFile.stop();
    const srcUrl = danceObj.srcURL;
    let warmup = document.getElementById("warmup");
    warmup.src = srcUrl;
    // final calories burned
    if (!prevRT) {
      prevRT = curRT;
      curRT = Date.now();
      kcal += 1.8*mass*(curRT-prevRT)/3600000;
    } else {
      prevRT = curRT;
      curRT = Date.now();
      if ( (curRT-prevRT) > 5000 ) {
        kcal += 7.3*mass*5000/3600000 + 1.8*mass*(curRT-prevRT-5000)/3600000;
      } else {
        kcal += 7.3*mass*(curRT-prevRT)/3600000;
      }  
    } 
    // Include calories in congrats modal
    const congrats = document.querySelector('.congrats');
    congrats.style.display = "flex";
    const closeBtn = document.getElementById("close")
	  closeBtn.addEventListener("click", () => {
		  congrats.style.display = "none"
	  })

    const calBurned = document.createElement('p');
    calBurned.innerHTML = String(Math.round(kcal));
    const calElem = document.querySelector('.congrats-cal');
    calElem.appendChild(calBurned);
    // Include dance pts in congrats modal
    const dancePts = document.createElement('p');
    dancePts.innerHTML = String(danceScore);
    const ptsElem = document.querySelector('.congrats-pts');
    ptsElem.appendChild(dancePts);

    let text = "I've burned " + String(Math.round(kcal)) + "Calories and earned " + String(danceScore) + `dance points!\n Join this dance workout app at https://rhytmie.com/`;   
    decorateWhatsAppLink(text);
    // Download congrats image
    let dataURL = myCanvas.elt.toDataURL();
    let imgURL = URL.createObjectURL(dataURItoBlob(dataURL));
    document.getElementById("winImg").src = imgURL;
    showDownload("downloadDiv", "downloadImg", imgURL, 'congratsImage');
  }
})
socket.on('dj', djId => {
  console.log('dj joined', djId);
  dj = djId;
  // Play button for DJ
  if (djId === uID) {
  	console.log('dj is you');

  	setPlayMusic();
  	const centrBtn = document.querySelector('.play_button');
  	centrBtn.addEventListener("click", ()=> {
  		// musicPlay();
  		// removeVideoStream("warmup");
      dancePlay();
  	});
    const playlistBtn = document.querySelector('.playlist_btn');
    playlistBtn.style.display = "flex";

  	// Copy room link ===============================================
    const modal = document.querySelector(".modal")
    const closeBtn = document.querySelector(".close")

    modal.style.display = "block";
	  closeBtn.addEventListener("click", () => {
		  modal.style.display = "none"
	  })

	  document.getElementById("url").innerHTML = window.location.href;
  } else {
    // Ready to dance button for dancers
  	setReadyDance()
  	const centrBtn = document.querySelector('.play_button');
  	centrBtn.addEventListener("click", () => {
  		readyToDance();
  	});
  }
});

const chatElem = document.querySelector('.chat_btn');
chatElem.addEventListener('click', async () => {
    await openChat();  
    debouncedRecalculateLayout();
});

const playlistElem = document.querySelector('.playlist_btn');
playlistElem.addEventListener('click', async () => {
    await openPlaylist();
    debouncedRecalculateLayout();
});
///////////////////////////////////////////////////////////////////////
// ===============================================================

// Dynamic videogrid layout ======================================
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// `wait` milliseconds.
const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

function recalculateLayout() {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  const videoGrid = document.getElementById("video-grid");
  const mainVideos = document.querySelector(".main-videos");
  const aspectRatio = 4 / 3;
  const screenWidth = mainVideos.getBoundingClientRect().width; 
  const screenHeight = mainVideos.getBoundingClientRect().height;
  // check
  const wRatio = screenWidth/vw;
  const hRatio = screenHeight/vh;
  // console.log('wRatio ', wRatio, ' hRatio ', hRatio);
  // console.log('mainVideos width', screenWidth, ' mainVideos height', screenHeight);
  const videoCount = document.getElementsByTagName("video").length + 1;
  // console.log('number of videos', videoCount);
  // or use this nice lib: https://github.com/fzembow/rect-scaler
  function calculateLayout(
    containerWidth,
    containerHeight,
    videoCount,
    aspectRatio
  ) {
    let bestLayout = {
      area: 0,
      cols: 0,
      rows: 0,
      width: 0,
      height: 0
    };

    // brute-force search layout where video occupy the largest area of the container
    for (let cols = 1; cols <= videoCount; cols++) {
      const rows = Math.ceil(videoCount / cols);
      const hScale = containerWidth / (cols * aspectRatio);
      const vScale = containerHeight / rows;
      let width;
      let height;
      if (hScale <= vScale) {
        width = Math.floor(containerWidth / cols);
        height = Math.floor(width / aspectRatio);
      } else {
        height = Math.floor(containerHeight / rows);
        width = Math.floor(height * aspectRatio);
      }
      const area = width * height;
      if (area > bestLayout.area) {
        bestLayout = {
          area,
          width,
          height,
          rows,
          cols
        };
      }
    }
    return bestLayout;
  }

  const { width, height, cols } = calculateLayout(
    screenWidth,
    screenHeight,
    videoCount,
    aspectRatio
  );
  // console.log('layout width', width, ' height', height, ' columns', cols);
  // console.log('screenWidth', screenWidth, ' screenHeight', screenHeight);
  // console.log('viewport width is ', vw);

  videoGrid.style.setProperty("--width", width + "px");
  videoGrid.style.setProperty("--height", height + "px");
  videoGrid.style.setProperty("--cols", cols + "");
}

const debouncedRecalculateLayout = debounce(recalculateLayout, 50);
window.addEventListener("resize", debouncedRecalculateLayout);
// ================================================================
let n = 0; 

function setup() {
  myCanvas = createCanvas(640, 480);
  myCanvas.hide();
  // music files list
  musicFiles = [
    {
      file: cheapThrills,
      name: 'cheapthrills'
    },
    {
      name: 'dancemonkey',
      file: danceMonkey
    },
    {
      name: 'yummy',
      file: yummy
    },
    {
      name: 'senorita',
      file: senorita
    }
  ];  
  // console.log('myCanvas in sketch', myCanvas);
  // Trail bubble vector initialization
  current = createVector(0,0);
  previous = createVector(0,0);
  // audioCtx = getAudioContext();
  dancer.resize(150,150);
  kcalIcon.resize(100,100);
  danceIcon.resize(100,100);
  // RoomId emission and token reception
  socket.emit('channelName', ROOM_ID);
  // Websocket & WebRTC
  streamPromise = new Promise((resolve, reject) => {
    let canvasStream = myCanvas.elt.captureStream(30);
    if (canvasStream) {
      resolve(canvasStream);
    } else {
      reject("stream is not ready!")
    }
    
  });

	let constraints = {video: true};
	video = createCapture(constraints, stream => {
	  console.log('video stream captured', stream);      
	})

	video.hide(); 
  socket.on('token', tokenA => {
    console.log('token ', tokenA);
    console.log('roomId ', ROOM_ID)
    streamPromise.then(
      function(videoStream) {
      client.init("<client token>", function() {   
          console.log("init success");
          // 2. Join a channel
          client.join(tokenA, ROOM_ID, null, (uid)=>{
            console.log('join channel: room1 success' + 'uid = ' + uid );
            uID = String(uid);
  
            console.log('canvasStream is captured', videoStream);
            let canvasVideoTrack = videoStream.getVideoTracks()[0]
              console.log('audiotrack and videotrack detected');
              // Create a local stream 
              let localStream = AgoraRTC.createStream({
              streamID: String(uid),
              audio: true,
              video: true,
              videoSource: canvasVideoTrack,
            });
            localStream.init(()=>{
              console.log("init local stream success");
              // Play the local stream
              // console.log("localStream has video", localStream.hasVideo(), " has audio", localStream.hasAudio());
              addVideoStream(String(uid), true);
              localStream.play(String(uid), {fit: "contain", muted: true}, function(errState){
                  if (errState && errState.status !== "aborted"){
                      // The playback fails, probably due to browser policy. You can resume the playback by user gesture.
                  }
                  console.log('error occured while playing stream', errState);
                  debouncedRecalculateLayout();
                  document.querySelector('.connecting').style.display = "none";
              });
              // console.log('audio volume', localStream.getAudioLevel());
              // Publish the local stream
              client.publish(localStream, handleError);
                }, handleError);
            socket.emit('join-room', ROOM_ID, String(uid));
          }, handleError);
      });
      }, 
      function(error) {
      console.log(error);
    })
  
  });

	// DJ Opens Room
	console.log('room id', ROOM_ID);
	// Other peer connects => send my stream => add his stream
	fft = new p5.FFT(0.9, 64);
	poseNet = ml5.poseNet(video, modelLoaded);
	console.log("poseNet", poseNet);
	poseNet.on('pose', gotPoses);

	let options = {
	inputs: 34,
	outputs: 4,
	task: 'classification',
	debug: true
	}
	brain = ml5.neuralNetwork(options);
	const modelInfo = {
	model: 'model/model.json',
	metadata: 'model/model_meta.json',
	weights: 'model/model.weights.bin',
	};
	brain.load(modelInfo, brainLoaded);
	// brain.loadData('ymca.json', dataReady);

	amplitude = new p5.Amplitude();
	amplitude.setInput();
	amplitude.smooth(0.9);
	// soundFile.play();
}

function dataURItoBlob(dataURI) {
  var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
     array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: mime});
}

function decorateWhatsAppLink(text) {
  //set up the url
  let url = 'whatsapp://send?text=';

  //define the message text
  // var text = 'Hey check out this awesome blog at https://madole.xyz';

  //encode the text
  let encodedText = encodeURIComponent(text);

  //find the link
  let whatsappEl = document.getElementById('whatsapp');

  //set the href attribute on the link
  whatsappEl.href = url + encodedText
  // $whatsApp.attr('href', url + encodedText);
}

const addVideoStream = (userId, local) => {
  let videoGrid = document.getElementById('video-grid'); 

  let video1 = document.createElement('div');
  video1.id = userId;
  video1.className = 'me';
  if(local) {
  video1.style.transform = "rotateY(180deg)";
  }
  videoGrid.appendChild(video1);

  const videoBorder = document.createElement('div')
  videoBorder.className = 'not-winner'
  videoBorder.setAttribute("id", userId + "-1")
  videoBorder.append(video1)
  // add glow
  const s1 = document.createElement('span')
  const s2 = document.createElement('span')
  const s3 = document.createElement('span')
  const s4 = document.createElement('span')

  videoBorder.append(s1)
  videoBorder.append(s2)
  videoBorder.append(s3)
  videoBorder.append(s4)

  // videoGrid.append(myText);
  const videoBox = document.createElement('div');
  videoBox.className = "video-box";
  videoBox.setAttribute("id", userId + "-2");
  // videoBox.style.setProperty("--width", "640px");
  // videoBox.style.setProperty("--height", "480px");
  videoGrid.append(videoBox);
  videoBox.append(videoBorder);
}

// Remove the video stream from the container.
function removeVideoStream(elementId) {
        let remoteDiv = document.getElementById(elementId);
        console.log('removeElement ', remoteDiv);
        if (remoteDiv) {
        	let parent1 = remoteDiv.parentNode;
        	let parent2 = parent1.parentNode;
        	let parent3 = parent2.parentNode;
        	parent3.removeChild(parent2);
        }
        // if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
};

const scrollToBottom = () => {
  let d = $('.main_chat_window');
  d.scrollTop(d.prop("scrollHeight")); 
}

// Mute video
const muteUnmute = () => {
  // console.log('myVideoStream', myVideoStream);
  let enabled = myAudioStream.enabled;
  console.log("enabled", enabled)
  if (enabled) {
      myAudioStream.enabled = false; 
      console.log("enabled after", myAudioStream.enabled)
      setUnmuteButton();
  } else {
      setMuteButton(); 
      myAudioStream.enabled = true;
      console.log("enabled after", myAudioStream.enabled)
  }
}

const setMuteButton = () => {
  const html = `<i class="fas fa-microphone"></i><span>Mute</span>`

  document.querySelector('.main_mute_button').innerHTML = html
}

const setUnmuteButton = () => {
  const html = `<i class="unmute fas fa-microphone-slash"></i><span>Unmute</span>`

  document.querySelector('.main_mute_button').innerHTML = html
}


// Stop Video
const playStop = () => {
  let enabled = myVideoStream.enabled;
  if (enabled) {
      myVideoStream.enabled = false;
      setPlayVideo();
  } else {
      setStopVideo();
      myVideoStream.enabled = true;
  }
}

const setStopVideo = () => {
  const html = `<i class="fas fa-video"></i><span>Stop Video</span>`
  document.querySelector('.main_video_button').innerHTML = html
}

const setPlayVideo = () => {
  const html = `<i class="stop fas fa-video-slash"></i><span>Play Video</span>`
  document.querySelector('.main_video_button').innerHTML = html
}

// Send the signal of readiness to dance
const readyToDance = () => {
	imgFade = 255;
}

// Play/Stop Music
function musicPlay() {
	if (soundFile.isPlaying()) {
	  // .isPlaying() returns a boolean
	  soundFile.stop();
    if (dj === uID) {
      setPlayMusic();
    } else {
      setReadyDance();
    }
	  partyStatus = false;
	  socket.emit('partyStatus', false);
	} else {
	  soundFile.play();
	  // console.log('music', soundFile)
	  setPauseMusic();
	  partyStatus = true;
    winnerText = "";
	  socket.emit('partyStatus', true);
    if (winnerId) {
      const videoBorder = document.getElementById(winnerId + "-1");
	    videoBorder.className = "not-winner";
    }
	}
}
const handlePlay = (vidElem, playURL) => {
  // if (!partyStatus) {
    // play audio
    if (soundFile && soundFile.isPlaying()) {
      soundFile.stop();
      delayS = 1500;
    }
    let musicObj = musicFiles.find( (obj) => obj.name === vidElem.id );
    console.log('element id ', vidElem.id);
    console.log('musicObj ', musicObj);
    soundFile = musicObj.file;
    setTimeout(function(){ 
      soundFile.play(); 
    }, delayS);
    // play video
    const srcUrl = playURL;
    const workoutVid = document.getElementById('warmup');
    workoutVid.src= srcUrl;
    // show pause button
    setPauseMusic();
    // emit party status
    const partyObj = {
      partyStatus: true,
      srcURL: srcUrl,
      name: vidElem.id
    }
    partyStatus = true;
    socket.emit('partyStatus', partyObj);
    // reset state to dance mode
    winnerText = "";
    if (winnerId) {
      const videoBorder = document.getElementById(winnerId + "-1");
      videoBorder.className = "not-winner";
    }  
    // calories calculator start time
    curRT = Date.now();
  // }
}
const dancePlay = () => {
  if (!partyStatus) {
    // play audio
    setTimeout(function(){ 
      soundFile = musicFiles[0].file;
      console.log('musicFile 1', soundFile);
      soundFile.play(); 
    }, 1000);
    // play video
    const workoutVid = document.getElementById('warmup');
    const srcURL = 'https://youtube.com/embed/iL6ufJLkiUo?autoplay=1&mute=1&rel=0&showinfo=0&autohide=1';
    workoutVid.src= srcURL;
    // show pause button
    setPauseMusic();
	  // emit party status
    const partyObj = {
      partyStatus: true,
      srcURL: srcURL,
      name: 'cheapthrills'
    }
    partyStatus = true;
	  socket.emit('partyStatus', partyObj);
    // reset state to dance mode
    winnerText = "";
    if (winnerId) {
      const videoBorder = document.getElementById(winnerId + "-1");
	    videoBorder.className = "not-winner";
    }
    // calories calculator start time
    curRT = Date.now();
  } else {
    // stop audio
    soundFile.stop();
    delayS = 1000;
    // stop the video
    const workoutVid = document.getElementById('warmup');
    const srcURL = 'https://www.youtube.com/embed/XPmBnnon0Ek?&autoplay=1&mute=1';
    workoutVid.src= srcURL;
    // show play/ready button
    if (dj === uID) {
      setPlayMusic();
    } else {
      setReadyDance();
    }
    // change party status
    const partyObj = {
      partyStatus: false,
      srcURL: srcURL,
      name: 'cheapthrills'
    }
	  partyStatus = false;
	  socket.emit('partyStatus', partyObj);
    // final calories burned
    if (!prevRT) {
      prevRT = curRT;
      curRT = Date.now();
      kcal += 1.8*mass*(curRT-prevRT)/3600000;
    } else {
      prevRT = curRT;
      curRT = Date.now();
      if ( (curRT-prevRT) > 5000 ) {
        kcal += 7.3*mass*5000/3600000 + 1.8*mass*(curRT-prevRT-5000)/3600000;
      } else {
        kcal += 7.3*mass*(curRT-prevRT)/3600000;
      }  
    }
    // Include calories in congrats modal
    const congrats = document.querySelector('.congrats');
    congrats.style.display = "flex";
    const closeBtn = document.getElementById("close")
	  closeBtn.addEventListener("click", () => {
		  congrats.style.display = "none"
	  })

    // const calBurned = document.createElement('p');
    // calBurned.innerHTML = String(Math.round(kcal));
    // const calElem = document.querySelector('.congrats-cal');
    // calElem.appendChild(calBurned);
    // // Include dance pts in congrats modal
    // const dancePts = document.createElement('p');
    // dancePts.innerHTML = String(danceScore);
    // const ptsElem = document.querySelector('.congrats-pts');
    // ptsElem.appendChild(dancePts);
    let text = "I've burned " + String(Math.round(kcal)) + " Calories and earned " + String(danceScore) + ` dance points!\n Join this dance workout app at https://rhytmie.com/`;   
    decorateWhatsAppLink(text);
    // Download congrats image
    let dataURL = myCanvas.elt.toDataURL();
    let imgURL = URL.createObjectURL(dataURItoBlob(dataURL));
    document.getElementById("winImg").src = imgURL;
    showDownload("downloadDiv", "downloadImg", imgURL, 'congratsImage');
  }
}

function setPlaylist() {
  const html = `<i class="fas fa-list" style="font-size: 2em;"></i><div class="controls_text">Playlist</div>`
  document.querySelector('.playlist_btn').innerHTML = html;
}
function setPlayMusic() {
  const html = `<i class="fas fa-play-circle" style="font-size: 2em;"></i><div class="controls_text">Play</div>`;
  document.querySelector('.play_button').innerHTML = html;
}
function setPauseMusic() {
  const html = `<i class="fas fa-stop-circle" style="font-size: 2em;"></i><div class="controls_text">Stop</div>`;
  document.querySelector('.play_button').innerHTML = html;
}
function setReadyDance() {
  const html = `<i class="fas fa-paper-plane" style="font-size: 2em;"></i><div class="controls_text">Start</div>`;
  document.querySelector('.play_button').innerHTML = html;
}

const recordParty = () => {
	if (!recording) {
		setStopRecord();
		startRecording();
	} else {
		setStartRecord();
		recorder.stop();
		recordStream.getVideoTracks()[0].stop();
		recordStream.getAudioTracks()[0].stop();
		recording = false;
	}
}

async function startRecording() {
  recordStream = await navigator.mediaDevices.getDisplayMedia({
    video: { displaySurface: "browser" },
    audio: true
  });
  let options = {
    mimeType: 'video/webm; codecs=vp8'
  }
  recorder = new MediaRecorder(recordStream, options);
  const chunks = [];
  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = e => {
    partyURL = addPartyVideo(chunks);
  };

  recorder.start();
  recording = true;
}

const addPartyVideo = async (chunks) => {
  // Convert .webm to .mp4
  const partyRecord = new Uint8Array(await (new Blob(chunks)).arrayBuffer());
  await ffmpeg.load();
  console.log("ffmpeg loaded");
  ffmpeg.FS('writeFile', 'partyVideo.webm', await fetchFile(partyRecord));
  console.log('recording written in fs and transcoding started');
  await ffmpeg.run('-i', 'partyVideo.webm', 'partyVideo.mp4');
  console.log('transcoding has been finished');
  const data = ffmpeg.FS('readFile', 'partyVideo.mp4');
  const completeBlob = new Blob([data.buffer], { type: 'video/mp4' });
  // const completeBlob = new Blob(chunks, { type: chunks[0].type });
	const video = document.createElement('video');
	const url = URL.createObjectURL(completeBlob);
  // Add video to HTML
	video.src = url;
	// console.log('download url ', url);
	// console.log('media type ', chunks[0].type);
	video.controls = true;
	const videoGrid = document.getElementById('video-grid'); 
	const videoBox = document.createElement('div');
	videoBox.className = "video-box";
	const videoBorder = document.createElement('div')
	videoBorder.className = 'not-winner'
  videoBorder.append(video);
  videoBox.append(videoBorder);
  videoGrid.append(videoBox);
  // Resize video-grid
	debouncedRecalculateLayout();
  // Download button
  showDownload("download", 'linkload', url, 'partyVideo');
  return url;
}

const showDownload = (downElem, linkElem, url, fileName) => {
  const downloadBtn = document.getElementById(downElem);
  downloadBtn.style = 'display: flex !important;';
  let a = document.getElementById(linkElem);
  a.style = 'display: flex;'
  a.href = url;
  a.download = fileName;
}

const setStartRecord = () => {
	const html = `<i class="record_meeting fas fa-record-vinyl"></i><span>Record</span>`;
	document.querySelector('.record_button').innerHTML = html;
}

const setStopRecord = () => {
	const html = `<i class="record_meeting far fa-stop-circle"></i><span>Stop Recording</span>`;
	document.querySelector('.record_button').innerHTML = html;
}

const openChat = () => {
	const mainRight = document.getElementById("main-right");
	const mainVideos = document.getElementById("main-videos");
	if (chatIsOpen) {
		mainRight.style.display = "none";
		mainVideos.style.width = "100vw";
		// mainVideos.style.marginRight = "0";
		chatIsOpen = false;
	} else {
		mainRight.style.display = "flex";
		mainVideos.style.width = "80vw";
		chatIsOpen = true;
	}
}

const openPlaylist = () => {
  const mainPlaylist = document.getElementById("main-playlist");
  const mainVideos = document.getElementById("main-videos");
  if (playlistIsOpen) {
    mainPlaylist.style.display = "none";
    mainVideos.style.width = "100vw";
    playlistIsOpen = false;
  } else {
    mainPlaylist.style.display = "flex";
    mainVideos.style.width = "80vw";
    playlistIsOpen = true;
  }
}
const leaveChat = () => {
	removeVideoStream(uID);
}
////////////////////////////////////////////////////////////////////////////
function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i=0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
    // console.log(poseLabel);
  }
  // console.log(results[0].confidence)
  classifyPose();
}
  
function rhythm(dtUp, dtDown, prevdtUp, prevdtDown, curJoint, prevJoint, prevT, jointAxis, threshold, count, confidence) {
  if (confidence > 0.8 && partyStatus) {
    if (prevT === 0) {
      curT = Date.now();
      prevT = curT - 100;
    } else {
      curT = Date.now();
    }
    if ( curJoint > prevJoint + threshold ) {
      dtUp += curT - prevT;
    } else if ( curJoint < prevJoint - threshold ) { 
      dtDown += curT - prevT;
    }
  
    if ( abs(dtUp - dtDown) < 200 && (dtUp > 200 && dtDown > 200) && count === 1) {
      //   playerScore += 1;
      //   console.log('jointAxis', jointAxis, 'dtUp', dtUp, 'dtDown', dtDown);
      labelBeat = "";
      labelCoord = "";
      label = "Good!";
      textFade = 255;
      // playerScore += 1;
      beatScore += 2;
      dtUp = 0;
      dtDown = 0;
      count = 0;
      rhythmT = Date.now();
      // console.log('rhythmT', rhythmT);
      // coordination queue
      const jointTime = {
        'time': 0,
        'joint': ''
      };    
      const regex = /^([^.]+)/;
      const joint = jointAxis.match(regex)[0];
    
      jointTime.time = curT;
      jointTime.joint = joint;
      coordQueue.push(jointTime);
      // final calories burned
      if (!prevRT) {
        prevRT = curRT;
        curRT = Date.now();
        kcal += 1.8*mass*(curRT-prevRT)/3600000;
      } else {
        prevRT = curRT;
        curRT = Date.now();
        if ( (curRT-prevRT) > 5000 ) {
          kcal += 7.3*mass*5000/3600000 + 1.8*mass*(curRT-prevRT-5000)/3600000;
        } else {
          kcal += 7.3*mass*(curRT-prevRT)/3600000;
        }  
      }
    } else if ( abs(dtUp - dtDown) < 200 && (dtUp > 200 && dtDown > 200) && count === 0 ) {
      count += 1;
      dtUp = 0;
      dtDown = 0;
      } 
      // else {
      //   label = "Dance. Score " + playerScore;
      // }
    
    if (dtUp > 2000 || dtDown > 2000) {
      dtUp = 0;
      dtDown = 0;
      count = 0;
    }
    prevJoint = curJoint;
    prevT = curT;
    prevdtUp = dtUp;
    prevdtDown = dtDown;  
  }

  return [prevJoint, prevT, prevdtUp, prevdtDown, dtUp, dtDown, count]
}

function coordination(cQueue) {
  if (cQueue.length > 1) {
    const jointTime1 = cQueue.shift();
    const jointTime2 = cQueue.shift();
    const joint1 = jointTime1.joint;
    const joint2 = jointTime2.joint;
    const time1 = jointTime1.time;
    const time2 = jointTime2.time;
    if (abs(time1 - time2) < 200 && joint1 != joint2) {
      // console.log('time1', time1, 'time2', time2);
      // console.log('joint1', joint1, 'joint2', joint2);
      labelBeat = "";
      label = "";
      labelCoord = "Awesome!";
      textFade = 255;
      // playerScore += 5;
      beatScore += 5;
      genFlakes(width / 2, height / 2);
    } 
    // else {
    //   labelCoord = "Keep it up"
    // }
  }
  return cQueue
}

function beatRhythm(beatT, rhythmT) {
  if (abs(beatT - rhythmT) < 200 && beatT && rhythmT && partyStatus) {
    // console.log('beatT', beatT, ' rhythmT ', rhythmT);
    beatT = 1; rhythmT = 200001;
    beatScore += 10;
    labelBeat = "Super!";
    labelCoord = "";
    label = "";
    textFade = 255;
    genFlakes(width / 2, height / 2);
  } 
  // else {
  //   labelBeat = 'Beat Score' + beatScore;
  // } 
  return [beatT, rhythmT];
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    // console.log('pose', pose);
    skeleton = poses[0].skeleton;
    // console.log('skeleton', skeleton);
    
    // pose confidence threshold
    if (pose.leftElbow.confidence > 0.8 && pose.leftEye.confidence > 0.8 && pose.rightElbow.confidence > 0.8 && pose.rightEye.confidence > 0.8) {
      // Casting effects 
      lWX = pose.leftWrist.x;
      lWY = pose.leftWrist.y;
      // console.log('left wrist x ', lWX);
      // console.log('left wrist y ', lWY);
      if (soundFile.isPlaying()) {
        next = 0;
        painting = true;
        previous.x = pose.leftWrist.x;
        previous.y = pose.leftWrist.y;
        paths.push(new Path());
        // console.log('bubble painting', painting);
      } else {
        painting = false;
      }
      // console.log('beatscore', beatScore);
      n += 1;
      // console.log('n', n);

      // Nose groove (Head & Shoulders) X swing
      let noseX = rhythm(nose.x.dtUp, nose.x.dtDown, nose.x.prevdtUp, nose.x.prevdtDown, pose.nose.x, nose.x.prevJoint, nose.x.prevT, nose.x.jointAxis, nose.x.threshold, nose.x.count, pose.nose.confidence);
      nose.x.prevJoint = noseX[0];
      nose.x.prevT = noseX[1];
      nose.x.prevdtUp = noseX[2];
      nose.x.prevdtDown = noseX[3];
      nose.x.dtUp = noseX[4];
      nose.x.dtDown = noseX[5];
      nose.x.count = noseX[6];

      // Nose groove (Head & Shoulders) Y swing
      let noseY = rhythm(nose.y.dtUp, nose.y.dtDown, nose.y.prevdtUp, nose.y.prevdtDown, pose.nose.y, nose.y.prevJoint, nose.y.prevT, nose.y.jointAxis, nose.y.threshold, nose.y.count, pose.nose.confidence);
      nose.y.prevJoint = noseY[0];
      nose.y.prevT = noseY[1];
      nose.y.prevdtUp = noseY[2];
      nose.y.prevdtDown = noseY[3];
      nose.y.dtUp = noseY[4];
      nose.y.dtDown = noseY[5];
      nose.y.count = noseY[6];

      // leftWrist X swinging
      let leftWristX = rhythm(wrist.left.x.dtUp, wrist.left.x.dtDown, wrist.left.x.prevdtUp, wrist.left.x.prevdtDown, pose.leftWrist.x, wrist.left.x.prevJoint, wrist.left.x.prevT, wrist.left.x.jointAxis, wrist.left.x.threshold, wrist.left.x.count, pose.leftWrist.confidence);
      wrist.left.x.prevJoint = leftWristX[0];
      wrist.left.x.prevT = leftWristX[1];
      wrist.left.x.prevdtUp = leftWristX[2];
      wrist.left.x.prevdtDown = leftWristX[3];
      wrist.left.x.dtUp = leftWristX[4];
      wrist.left.x.dtDown = leftWristX[5];
      wrist.left.x.count = leftWristX[6];
        
      // leftWrist Y oscillation
      let leftWristY = rhythm(wrist.left.y.dtUp, wrist.left.y.dtDown, wrist.left.y.prevdtUp, wrist.left.y.prevdtDown, pose.leftWrist.y, wrist.left.y.prevJoint, wrist.left.y.prevT, wrist.left.y.jointAxis, wrist.left.y.threshold, wrist.left.y.count, pose.leftWrist.confidence);
      wrist.left.y.prevJoint = leftWristY[0];
      wrist.left.y.prevT = leftWristY[1];
      wrist.left.y.prevdtUp = leftWristY[2];
      wrist.left.y.prevdtDown = leftWristY[3];
      wrist.left.y.dtUp = leftWristY[4];
      wrist.left.y.dtDown = leftWristY[5];
      wrist.left.y.count = leftWristY[6];
        
      // rightWrist X oscillation
      let rightWristX = rhythm(wrist.right.x.dtUp, wrist.right.x.dtDown, wrist.right.x.prevdtUp, wrist.right.x.prevdtDown, pose.rightWrist.x, wrist.right.x.prevJoint, wrist.right.x.prevT, wrist.right.x.jointAxis, wrist.right.x.threshold, wrist.right.x.count, pose.rightWrist.confidence);
      wrist.right.x.prevJoint = rightWristX[0];
      wrist.right.x.prevT = rightWristX[1];
      wrist.right.x.prevdtUp = rightWristX[2];
      wrist.right.x.prevdtDown = rightWristX[3];
      wrist.right.x.dtUp = rightWristX[4];
      wrist.right.x.dtDown = rightWristX[5];
      wrist.right.x.count = rightWristX[6];

      // rightWrist Y oscillation
      let rightWristY = rhythm(wrist.right.y.dtUp, wrist.right.y.dtDown, wrist.right.y.prevdtUp, wrist.right.y.prevdtDown, pose.rightWrist.y, wrist.right.y.prevJoint, wrist.right.y.prevT, wrist.right.y.jointAxis, wrist.right.y.threshold, wrist.right.y.count, pose.rightWrist.confidence);
      wrist.right.y.prevJoint = rightWristY[0];
      wrist.right.y.prevT = rightWristY[1];
      wrist.right.y.prevdtUp = rightWristY[2];
      wrist.right.y.prevdtDown = rightWristY[3];
      wrist.right.y.dtUp = rightWristY[4];
      wrist.right.y.dtDown = rightWristY[5];
      wrist.right.y.count = rightWristY[6];

      // leftShoulder X oscillation
      let leftShoulderX = rhythm(shoulder.left.x.dtUp, shoulder.left.x.dtDown, shoulder.left.x.prevdtUp, shoulder.left.x.prevdtDown, pose.leftShoulder.x, shoulder.left.x.prevJoint, shoulder.left.x.prevT, shoulder.left.x.jointAxis, shoulder.left.x.threshold, shoulder.left.x.count, pose.leftShoulder.confidence);
      shoulder.left.x.prevJoint = leftShoulderX[0];
      shoulder.left.x.prevT = leftShoulderX[1];
      shoulder.left.x.prevdtUp = leftShoulderX[2];
      shoulder.left.x.prevdtDown = leftShoulderX[3];
      shoulder.left.x.dtUp = leftShoulderX[4];
      shoulder.left.x.dtDown = leftShoulderX[5];
      shoulder.left.x.count = leftShoulderX[6];

      // leftShoulder Y oscillation
      let leftShoulderY = rhythm(shoulder.left.y.dtUp, shoulder.left.y.dtDown, shoulder.left.y.prevdtUp, shoulder.left.y.prevdtDown, pose.leftShoulder.y, shoulder.left.y.prevJoint, shoulder.left.y.prevT, shoulder.left.y.jointAxis, shoulder.left.y.threshold, shoulder.left.y.count, pose.leftShoulder.confidence);
      shoulder.left.y.prevJoint = leftShoulderY[0];
      shoulder.left.y.prevT = leftShoulderY[1];
      shoulder.left.y.prevdtUp = leftShoulderY[2];
      shoulder.left.y.prevdtDown = leftShoulderY[3];
      shoulder.left.y.dtUp = leftShoulderY[4];
      shoulder.left.y.dtDown = leftShoulderY[5];
      shoulder.left.y.count = leftShoulderY[6];

      // rightShoulder X oscillation
      let rightShoulderX = rhythm(shoulder.right.x.dtUp, shoulder.right.x.dtDown, shoulder.right.x.prevdtUp, shoulder.right.x.prevdtDown, pose.rightShoulder.x, shoulder.right.x.prevJoint, shoulder.right.x.prevT, shoulder.right.x.jointAxis, shoulder.right.x.threshold, shoulder.right.x.count, pose.rightShoulder.confidence);
      shoulder.right.x.prevJoint = rightShoulderX[0];
      shoulder.right.x.prevT = rightShoulderX[1];
      shoulder.right.x.prevdtUp = rightShoulderX[2];
      shoulder.right.x.prevdtDown = rightShoulderX[3];
      shoulder.right.x.dtUp = rightShoulderX[4];
      shoulder.right.x.dtDown = rightShoulderX[5];
      shoulder.right.x.count = rightShoulderX[6];

      // rightShoulder Y oscillation
      let rightShoulderY = rhythm(shoulder.right.y.dtUp, shoulder.right.y.dtDown, shoulder.right.y.prevdtUp, shoulder.right.y.prevdtDown, pose.rightShoulder.y, shoulder.right.y.prevJoint, shoulder.right.y.prevT, shoulder.right.y.jointAxis, shoulder.right.y.threshold, shoulder.right.y.count, pose.rightShoulder.confidence);
      shoulder.right.y.prevJoint = rightShoulderY[0];
      shoulder.right.y.prevT = rightShoulderY[1];
      shoulder.right.y.prevdtUp = rightShoulderY[2];
      shoulder.right.y.prevdtDown = rightShoulderY[3];
      shoulder.right.y.dtUp = rightShoulderY[4];
      shoulder.right.y.dtDown = rightShoulderY[5];
      shoulder.right.y.count = rightShoulderY[6];
      
      // leftHip X swinging
      let leftHipX = rhythm(hip.left.x.dtUp, hip.left.x.dtDown, hip.left.x.prevdtUp, hip.left.x.prevdtDown, pose.leftHip.x, hip.left.x.prevJoint, hip.left.x.prevT, hip.left.x.jointAxis, hip.left.x.threshold, hip.left.x.count, pose.leftHip.confidence);
      hip.left.x.prevJoint = leftHipX[0];
      hip.left.x.prevT = leftHipX[1];
      hip.left.x.prevdtUp = leftHipX[2];
      hip.left.x.prevdtDown = leftHipX[3];
      hip.left.x.dtUp = leftHipX[4];
      hip.left.x.dtDown = leftHipX[5];
      hip.left.x.count = leftHipX[6];

      // leftHip Y swinging
      let leftHipY = rhythm(hip.left.y.dtUp, hip.left.y.dtDown, hip.left.y.prevdtUp, hip.left.y.prevdtDown, pose.leftHip.y, hip.left.y.prevJoint, hip.left.y.prevT, hip.left.y.jointAxis, hip.left.y.threshold, hip.left.y.count, pose.leftHip.confidence);
      hip.left.y.prevJoint = leftHipY[0];
      hip.left.y.prevT = leftHipY[1];
      hip.left.y.prevdtUp = leftHipY[2];
      hip.left.y.prevdtDown = leftHipY[3];
      hip.left.y.dtUp = leftHipY[4];
      hip.left.y.dtDown = leftHipY[5];
      hip.left.y.count = leftHipY[6];

      // rightHip X swinging
      let rightHipX = rhythm(hip.right.x.dtUp, hip.right.x.dtDown, hip.right.x.prevdtUp, hip.right.x.prevdtDown, pose.rightHip.x, hip.right.x.prevJoint, hip.right.x.prevT, hip.right.x.jointAxis, hip.right.x.threshold, hip.right.x.count, pose.rightHip.confidence);
      hip.right.x.prevJoint = rightHipX[0];
      hip.right.x.prevT = rightHipX[1];
      hip.right.x.prevdtUp = rightHipX[2];
      hip.right.x.prevdtDown = rightHipX[3];
      hip.right.x.dtUp = rightHipX[4];
      hip.right.x.dtDown = rightHipX[5];
      hip.right.x.count = rightHipX[6];

      // rightHip Y swinging
      let rightHipY = rhythm(hip.right.y.dtUp, hip.right.y.dtDown, hip.right.y.prevdtUp, hip.right.y.prevdtDown, pose.rightHip.y, hip.right.y.prevJoint, hip.right.y.prevT, hip.right.y.jointAxis, hip.right.y.threshold, hip.right.y.count, pose.rightHip.confidence);
      hip.right.y.prevJoint = rightHipY[0];
      hip.right.y.prevT = rightHipY[1];
      hip.right.y.prevdtUp = rightHipY[2];
      hip.right.y.prevdtDown = rightHipY[3];
      hip.right.y.dtUp = rightHipY[4];
      hip.right.y.dtDown = rightHipY[5];
      hip.right.y.count = rightHipY[6];

      // leftKnee X swinging
      let leftKneeX = rhythm(knee.left.x.dtUp, knee.left.x.dtDown, knee.left.x.prevdtUp, knee.left.x.prevdtDown, pose.leftKnee.x, knee.left.x.prevJoint, knee.left.x.prevT, knee.left.x.jointAxis, knee.left.x.threshold, knee.left.x.count, pose.leftKnee.confidence);
      knee.left.x.prevJoint = leftKneeX[0];
      knee.left.x.prevT = leftKneeX[1];
      knee.left.x.prevdtUp = leftKneeX[2];
      knee.left.x.prevdtDown = leftKneeX[3];
      knee.left.x.dtUp = leftKneeX[4];
      knee.left.x.dtDown = leftKneeX[5];
      knee.left.x.count = leftKneeX[6];

      // leftKnee Y swinging
      let leftKneeY = rhythm(knee.left.y.dtUp, knee.left.y.dtDown, knee.left.y.prevdtUp, knee.left.y.prevdtDown, pose.leftKnee.y, knee.left.y.prevJoint, knee.left.y.prevT, knee.left.y.jointAxis, knee.left.y.threshold, knee.left.y.count, pose.leftKnee.confidence);
      knee.left.y.prevJoint = leftKneeY[0];
      knee.left.y.prevT = leftKneeY[1];
      knee.left.y.prevdtUp = leftKneeY[2];
      knee.left.y.prevdtDown = leftKneeY[3];
      knee.left.y.dtUp = leftKneeY[4];
      knee.left.y.dtDown = leftKneeY[5];
      knee.left.y.count = leftKneeY[6];

      // rightKnee X swinging
      let rightKneeX = rhythm(knee.right.x.dtUp, knee.right.x.dtDown, knee.right.x.prevdtUp, knee.right.x.prevdtDown, pose.rightKnee.x, knee.right.x.prevJoint, knee.right.x.prevT, knee.right.x.jointAxis, knee.right.x.threshold, knee.right.x.count, pose.rightKnee.confidence);
      knee.right.x.prevJoint = rightKneeX[0];
      knee.right.x.prevT = rightKneeX[1];
      knee.right.x.prevdtUp = rightKneeX[2];
      knee.right.x.prevdtDown = rightKneeX[3];
      knee.right.x.dtUp = rightKneeX[4];
      knee.right.x.dtDown = rightKneeX[5];
      knee.right.x.count = rightKneeX[6];

      // rightKnee Y swinging
      let rightKneeY = rhythm(knee.right.y.dtUp, knee.right.y.dtDown, knee.right.y.prevdtUp, knee.right.y.prevdtDown, pose.rightKnee.y, knee.right.y.prevJoint, knee.right.y.prevT, knee.right.y.jointAxis, knee.right.y.threshold, knee.right.y.count, pose.rightKnee.confidence);
      knee.right.y.prevJoint = rightKneeY[0];
      knee.right.y.prevT = rightKneeY[1];
      knee.right.y.prevdtUp = rightKneeY[2];
      knee.right.y.prevdtDown = rightKneeY[3];
      knee.right.y.dtUp = rightKneeY[4];
      knee.right.y.dtDown = rightKneeY[5];
      knee.right.y.count = rightKneeY[6];

      coordQueue = coordination(coordQueue);
      // console.log('beatT ', beatT, ' rhythmT ', rhythmT);
      let insync = beatRhythm(beatT, rhythmT);
      beatT = insync[0]; rhythmT = insync[1];
      if (beatScore >= winScore && uID) {
        danceScore = beatScore;
        beatScore = 0;
        winnerText = "The Winner!"
        console.log('winner is declared!')
        socket.emit('winner', uID);
      }
  
    }
  }
}
function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {

  let sVal = beatScore;
  let Progress = map(sVal,0,winScore,100,width-60);
  var level = amplitude.getLevel();
  // console.log('volume is ', level);
  detectBeat(level);

  // distort the rectangle based based on the amp
  var distortDiam = map(level, 0, 1, 0, 1200);
  var w = rectMin;
  var h = rectMin;

  // distortion direction shifts each beat
  if (rectRotate) {
    var rotation = PI/ 2;
  } else {
    var rotation = PI/ 3;
  }

  // rotate the drawing coordinates to rectCenter position
  var rectCenter = createVector(width/3, height/2);

  push();
  // Mirroring video
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);
    // Trail Bubbles ========================================
  // If it's time for a new point
  if (millis() > next && painting) {

    // Grab mouse position
    // console.log('lwx', lWX, 'lwy ', lWY);      
    current.x = lWX;
    current.y = lWY;

    // New particle's force is based on mouse movement
    var force = p5.Vector.sub(current, previous);
    force.mult(0.05);

    // Add new particle
    paths[paths.length - 1].add(current, force);
    // Schedule next circle
    next = millis() + random(100);

    // Store mouse values
    previous.x = current.x;
    previous.y = current.y;
  }
    // Draw all paths
  for( var i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }

  // if (pose) {
  //   for (let i = 0; i < skeleton.length; i++) {
  //     let a = skeleton[i][0];
  //     let b = skeleton[i][1];
  //     strokeWeight(2);
  //     stroke(0);

  //     line(a.position.x, a.position.y, b.position.x, b.position.y);
  //   }
  //   for (let i = 0; i < pose.keypoints.length; i++) {
  //     let x = pose.keypoints[i].position.x;
  //     let y = pose.keypoints[i].position.y;
  //     fill(0);
  //     stroke(255);
  //     ellipse(x, y, 16, 16);
  //   }
  // }

  
  // Fireworks
  for(let i = 0; i < flakes.length; i++) {
    flakes[i].pos.add(flakes[i].vel);
    flakes[i].size--;
    if(flakes[i].size > 0) {
      stroke(flakes[i].color);
      strokeWeight(flakes[i].size);
      point(flakes[i].pos.x, flakes[i].pos.y);
    } else {
      flakes.splice(i, 1);
    }
  }
  
  // push();
  // draw the rectangles
  for (var i = 0; i < numRects; i++) {
    var x = rectCenter.x + rectOffset * i;
    var y = rectCenter.y + distortDiam/2;
    // rotate around the center of this rectangle
    fill(255, 255, 255);
    noStroke();
    translate(x, y); 
    rotate(rotation);
    rect(0, 0, rectMin, rectMin + distortDiam);
  }

  pop();

  background(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);

  fill(20, 255, 236);  
  textSize(25);
  textFont('monospace')
  let txt = text('Points : '+ sVal,80,17);
  rect(30,30,Progress,22,15)

  strokeWeight(4);
  stroke(247, 246, 231)
  noFill();
  rect(30,30,width-60,22,15)


// Praise text 
  if (textFade > 0) {
    fill(255, 0, 255, textFade);
    strokeWeight(6);
    stroke(247, 246, 231);
    textSize(80);
    textAlign(CENTER, CENTER);
    text(label, width / 2, height / 3.5);
    textFade -= 2;
  } else {
    label = "";
  }

  if (textFade > 0) {
    fill(255, 154, 0, textFade);
    strokeWeight(6);
    stroke(247, 246, 231);
    textSize(80);
    textAlign(CENTER, CENTER);
    text(labelBeat, width / 2, height / 3.5);
    textFade -= 2;
  } else {
    labelBeat = "";
  }

  if (textFade > 0) {
    fill(20, 255, 236, textFade);
    strokeWeight(6);
    stroke(247, 246, 231);
    textSize(80);
    textAlign(CENTER, CENTER);
    text(labelCoord, width / 2, height / 3.5);
    textFade -= 2;
  } else {
    labelCoord = "";
  }
  
  // Winner announced
  if (winnerText) {
    fill(20, 255, 236, textFade);
    strokeWeight(6);
    stroke(247, 246, 231);
    textSize(80);
    textAlign(CENTER, CENTER);
    text(winnerText, width / 2, height / 2);
  } 

  // Workout Report
  fill(255, 255, 255);
  noStroke();
  textSize(30);
  textAlign(CENTER, CENTER);
  text("Calories", width / 1.5, height / 1.2);
  fill(255, 255, 255);
  noStroke();
  textSize(30);
  textAlign(CENTER, CENTER);
  text(kcal, width / 1.5, height / 1.1);
  image(kcalIcon, width / 1.65, height / 1.7);
  
  fill(255, 255, 255);
  noStroke();
  textSize(30);
  textAlign(CENTER, CENTER);
  text("Dance Points", 200, 400);
  fill(255, 255, 255);
  noStroke();
  textSize(30);
  textAlign(CENTER, CENTER);
  text(danceScore, 200, 430);
  image(danceIcon, 150, 280);

  // Dancing Smiley
  if (imgFade > 0) {
    // Image
  	tint(255, imgFade);
  	image(dancer, 50, 300);
    // Text
    fill(20, 255, 236, imgFade);
    strokeWeight(6);
    stroke(247, 246, 231);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("I WANT TO DANCE", width / 1.7, height / 1.2);
    imgFade -= 0.5;
  }

  noTint();
}

function detectBeat(level) {
  if (level  > beatCutoff && level > beatThreshold){
    beatT = Date.now();
    // console.log('beatT', beatT);
    onBeat();
    beatCutoff = level *1.2;
    framesSinceLastBeat = 0;
  } else{
    if (framesSinceLastBeat <= beatHoldFrames){
      framesSinceLastBeat ++;
    }
    else{
      beatCutoff *= beatDecayRate;
      beatCutoff = Math.max(beatCutoff, beatThreshold);
    }
  }
}

function onBeat() {
  backgroundColor =  [random(0,255), random(0,255), random(0,255), 100];
  rectRotate = !rectRotate;
}
// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   background(0, 0, 0, 0);
// }

function genFlakes(x, y) {
  let i = 100;
  while(i--) {
    flakes.push({
      color: color(color('hsl(' + floor(random(349)) + ', 100%, 50%)')),
      pos: createVector(x, y),
      vel: p5.Vector.fromAngle(random(2*PI)).mult(random(10)),
      size: random(50)
    });
  }
}

function handleCopy() {
    let text = $("#url").get(0)
    let selection = window.getSelection();
    let range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
    //add to clipboard.
    document.execCommand('copy');
}

class Path {
  constructor() {
    this.particles = [];
    this.hue = random(100);
  }
  
  add(position, force) {
    // Add a new particle with a position, force, and hue
    this.particles.push(new Particle(position, force, this.hue))
  }
  
  update() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
  }
  
  display() {
    // Loop through backwards
    for (var i = this.particles.length - 1; i >= 0; i--) {
      // If we shold remove it
      if (this.particles[i].lifespan <= 0) {
        this.particles.splice(i, 1);
      // Otherwise, display it
      } else {
        this.particles[i].display(this.particles[i+1]);
      }
    }
  }
}

class Particle {
  constructor(position, force, hue) {
      this.position = createVector(position.x, position.y);
      this.velocity = createVector(force.x, force.y);
      this.drag = 0.95;
      this.lifespan = 255;
      this.size = 5;
  }
  
  update() {
      // Move it
    this.position.add(this.velocity);
    // Slow it down
    this.velocity.mult(this.drag);
    // Fade it out
    this.lifespan--;
    this.size += 0.05;
  }
  
  display() {
      noStroke();
      fill(255, this.lifespan*2);    
      ellipse(this.position.x,this.position.y-(this.size*20), this.size, this.size);    
  }
}
