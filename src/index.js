import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';

import { AudioContext } from './context/AudioContext';
import { FirebaseContext, useFirebaseContext } from './context/FirebaseContext';
import { TabsContext } from './context/TabsContext';

import './global.scss';

import {ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { UploadContext } from './context/UploadContext';
import { DatabaseContext } from './context/DatabaseContext';
import { AlbumContext } from './context/AlbumContext';
import { FavoritesContext } from './context/FavoritesContext';
import { SearchContext } from './context/SearchContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <FirebaseContext>
    <FavoritesContext>
      <AlbumContext>
        <DatabaseContext>
          <UploadContext>
            <TabsContext>
              <AudioContext>
                <SearchContext>
                  <App/>
                </SearchContext>
              </AudioContext>
            </TabsContext>
          </UploadContext>
        </DatabaseContext>
      </AlbumContext>
    </FavoritesContext>
  </FirebaseContext>
);