import { useState } from 'react';
import { useUploadContext } from '../../context/UploadContext';
import ReactAudioPlayer from 'react-audio-player';
import {ref, uploadBytes} from "firebase/storage";
import {doc, getDoc, arrayUnion, setDoc} from 'firebase/firestore';
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
        setAlbum
    } = useUploadContext();
    const {storage, db} = useFirebaseContext();
    // const [filePredProsmotr, setFilePredProsmotr] = useState(null);

    const getFileInput = (event) => {
        const blob = window.URL || window.webkitURL;
        let file = event.target.files[0];
        const fileURL = blob.createObjectURL(file);
        // console.log(file);
        setFile(<ReactAudioPlayer src={fileURL} controls/>);
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
            keyId={i}/>
        )
    });


    const uploadFile = (file) => {

        const storageRef = ref(storage, file.name);
        uploadBytes(storageRef, file)
        .then(() => {
          console.log('File Upload!');
        })
        .catch(() => {
    
        })
    };

    const uploadCollectionDb = async (file) => {
        await setDoc(doc(db, 'audio', file.name), {
            name: nameMusic,
            author: authorMusic,
            album: album,
            textOfMusic: textOfMusic,
            id: file.name,
        })
        clearUploadContext();
        setLoading(false);
    };

    const uploadContentAudioOnFirebase = () => {
        if(nameMusic !== '' && authorMusic !== ''){
            setLoading(true);
            uploadFile(fileUpload);
            uploadCollectionDb(fileUpload);
        }
    };
    
    if(file !== null){
        console.log(file.name);
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
                            <label htmlFor="">Автор(группа)</label>
                            <input 
                            type="text" 
                            name={'author'}
                            id='author'
                            defaultValue={authorMusic}
                            onChange={(e) => setAuthorMusic(e.target.value)}/>
                        </div>
                    </div>

                    <div className="user_upload_text_header">
                        <h3>Введите перевод текста</h3>
                    </div>

                    <div className="user_upload_translate_list">
                        {elements_inputs_list}
                    </div>

                    <div className="user_upload_plus" onClick={addListItem}>
                        +
                    </div>

                    <button onClick={uploadContentAudioOnFirebase}>Загрузить музыку в облачное хранилище</button>
                </>

                :
                <Loader/>
            }


        </div>
    );
};


const InputItem = ({titleOrigin, titleTranslate, timeStart, updateListItem,keyId}) => {
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
                console.log('Loz');
        }
    }

    return(
        <div className="user_upload_translate_list_item">
            <div className="user_upload_translate_list_item_item">
                <label htmlFor="">Введите оригинальную строчку</label>
                <input type="text" defaultValue={titleOrigin} onChange={updateState} name={'origin'}/>
            </div>

            <div className="user_upload_translate_list_item_item">
                <label htmlFor="">Введите переведенную строку</label>
                <input type="text" defaultValue={titleTranslate} onChange={updateState} name={'translate'}/>
            </div>

            <div className="user_upload_translate_list_item_item">
                <label htmlFor="">Введите время с которой начинается строка(в секундах!)</label>
                <input type="number" defaultValue={timeStart} onChange={updateState} name={'time'}/>
            </div>
        </div>
    )
}

export default UploadSection;