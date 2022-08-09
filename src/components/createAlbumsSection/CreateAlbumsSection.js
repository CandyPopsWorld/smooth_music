import { useEffect, useState } from 'react';
import {doc, getDoc, arrayUnion, setDoc, updateDoc} from 'firebase/firestore';
import {ref, uploadBytes} from "firebase/storage";
import './CreateAlbumsSection.scss';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { useDatabaseContext } from '../../context/DatabaseContext';
import Loader from '../loader/Loader';
function CreateAlbumsSection(props) {
    const {db,storage} = useFirebaseContext();
    const {albumIds, setAlbumIds, loading, setLoading} = useDatabaseContext();
    const [albumImage, setAlbumImage] = useState(null);
    const [title, setTitle] = useState('');

    const createAlbum = () => {
        if(albumImage !== null && title !== ''){
            setLoading(true);
            const maxId = albumId();
            uploadAlbumDatabase(+maxId, title);
            uploadFile(albumImage, +maxId);
            clearForm();
        }
    };

    const uploadAlbumDatabase = async (maxId, title) => {
        await setDoc(doc(db, 'albums', (maxId + 1).toString()), {
            id: (+maxId + 1).toString(),
            title,
            musics: []
        })
    };

    const uploadFile = (file, maxId) => {
        const storageRef = ref(storage, `album/${maxId + 1}`);
        updateMaxIdAudio(maxId);
        uploadBytes(storageRef, file)
        .then(() => {
          console.log('File Upload!');
          setLoading(false);
        })
        .catch(() => {
            setLoading(false);
        })
    };

    const updateMaxIdAudio = async (maxId) => {
        const idsRef = await doc(db, 'albumsIds', 'albumsIds');
        await updateDoc(idsRef, {
            maxId: (+maxId + 1).toString()
        });
    };


    const getDataIdByDatabase = async () => {
        const docRef = doc(db, 'albumsIds', 'albumsIds');
        const docSnap = await getDoc(docRef);
        await setAlbumIds(docSnap.data());
    };

    const albumId = () => {
        return albumIds.maxId;
    };

    const validateForm = () => {
        if(albumImage !== null && title !== ''){
            setLoading(true);
            return true;
        }
        return false;
    };

    const clearForm = () => {
        setAlbumImage(null);
        setTitle('');
        setLoading(false);
    };

    const getFileInput = (event) => {
        const blob = window.URL || window.webkitURL;
        let file = event.target.files[0];
        const fileURL = blob.createObjectURL(file);
        setAlbumImage(file);
    };


    useEffect(() => {
        getDataIdByDatabase();
    }, [])

    console.log(loading);

    return (
        <div className="create_album">
            {
                loading === false ?
                <>
                    <div className="create_album_header">
                        Загрузить Альбом
                    </div>

                    <div className="create_album_file">
                        <input 
                        type="file" 
                        id='album'
                        name='album'
                        onChange={(e) => getFileInput(e)}/>
                    </div>

                    <div className="create_album_name">
                        <input 
                        type="text" 
                        id='title'
                        name='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    
                    <div className="create_album_upload">
                        <button onClick={createAlbum}>Загрузить Альбом</button>
                    </div>
                </>
                :
                <Loader/>
            }
        </div>
    );
}

export default CreateAlbumsSection;