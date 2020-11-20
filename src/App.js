import logo from './logo.svg';
import { useRef, useState, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import './App.css';
var interval = null;
function App() {
  const [onlyChords, setOnlyChords] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [instrument, setInstrument] = useState({ name: 'pipa', fileCount: 25 });
  const [bg, setBg] = useState('#415976');
  const [rainVolume, setRainVolume] = useState(.5);
  const first = useRef(null);
  const second = useRef(null);
  const note1 = useRef(null);
  const note2 = useRef(null);
  const note3 = useRef(null);
  const notes = [note1, note2, note3];
  const [transitioning, setTransitioning] = useState(false);
  const rainTrackCycleLength = 175;
  const onListen = (currentPlayTime, isFirst) => {
    if (!transitioning && Math.abs(rainTrackCycleLength - currentPlayTime) <= 3) {
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
      setTimeout(() => setTransitioning(false), 3000);
    }

  }
  const playNotes = () => {
    // const delay = Math.floor(Math.random() * Math.floor(22)) * 1000;
    const delay = 0;
    setTimeout(() => {
      const numberOfNotes = onlyChords ? 3 : 1 + Math.floor(Math.random() * Math.floor(3));
      let files = [];
      let offsets = [];
      const offsetChoice = onlyChords ? 0 : Math.floor(Math.random() * Math.floor(4));
      for (let i = 0; i < numberOfNotes; i++) {
        const fileNumber = 1 + Math.floor(Math.random() * Math.floor(instrument.fileCount));
        files[i] = `notes/${instrument.name}/${fileNumber}.mp3`;
        offsets[i] = offsetChoice !== 3 ? offsetChoice : .5 + Math.random();
      }
      //1 second between each, 2 seconds between each, random for each
      let offsetTotal = 0;
      files.forEach((file, index) => {
        offsetTotal = offsetChoice === 0 ? 0 : offsetTotal + offsets[index];
        notes[index].current.audioEl.current.src = file;
        setTimeout(() => {
          const bgOptions = ['#415976a6', '#add9ce', '#2492b1', '#125e8f', '#bae5d8', '#41597666'];
          const bgChange = bgOptions[Math.floor(Math.random() * Math.floor(6))];
          setBg(bgChange);
          setTimeout(() => setBg('#415976'), 100);
          notes[index].current.audioEl.current.play()
        }, offsetTotal * 1000);
      });
    }, delay)
  }

  useEffect(() => {
    clearInterval(interval);
    if (playing) {
      interval = setInterval(playNotes, 7500);
    }
  }, [instrument, onlyChords])

  const pause = () => {
    setPlaying(false);
    setTransitioning(false);
    first.current.audioEl.current.pause();
    second.current.audioEl.current.pause();
    first.current.audioEl.current.currentTime = 0;
    second.current.audioEl.current.currentTime = 0;
    clearInterval(interval);
  }

  const play = () => {
    setPlaying(true);
    first.current.audioEl.current.play();
    interval = setInterval(playNotes, 7500);
  }

  const onRainVolumeChange = (event) => {
    const vol = parseFloat(event.target.value);
    setRainVolume(vol);
  }

  return (
    <div className="App">
      <div style={{ background: bg }} className="container">
        {playing ? <img onClick={() => pause()} className="image" src={'tears.gif'} /> : <img onClick={() => play()} className="image" src={'tears.png'} />}
        <div className="option-section">instrument</div>
        <div className="option-label">
          <button className="option" style={{ textDecoration: (instrument.name === 'vibes' ? 'underline' : 'unset') }} onClick={() => setInstrument({ name: 'vibes', fileCount: 18 })}>
            vibraphone
          </button>
          <button className="option" style={{ textDecoration: (instrument.name === 'pipa' ? 'underline' : 'unset') }} onClick={() => setInstrument({ name: 'pipa', fileCount: 25 })}>
            pipa
          </button>
          <button className="option" style={{ textDecoration: (instrument.name === 'guzheng' ? 'underline' : 'unset') }} onClick={() => setInstrument({ name: 'guzheng', fileCount: 20 })}>
            guzheng
          </button>
        </div>
        <div className="option-section">volume</div>
        <div className="section">
          <label className="option-label">rain</label>
          <input type="range" min="0" max="1.0" step="0.01" value={rainVolume} onChange={onRainVolumeChange}></input>
        </div>
        <div>
          <div className="option-section">only chords?</div>
          <div className="option-label">
            <span className="option option-label" onClick={() => setOnlyChords(!onlyChords)}>{onlyChords ? '[yup]' : 'yup'}</span>
            <span className="option option-label" onClick={() => setOnlyChords(!onlyChords)}>{!onlyChords ? '[nope]' : 'nope'}</span>
          </div>
        </div>

      </div>
      <ReactAudioPlayer
        src="rain.mp3"
        listenInterval={1000}
        onListen={(time) => onListen(time, true)}
        ref={first}
        volume={rainVolume}
      />
      <ReactAudioPlayer
        src="rain.mp3"
        listenInterval={1000}
        onListen={(time) => onListen(time, false)}
        ref={second}
        volume={rainVolume}
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
