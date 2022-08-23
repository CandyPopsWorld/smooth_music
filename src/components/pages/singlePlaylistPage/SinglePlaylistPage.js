import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useFirebaseContext } from '../../../context/FirebaseContext';
import { USERS } from '../../../utils/data/collectionsId';
import { getSuccessAlert } from '../../../utils/functions/alert';
import MusicList from '../../musicList/MusicList';
import Alert from '../../alert/Alert';
import './SinglePlaylistPage.scss';
function SinglePlaylistPage({title, description, thumbnail, musics, id, playlists}) {
    const {db, auth} = useFirebaseContext();
    const [titleInput, setTitleInput] = useState(title);
    const [descriptionInput, setDescriptionInput] = useState('Добавить описание...');
    const [currentPlaylists, setCurrentPlaylists] = useState(null);

    const [showAlert, setShowAlert] = useState(false);
    const [textAlert, setTextAlert] = useState(undefined);
    const [severityAlert, setSeverityAlert] = useState(null);

    let titleInputRef = useRef(null);
    let descriptionInputRef = useRef(null);


    const changeTitleInput = async (e) => {
        if(e.key !== 'Enter' || currentPlaylists === null || titleInput.length === 0){
            return;
        }
        titleInputRef.current.blur();
        const index = await currentPlaylists.findIndex(item => item.id === id);
        const oldObj = await currentPlaylists[index];
        const newObj = await {...oldObj, title: titleInput};
        const newArray = await [...currentPlaylists.slice(0, index), newObj, ...currentPlaylists.slice(index + 1)];
        const docRef = await doc(db, USERS, auth.currentUser.uid);
        await updateDoc(docRef, {
            playlists: newArray
        });
        await getSuccessAlert('Название плейлиста обновлено!', setShowAlert, setSeverityAlert, setTextAlert);
    };

    const changeDescriptionInput = async (e) => {
        if(e.key !== 'Enter' || currentPlaylists === null || descriptionInput.length === 0){
            return;
        }
        descriptionInputRef.current.blur();
        const index = await currentPlaylists.findIndex(item => item.id === id);
        const oldObj = await currentPlaylists[index];
        const newObj = await {...oldObj, description: descriptionInput};
        const newArray = await [...currentPlaylists.slice(0, index), newObj, ...currentPlaylists.slice(index + 1)];
        const docRef = await doc(db, USERS, auth.currentUser.uid);
        await updateDoc(docRef, {
            playlists: newArray
        });
        await getSuccessAlert('Описание плейлиста обновлено!', setShowAlert, setSeverityAlert, setTextAlert);
    };

    const getPlaylists = async () => {
        const docRef = await doc(db, USERS, auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        await setCurrentPlaylists(docSnap.data().playlists)
    };

    useEffect(() => {
        getPlaylists();
        // eslint-disable-next-line
    }, [])

    console.log(titleInputRef);
    console.log(descriptionInputRef);
    return (
        <div className="single_playlist_page">
            <div className="single_playlist_page_about">
                <div className="single_playlist_page_about_thumb">
                    <img src={thumbnail} alt="thumbnail playlist" />
                    <div className="single_playlist_page_about_thumb_add">
                        <button>Добавить обложку</button>
                    </div>
                </div>
                <div className="single_playlist_page_about_text">
                    <h2 style={{color: 'gray', opacity: 0.7}}>Плейлист</h2>
                    <div className="single_playlist_page_about_text_title">
                        <input type="text" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} onKeyDown={changeTitleInput} ref={titleInputRef}/>
                    </div>
                    <div className="single_playlist_page_about_text_description">
                        <textarea name="" id="" cols="70" rows="5" value={descriptionInput} onChange={(e) => setDescriptionInput(e.target.value)} onKeyDown={changeDescriptionInput} ref={descriptionInputRef}/>
                    </div>
                </div>
            </div>

            <div className="single_playlist_page_list">
                <h2>Треки</h2>
                <MusicList albumMusics={musics}/>
            </div>
            
            {
                musics.length === 0 ?
                <div className="single_playlist_page_list_not_found">
                    <h3>Плейлист пока пуст</h3>
                    <p>Добавьте в него пару треков, а мы предложим похожие</p>
                </div>
                :
                null
            }
                <div className='single_playlist_page_alert'>
                    {
                        showAlert ? <Alert severity={severityAlert} text={textAlert} setShowAlert={setShowAlert} showAlert={showAlert}/> : null
                    }
                </div>
        </div>
    );
}

export default SinglePlaylistPage;