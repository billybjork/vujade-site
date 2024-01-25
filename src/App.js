import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { useInView } from 'react-intersection-observer';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const Video = ({ src }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      loading="lazy"
      className={inView ? 'fade-in' : ''}
    />
  );
};

function App() {
  const [scenes, setScenes] = useState([]);

  useEffect(() => {
    axios.get('https://fierce-springs-10022-1e7f8f8c4e94.herokuapp.com/videos')
      .then(response => {
        setScenes(shuffleArray(response.data));
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <div className="App">
      <div className="video-grid">
        {scenes.map(scene => (
          <Video key={scene.sceneURL} src={scene.sceneURL} />
        ))}
      </div>
    </div>
  );
}

export default App;
