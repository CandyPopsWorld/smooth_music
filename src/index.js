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

// const ViewSetFile = () => {
//   const [file, setFile] = useState('');
//   //Создаем ссылку на облачное хранилище
//   const {storage} = useFirebaseContext();
//   // console.log(storageRef);
//   console.log('file:', file);

//   const uploadFile = (file) => {

//     const id = '1234567';
//     const storageRef = ref(storage, id);

//     uploadBytes(storageRef, file)
//     .then(() => {
//       console.log('File Upload!');
//     })
//     .catch(() => {

//     })
//   };

//   const getFileInput = (event) => {
//     let file = event.target.files[0];
//     setFile(file);
//     console.log('file:', file);
//     console.log('file name:', file.name);
//   }

//   return (
//     <>
//       <input type="file" onChange={getFileInput}/>
//       <button onClick={() => uploadFile(file)}>Добавить файл в storage</button>
//     </>
//   )
// }

// const ViewGetFile = () => {
//   const [file, setFile] = useState(null);
//   const {storage} = useFirebaseContext();
//   const pathReference = ref(storage, '1234567');

//   const downloadFile = () => {
//     getDownloadURL(pathReference)
//     .then((url) => {
//       setFile(<audio src={url} controls/>);
//     })
//     .catch(() => {

//     })
//   }

//   return (
//     <>
//       <button onClick={downloadFile}>Скачать файл</button>
//       {
//         file
//       }
//     </>
//   )
// };


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <FirebaseContext>
    <DatabaseContext>
      <UploadContext>
        <TabsContext>
          <AudioContext>
              <App/>
          </AudioContext>
        </TabsContext>
      </UploadContext>
    </DatabaseContext>
  </FirebaseContext>
);