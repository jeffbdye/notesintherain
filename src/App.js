import logo from './logo.svg';
import { useRef, useState, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import './App.css';

function App() {
  const first = useRef(null);
  const second = useRef(null);
  const note1 = useRef(null);
  const note2 = useRef(null);
  const note3 = useRef(null);
  const notes = [note1, note2, note3];
  const [transitioning, setTransitioning] = useState(false);
  const length = 175;
  const onListen = (time, isFirst) => {
    if (!transitioning && Math.abs(length - time) <= 3) {
      setTransitioning(true)
      if (isFirst) {
        second.current.audioEl.current.play();
        first.current.audioEl.current.pause();
        first.current.audioEl.current.currentTime = 0;
      } else {
        first.current.audioEl.current.play();
        second.current.audioEl.current.pause();
        second.current.audioEl.current.currentTime = 0;
      }
      setTimeout( () => setTransitioning(false), 3000)
    }
    
  }
  const playNotes = () => {
    // const delay = Math.floor(Math.random() * Math.floor(22)) * 1000;
    const delay = 0;
    setTimeout(() => {
      const numberOfNotes = 1 + Math.floor(Math.random() * Math.floor(3));
      const files = [];
      const offsets = [];
      const offsetChoice = Math.floor(Math.random() * Math.floor(4));
      for (let i = 0; i < numberOfNotes; i++) {
        const fileNumber = 1 + Math.floor(Math.random() * Math.floor(25));
        files[i] = `notes/pipa/${fileNumber}.mp3`;
        offsets[i] = offsetChoice !== 3 ? offsetChoice : .5 + Math.random();
      }
      //1 second between each, 2 seconds between each, random for each
      let offsetTotal = 0;
      files.forEach( (file, index) => {
        offsetTotal = offsetChoice === 0 ? 0: offsetTotal + offsets[index];
        notes[index].current.audioEl.current.src = file;
        setTimeout(() => {
          notes[index].current.audioEl.current.play()
        }, offsetTotal * 1000)
      });
    }, delay)
  }

  useEffect( () => {
    setInterval(playNotes, 7500)
  }, [])
  
  return (
    <div className="App">
      <ReactAudioPlayer
        src="rain.mp3"
        autoPlay
        controls
        listenInterval={1000}
        onListen={(time) => onListen(time, true)}
        ref={first}
      />
      <ReactAudioPlayer
        src="rain.mp3"
        controls
        ref={second}
        listenInterval={1000}
        onListen={(time) => onListen(time, false)}
      />
      <div onClick={playNotes}>
        BEGIN
      </div>
      <ReactAudioPlayer
        ref={note1}
        src={'notes/pipa/1.mp3'}
        volume={.5}
      />
      <ReactAudioPlayer
        ref={note2}
        src={'notes/pipa/1.mp3'}
        volume={.5}
      />
      <ReactAudioPlayer
        ref={note3}
        src={'notes/pipa/1.mp3'}
        volume={.5}
      />
    </div>
  );
}

export default App;
