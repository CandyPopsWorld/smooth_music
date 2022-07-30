import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';

import { AudioContext } from './context/AudioContext';

import './global.scss';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AudioContext>
      <App/>
  </AudioContext>
);