import { useState } from 'react';
import { useUploadContext } from '../../context/UploadContext';
import ReactAudioPlayer from 'react-audio-player';
import {ref, uploadBytes} from "firebase/storage";
import {doc, getDoc, arrayUnion, setDoc, updateDoc} from 'firebase/firestore';
import { useFirebaseContext } from '../../context/FirebaseContext';
import Loader from '../loader/Loader';
import './UploadSection.scss';
function UploadSection(props) {
    const {file, 
        setFile, 
        textOfMusic,
        setTextOfMusic, 
        fileUpload,
        setFileUpload, 
        loading, 
        setLoading, 
        clearUploadContext,
        nameMusic,
        setNameMusic,
        authorMusic,
        setAuthorMusic,
        album,
        setAlbum,
        durationMusic,
        setDurationMusic,
        albumId,
        setAlbumId
    } = useUploadContext();
    const {storage, db} = useFirebaseContext();
    const [currentPreviewTime, setCurrentPreviewTime] = useState(0);
    const [valueTextArea, setValueTextArea] = useState('');
    const [visibleTextArea, setVisibleTextArea] = useState(true);
    // const [filePredProsmotr, setFilePredProsmotr] = useState(null);

    const currentPreviewTimeFloor = (currentTime) => {
        const floorTime = Math.floor(currentTime);
        setCurrentPreviewTime(floorTime);
    }

    const getFileInput = (event) => {
        const blob = window.URL || window.webkitURL;
        let file = event.target.files[0];
        const fileURL = blob.createObjectURL(file);
        // console.log(file);
        setFile(<ReactAudioPlayer src={fileURL} controls listenInterval={1000} onListen={currentPreviewTimeFloor}/>);
        setFileUpload(file);
    };

    const addListItem = () => {
        const newObject = {titleOrigin: '', titleTranslate: '', timeStart: 0};
        setTextOfMusic(prev => [...prev,newObject]);
    };

    const updateListItem = (index, origin, translate, time) => {
        const newObject = {titleOrigin: origin, titleTranslate: translate, timeStart: time};
        const newArray = [...textOfMusic.slice(0,index), newObject, ...textOfMusic.slice(index + 1)];
        setTextOfMusic(newArray);
        // console.log(index);
    };

    let elements_inputs_list = null;
    elements_inputs_list = textOfMusic.map(({titleOrigin, titleTranslate, timeStart},i) => {
        return (
            <InputItem 
            titleOrigin={titleOrigin} 
            titleTranslate={titleTranslate} 
            timeStart={timeStart} 
            updateListItem={updateListItem} 
            key={i}
            keyId={i}
            currentPreviewTime={currentPreviewTime}/>
        )
    });


    const uploadFile = (file, maxId) => {

        const storageRef = ref(storage, `audio/${maxId}`);
        updateMaxIdAudio(file, maxId);
        uploadBytes(storageRef, file)
        .then(() => {
          console.log('File Upload!');
        })
        .catch(() => {
    
        })
    };

    const uploadCollectionDb = async (file, maxId) => {
        await setDoc(doc(db, 'audio', maxId), {
            name: nameMusic,
            author: authorMusic,
            album: album,
            textOfMusic: textOfMusic,
            id: maxId,
            duration: durationMusic,
            albumId: albumId,
        })
        clearUploadContext();
        setCurrentPreviewTime(0);
        setLoading(false);
    };

    const updateMaxIdAudio = async (file, maxId) => {
        const idsRef = await doc(db, 'ids', 'ids');
        await updateDoc(idsRef, {
            maxId: maxId
        });
    };

    const uploadContentAudioOnFirebase = (object) => {
        const maxIdNum = +object.maxId;
        const maxIdStr = String(maxIdNum + 1);
        console.log(maxIdNum);
        console.log(maxIdStr);
        console.log(object);
        if(nameMusic !== '' && authorMusic !== ''){
            setLoading(true);
            uploadFile(fileUpload, maxIdStr);
            uploadCollectionDb(fileUpload, maxIdStr);
            updateAlbumDoc(fileUpload, maxIdStr);
        }
    };

    const transform_value_textarea = () => {
        const text = valueTextArea.split('\n');
        text.forEach(item => {
          item = item.split('~');
          const object = {titleOrigin: item[0],titleTranslate: item[1], timeStart: item[2]};
          setTextOfMusic(prev => [...prev, object]);
          console.log(object);
          setValueTextArea('');
          setVisibleTextArea(false);
          // console.log(item);
        })
        // console.log(text);
      };

      const updateAlbumDoc = async (file, maxId) => {
        const albumRef = await doc(db, 'albums', albumId);
        updateDoc(albumRef,{
            musics: arrayUnion({title: nameMusic, idAudio: maxId})
        })
      };

      const getMaxIdAudio = async () => {
        const docRef = doc(db, 'ids', 'ids');
        const docSnap = await getDoc(docRef);
        // await setAlbumIds(docSnap.data());
        await uploadContentAudioOnFirebase(docSnap.data());
      };
    
    if(file !== null){
        // console.log(file);
    }

    return (
            <div className='user_upload'>
                {
                    loading === false ?
                <>
                    <div className="user_upload_header">
                        <h2>Загрузка аудио</h2>
                    </div>

                    {
                        file !== null ?
                        <>
                            <p>Предпросмотр загруженного аудио</p>
                            {file}
                            <p>Текущее время: {currentPreviewTime}</p>
                        </>
                        :
                        null
                    }

                    <div className="user_upload_file">
                        <input type="file" onChange={getFileInput}/>
                    </div>

                    <div className="user_upload_text_header">
                        <h2>Введите основные данные аудио</h2>
                    </div>

                    <div className="user_upload_base_data_list">
                        <div className="user_upload_base_data_list_item">
                            <label htmlFor="">Название аудио</label>
                            <input 
                            type="text" 
                            name='name'
                            id='name'
                            defaultValue={nameMusic}
                            onChange={(e) => setNameMusic(e.target.value)}/>
                        </div>

                        <div className="user_upload_base_data_list_item">
                            <label htmlFor="">Альбом</label>
                            <input 
                            type="text" 
                            name='album'
                            id='album'
                            defaultValue={album}
                            onChange={(e) => setAlbum(e.target.value)}/>
                        </div>

                        <div className="user_upload_base_data_list_item">
                            <label htmlFor="">Альбом(ID)</label>
                            <input 
                            type="text" 
                            name='albumID'
                            id='albumID'
                            defaultValue={albumId}
                            onChange={(e) => setAlbumId(e.target.value)}/>
                        </div>

                        <div className="user_upload_base_data_list_item">
                            <label htmlFor="">Автор(группа)</label>
                            <input 
                            type="text" 
                            name={'author'}
                            id='author'
                            defaultValue={authorMusic}
                            onChange={(e) => setAuthorMusic(e.target.value)}/>
                        </div>

                        <div className="user_upload_base_data_list_item">
                            <label htmlFor="">Продолжительность</label>
                            <input 
                            type="text" 
                            name={'duration'}
                            id='duration'
                            defaultValue={durationMusic}
                            onChange={(e) => setDurationMusic(e.target.value)}/>
                        </div>
                    </div>

                    <div className="user_upload_text_header">
                        <h3>Введите перевод текста</h3>
                    </div>
                    
                    <div className="user_upload_translate_list">
                        {elements_inputs_list}
                    </div>
{/* 
                    {
                        visibleTextArea ?
                        <div className="user_upload_translate_textarea">
                            <textarea name="" id="" cols="150" rows="5" value={valueTextArea} onChange={(e) => setValueTextArea(e.target.value)}></textarea>
                            <button onClick={transform_value_textarea}>Преобразовать в массив</button>
                        </div>
                        :
                        null   
                    } */}

                    <div className="user_upload_plus" onClick={addListItem}>
                        +
                    </div>

                    <button onClick={getMaxIdAudio}>Загрузить музыку в облачное хранилище</button>
                </>

                :
                <Loader/>
            }


        </div>
    );
};


