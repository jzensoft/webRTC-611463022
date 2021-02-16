import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';


var peer = new Peer({ host: 'localhost', port: 9000, path: '/myapp', secure: false }); 

const App = () => {

  const [myID, setMyID] = useState('')
  const [friendID, setFriendID] = useState('')
  const [mystream, setsMytream] = useState()

  const [stateConnect, setStateConnect] = useState(false)

  const myVideo = useRef();
  const friendVideo = useRef();

  useEffect(() => {

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setsMytream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    })

    peer.on('open', id => {
      setMyID(id);
    });

    peer.on('connection', _newConn => {
      setStateConnect(true)
    });

    peer.on("disconnect", () => {
      setStateConnect(false)
    });

    // Answer
    peer.on('call', call => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream)
          call.on('stream', stream => {
            friendVideo.current.srcObject = stream
          })
        })
        .catch((err) => {
          console.error('Failed to get local stream', err);
        });
    })

  }, []);


  function startConnection() {
    
    peer.connect(friendID);
    setStateConnect(true)

    // Call
    let call = peer.call(friendID, mystream)
    call.on('stream', stream => {
      friendVideo.current.srcObject = stream
    })

  }

  // My Video
  let MyVideo;
  if (mystream) {
    MyVideo = (
      <video playsInline muted ref={myVideo} autoPlay />
    );
  }

  // Friend Video
  let FriendVideo;
  if (friendVideo) {
    FriendVideo = (
      <video playsInline muted ref={friendVideo} autoPlay />
    );
  }

  return (
    <div className="App">
      <div>
        <h4>My ID: {myID}</h4>
        {
          stateConnect ?
            <h6 style={{ color: "green" }}>Connected</h6>
            :
            <h6 style={{ color: "red" }}>Not Connected</h6>
        }
        <input type="text" placeholder="Enter Friend ID" name="callID" onChange={e => setFriendID(e.target.value)} />
        <button onClick={startConnection}>Connect</button>
      </div>
      <div>
        <h1>My Video</h1>
        {MyVideo}
      </div>
      <hr />
      <div>
        <h1>Friend Video</h1>
        {
          stateConnect ? FriendVideo : ('')
        }
      </div>
    </div>
  );
}

export default App;