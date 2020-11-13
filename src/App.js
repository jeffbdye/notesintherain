import logo from './logo.svg';
import { useRef, useState, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import './App.css';
var interval = null;
function App() {
  const [playing, setPlaying] = useState(false)
  const [instrument, setInstrument] = useState({name: 'pipa', fileCount: 25})
  const [bg, setBg] = useState('#415976');
  // const [noteInterval, setNoteInterval] = useState(null);
  // let noteInterval = null;
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
        const fileNumber = 1 + Math.floor(Math.random() * Math.floor(instrument.fileCount));
        files[i] = `notes/${instrument.name}/${fileNumber}.mp3`;
        offsets[i] = offsetChoice !== 3 ? offsetChoice : .5 + Math.random();
      }
      //1 second between each, 2 seconds between each, random for each
      let offsetTotal = 0;
      files.forEach( (file, index) => {
        offsetTotal = offsetChoice === 0 ? 0: offsetTotal + offsets[index];
        notes[index].current.audioEl.current.src = file;
        setTimeout(() => {
          const bgOptions = ['#415976a6', '#add9ce', '#2492b1', '#125e8f', '#bae5d8', '#41597666'];
          const bgChange = bgOptions[Math.floor(Math.random() * Math.floor(6))];
          setBg(bgChange);
          setTimeout(() => setBg('#415976'), 100);
          notes[index].current.audioEl.current.play()
        }, offsetTotal * 1000)
      });
    }, delay)
  }

  useEffect( () => {
    first.current.audioEl.current.play();
    setPlaying(true);
    interval = setInterval(playNotes, 7500);
    console.log(interval)
    // setNoteInterval(interval)
  }, [])

  useEffect( () => {
    clearInterval(interval);
    // setNoteInterval(null);
    interval = setInterval(playNotes, 7500);
    // setNoteInterval(setInterval(playNotes, 7500))
    // setNoteInterval(interval);
  }, [instrument])

  const pause = () => {
    setPlaying(false);
    setTransitioning(false);
    first.current.audioEl.current.pause();
    second.current.audioEl.current.pause();
    first.current.audioEl.current.currentTime = 0;
    second.current.audioEl.current.currentTime = 0;
    console.log(interval)
    clearInterval(interval);
    // setNoteInterval(null);
  }

  const play = () => {
    setPlaying(true);
    first.current.audioEl.current.play();
    interval = setInterval(playNotes, 7500)
    // setNoteInterval(setInterval(playNotes, 7500));
  }
  
  return (
    <div className="App">
      <div style={{background: bg}} className="container">
        <span className="options">options</span>
        <div className="instruments">
          <span className="instrument" style={{textDecoration: (instrument.name === 'vibes' ? 'underline' : 'unset')}} onClick={() => setInstrument({name: 'vibes', fileCount: 18})}>
            vibraphone
          </span>
          <span className="instrument" style={{textDecoration: (instrument.name === 'pipa' ? 'underline' : 'unset')}} onClick={() => setInstrument({name: 'pipa', fileCount: 25})}>
            pipa
          </span>
          <span className="instrument" style={{textDecoration: (instrument.name === 'guzheng' ? 'underline' : 'unset')}} onClick={() => setInstrument({name: 'guzheng', fileCount: 20})}>
            guzheng
          </span>
        </div>

        {playing ? <img onClick={() => pause()} className="image" src={'tears.gif'}/> : <img onClick={() => play()} className="image" src={'tears.png'}/>}
      </div>
      <ReactAudioPlayer
        src="rain.mp3"
        listenInterval={1000}
        onListen={(time) => onListen(time, true)}
        ref={first}
      />
      <ReactAudioPlayer
        src="rain.mp3"
        ref={second}
        listenInterval={1000}
        onListen={(time) => onListen(time, false)}
      />
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