const InputItem = ({titleOrigin, titleTranslate, timeStart, updateListItem,keyId, currentPreviewTime}) => {
    const [origin,setOrigin] = useState('');
    const [translate, setTranslate] = useState('');
    const [time, setTime] = useState('');

    const updateState = (e) => {
        const value = e.target.value;
        switch(e.target.name){
            case 'origin':
                setOrigin(value);
                updateListItem(keyId, value, translate, time);
                break;
            case 'translate':
                setTranslate(value);
                updateListItem(keyId, origin, value, time);
                break;
            case 'time':
                setTime(value);
                updateListItem(keyId, origin, translate, value);
                break;
            default:
                // console.log('Loz');
        }
    }

    return(
        <div className="user_upload_translate_list_item">
            <div className="user_upload_translate_list_item_item">
                <span style={{color: 'orangered'}}>{keyId + 1}</span>
            </div>

            <div className="user_upload_translate_list_item_item">
                <label htmlFor="">Введите оригинальную строчку</label>
                <input type="text" value={titleOrigin} onChange={updateState} name={'origin'}/>
            </div>

            <div className="user_upload_translate_list_item_item">
                <label htmlFor="">Введите переведенную строку</label>
                <input type="text" value={titleTranslate} onChange={updateState} name={'translate'}/>
            </div>

            <div className="user_upload_translate_list_item_item">
                <label htmlFor="">Введите время с которой начинается строка(в секундах!)</label>
                <input type="number" value={timeStart} onChange={updateState} name={'time'}/>
            </div>

            {/* <div className="user_upload_translate_list_item_item">
                <button name={'time'} onClick={(e) => updateState(e)} value={currentPreviewTime}>Время</button>
            </div> */}
        </div>
    )
}

export default UploadSection;