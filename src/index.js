import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';

import { AudioContext } from './context/AudioContext';
import { FirebaseContext } from './context/FirebaseContext';

import './global.scss';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <FirebaseContext>
    <AudioContext>
        <App/>
    </AudioContext>
  </FirebaseContext>
);