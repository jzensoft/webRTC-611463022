import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

var peer = new Peer({ host: 'localhost', port: 9000, path: '/myapp', secure: false });
var conn = peer.connect();

const App = () => {

  const [myID, setMyID] = useState('')
  const [friendID, setFriendID] = useState('')
  const [connected, setConnected] = useState(false)
  const [files, setFiles] = useState([])

  useEffect(() => {

    peer.on('open', id => {
      setMyID(id)
    })

    peer.on('connection', connection => {

      conn = connection
      setConnected(true)

      connection.on('open', () => {
      })

      connection.on('data', (data) => {
        onReceiveData(data)
      })

    })

  }, [])

  const Connect = (friendD) => {
    conn = peer.connect(friendID)

    conn.on('open', () => {
      setConnected(true)
    })

    conn.on('data', (data) => {
      onReceiveData(data)
    })
  }

  const SendFile = (e) => {

    const file = e.target.files[0]

    if (file.size <= 5242880) {
      const blob = new Blob(e.target.files, { type: file.type })

      conn.send({
        file: blob,
        filename: file.name,
        filetype: file.type
      })
    } else {
      alert("The file is larger than 5 MB.")
    }

  }

  const onReceiveData = (data) => {

    const blob = new Blob([data.file], { type: data.filetype })
    const url = URL.createObjectURL(blob)

    addFile({ 'name': data.filename, 'url': url })
  }

  const addFile = (file) => {
    const data = { name: file.name, url: file.url }
    setFiles(files => [...files, data])
  }

  return (
    <div className="App">
      <h3>
        My ID : {myID}
      </h3>

      {
        connected ? (
          <h4 style={{ color: "green" }}>Connected</h4>
        ) : (
            <h4 style={{ color: "red" }}>Not Connect</h4>
          )
      }

      {
        connected ? (
          <div>
            <input type="file" name="file" id="file" onChange={e => SendFile(e)} />
          </div>
        ) : (
            <div>
              <input type="text" value={friendID} onChange={e => setFriendID(e.target.value)} placeholder={myID}/>
              <button type="submit" onClick={() => Connect(friendID)}>Connect</button>
            </div>
          )
      }

      <div>
        <ul>
          {
            files.map((file, index) => (
              <li key={index}><a href={file.url} download={file.name} >{file.name}</a></li>
            ))
          }
        </ul>
      </div>

    </div>
  );
}

export default App;
