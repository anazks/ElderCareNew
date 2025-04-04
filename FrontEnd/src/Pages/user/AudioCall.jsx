import React, { useState, useEffect } from 'react';
import './AudioCall.css'; // Import the CSS file

function AudioCall() {
  const [callStatus, setCallStatus] = useState('idle'); // idle, calling, connected, ended
  const [ringAudio, setRingAudio] = useState(null);
  const [callAudio, setCallAudio] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);

  // Initialize audio on component mount
  useEffect(() => {
    // Create audio objects
    const ringSound = new Audio('/ring.mp3'); // Replace with your ring sound
    const callSound = new Audio('/call.mp3'); // Replace with your call sound
    
    ringSound.loop = true;
    setRingAudio(ringSound);
    setCallAudio(callSound);
    
    // Cleanup function
    return () => {
      if (ringSound) ringSound.pause();
      if (callSound) callSound.pause();
      if (timer) clearInterval(timer);
    };
  }, []);

  // Handle call timer
  useEffect(() => {
    if (callStatus === 'connected') {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      setTimer(interval);
      return () => clearInterval(interval);
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [callStatus]);

  // Format time for display (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Handle starting a call
  const startCall = () => {
    setCallStatus('calling');
    if (ringAudio) {
      ringAudio.currentTime = 0;
      ringAudio.play().catch(e => console.error("Could not play ring sound:", e));
    }
  };

  // Handle answering a call
  const answerCall = () => {
    if (ringAudio) ringAudio.pause();
    setCallStatus('connected');
    setElapsedTime(0);
    if (callAudio) {
      callAudio.currentTime = 0;
      callAudio.play().catch(e => console.error("Could not play call sound:", e));
    }
  };

  // Handle ending a call
  const endCall = () => {
    if (ringAudio) ringAudio.pause();
    if (callAudio) callAudio.pause();
    setCallStatus('ended');
    setTimeout(() => setCallStatus('idle'), 2000);
  };

  return (
    <div className="call-container">
      <h2 className="call-title">Caregiver Call Center</h2>
      
      {/* Call Status Display */}
      <div className="status-display">
        {callStatus === 'idle' && (
          <p className="status-text idle">Ready to connect with patient</p>
        )}
        {callStatus === 'calling' && (
          <p className="status-text calling">Calling patient...</p>
        )}
        {callStatus === 'connected' && (
          <div>
            <p className="status-text connected">Connected</p>
            <p className="timer-text">{formatTime(elapsedTime)}</p>
          </div>
        )}
        {callStatus === 'ended' && (
          <p className="status-text ended">Call ended</p>
        )}
      </div>
      
      {/* Call Controls */}
      <div className="call-controls">
        {callStatus === 'idle' && (
          <button 
            onClick={startCall}
            className="call-button start-call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="call-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Patient
          </button>
        )}
        
        {callStatus === 'calling' && (
          <div className="button-group">
            <button 
              onClick={answerCall}
              className="call-button answer-call"
            >
              Answer (Demo)
            </button>
            <button 
              onClick={endCall}
              className="call-button end-call"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="call-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
              End Call
            </button>
          </div>
        )}
        
        {callStatus === 'connected' && (
          <button 
            onClick={endCall}
            className="call-button end-call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="call-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
            End Call
          </button>
        )}
      </div>
    </div>
  );
}

export default AudioCall;