import React from 'react';

function SplashScreen() {
  return (
    <div id="splash-section" className="splash-screen">
      <div className="splash-screen">
        <div className="splash-content">
          <div className="splash-text">
             <p style={{ textAlign: 'center' }}>
            </p>
            <p>
              The Rubik’s Cube has 43,000,000,000,000,000,000 possible combinations... and <i>one</i> solution.
            </p>
            <br></br>
            <p>
              It's easy to appreciate the puzzle in its solved form: a universe of possibility reduced to six harmonic faces. But <i>leaving</i> it solved would squander all that potential.
            </p>
            <br></br>
            <p>
              <b>VU JA DE</b> exists to scramble “solved” arrangements of cultural ephemera. To flip the switch from <i style={{ color: 'blue' }}>solving</i> to <i style={{ color: 'blue' }}>playing.</i> From <i style={{ color: 'blue' }}>I've been here before</i> to <i style={{ color: 'blue' }}>I've never seen this before.</i> From <i style={{ color: 'blue' }}>déjà vu</i> to <i style={{ color: 'blue' }}>vujà de.</i>
            </p>
            <br></br>
            <p>
              Like the 43 quintillion permutations of the Rubik's Cube, these stories are starting points, not resolutions. They're not made for an algorithmic feed or a distracted scroll, which is why they come to your email. Explore on your own time, at your own pace, with nobody trying to sell you something in the process.
            </p>
            <br></br>
            <div className="splash-embed" style={{ display: 'flex', justifyContent: 'center' }}>
            <iframe
            src="https://vujadeworld.substack.com/embed"
            width="480"
            height="150"
            style={{ border: '0px solid #EEE', background: 'black' }}
            title="VUJADE Substack"
          ></iframe>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
