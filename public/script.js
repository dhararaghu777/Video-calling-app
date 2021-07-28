const socket= io('/')

// vidoe access
const videoGrid= document.getElementById('video-grid');

const myVideo= document.createElement('video');
myVideo.muted=true;

let myVideoStream;

// peer setup
const peer= new Peer(undefined, {
    path : '/peerjs',
    host : '/',
    port : '443'
})

// accessing video and audio using javascript
navigator.mediaDevices.getUserMedia({
    video: true,
    audio : true
}).then(stream=>{
    myVideoStream= stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call=>{
        call.answer(stream);
        const video= document.createElement('video');
        call.on('stream', userVideoStream=>{
            addVideoStream(video, userVideoStream);
        })
    })

    socket.on('user-connected', (userId)=>{
    connectToNewUser(userId, stream);
    });

})

// socket.io

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})


const connectToNewUser = (userId, stream)=>{
    const call = peer.call(userId, stream);
    const video= document.createElement('video');
    call.on('stream', (userVideoStream)=>{
        addVideoStream(video, userVideoStream);
    })
}


const addVideoStream =(video, stream)=>{
    video.srcObject= stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play();
    })

    videoGrid.append(video);
}


function getText(ele){
    const event= new Event();
    if(event.keyCode===13){
        console.log('text',ele.value);
    }
    console.log('text end', ele.value)
}

let input= document.querySelector('input');
input.addEventListener('keydown', (event)=>{
  
    if(event.key==='Enter' && input.value.length!==0){
        // console.log(input.value);
        socket.emit('message', input.value);
        input.value="";
    } 
})

socket.on('createMessage', (message)=>{
    // console.log(message);
    let ul= document.querySelector('ul');
    ul.innerHTML+=`<li class="message">
    <b>user</b><br/>${message}</li>`;
    scrollToBottom();
})

const scrollToBottom=()=>{
    const scroll= document.querySelector('.main__chat__window');
    scroll.scrollTop=scroll.scrollHeight;
}

//For mute and Unmute
const muteUnmute= ()=>{
    const enabled= myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }
    else{
        myVideoStream.getAudioTracks()[0].enabled=true;
        setMuteButton();
    }
}

const setMuteButton=()=>{
    const html=`<i class="fas fa-microphone"></i>
                <span>Mute</span>`;
    document.querySelector('.main__mute__button').innerHTML=html;
}

const setUnmuteButton=()=>{
        const html=`<i class="unmute fas fa-microphone-slash"></i>
                    <span>Unmute</span>`;
        document.querySelector('.main__mute__button').innerHTML=html;

}


// Play and Stop the video

const playStop=()=>{
    const enabled= myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled=false;
        setStopVideo();
    }
    else{
        myVideoStream.getVideoTracks()[0].enabled=true;
        setPlayVideo();
    }
}

const setStopVideo=()=>{
    const html=`<i class="unmute fas fa-video-slash"></i>
                 <span>Play video</span>`;
            document.querySelector('.main__video__button').innerHTML=html;

}

const setPlayVideo=()=>{
    const html=`<i class="fas fa-video"></i>
                 <span>Stop video</span>`;
            document.querySelector('.main__video__button').innerHTML=html;

}