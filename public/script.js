
const socket = io('/');

// peer setup
const myPeer= new Peer(undefined, {
    path : 'peerjs',
    host : '/',
    port : '443'
})



// vidoe access
const videoGrid= document.getElementById('video-grid');

const myVideo= document.createElement('video');
myVideo.muted=true;

let myVideoStream;
const peers={}
 
// accessing video and audio using javascript
navigator.mediaDevices.getUserMedia({
    video: true,
    audio : true
}).then(stream=>{
    myVideoStream= stream;
    addVideoStream(myVideo, stream);

    myPeer.on('call', call=>{
        call.answer(stream);
        const video= document.createElement('video');
        call.on('stream', userVideoStream=>{
            addVideoStream(video, userVideoStream);
        })
    })

    socket.on('user-connected', (userId)=>{
        connectToNewUser(userId, stream);
    });

    
});


    //input value
let input = document.querySelector('.text-data');
input.addEventListener('keydown', (event) => {

        if (event.key === 'Enter' && input.value.length !== 0) { 
            console.log(input.value);
            socket.emit('message', input.value);
            input.value = "";
        }
    });

let input1= document.querySelector(".text-data-1");
input1.addEventListener('keydown', (event) => {

        if (event.key === 'Enter' && input1.value.length !== 0) { 
            console.log(input1.value);
            socket.emit('message', input1.value);
            input1.value = "";
        }
    });
    

    socket.on('createMessage', (message) => {
         
        const li=`<li class="message">
            <b>user</b><br/>${message}</li>`;

        // console.log(message);
        let ul = document.querySelector('.messages-1');
        ul.innerHTML += li;
        
        // console.log(ul.innerHTML,"ul-1");
        let ul1 = document.querySelector('.messages-2');
        ul1.innerHTML += li;
        // console.log(ul1.innerHTML,"ul-2")
         
        
        scrollToBottom();
    });

socket.on('user-disconnected', userId => {
    if (peers[userId])
    {
        peers[userId].close()
    }    
})


// socket.io

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})


const connectToNewUser = (userId, stream)=>{
    const call = myPeer.call(userId, stream);
    const video= document.createElement('video');
    call.on('stream', (userVideoStream)=>{
        addVideoStream(video, userVideoStream);
    })

    call.on('close', ()=>{
        video.remove();
    })

    peers[userId]=call;
}


const addVideoStream =(video, stream)=>{
    video.srcObject= stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play();
    })

    videoGrid.append(video);
}



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


//Opena and Close the chat box

let open=false;
const chatOpenClose=()=>{
    let chat=document.querySelector('.main__right__chat2');

    if(open){
        open=!open;
        chat.className="main__right__chat2 close";
    }
    else{
        open=!open;
        chat.className='main__right__chat2 open';
    }

}

const leaveMeeting=()=>{
    console.log('close meeting');
    // let customWindow = window.open('/', '_blank', '');
    // customWindow.close();
     if(navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {  
		 	window.open(location, '_self').close();
		 	window.location.href="about:blank";  
	        　　　　 window.close();  
	    }else {  
	        window.opener = null;  
	        window.open("", "_self");  
	        window.close();  
	        open(location, '_self').close();
	    }  
}
