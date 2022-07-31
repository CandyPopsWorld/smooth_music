import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';

import { AudioContext } from './context/AudioContext';
import { FirebaseContext } from './context/FirebaseContext';
import { TabsContext } from './context/TabsContext';

import './global.scss';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <FirebaseContext>
    <TabsContext>
      <AudioContext>
          <App/>
      </AudioContext>
    </TabsContext>
  </FirebaseContext>
);