import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';
import Contexts from './components/contexts/Contexts';
import './global.scss';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Contexts>
    <App/>
  </Contexts>
);