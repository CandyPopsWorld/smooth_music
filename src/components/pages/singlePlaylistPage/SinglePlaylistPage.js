import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useFirebaseContext } from '../../../context/FirebaseContext';
import { AUDIO, USERS } from '../../../utils/data/collectionsId';
import { getSuccessAlert } from '../../../utils/functions/alert';
import MusicList from '../../musicList/MusicList';
import Alert from '../../alert/Alert';
import './SinglePlaylistPage.scss';
import { useTabsContext } from '../../../context/TabsContext';
import Helmet from '../../helmet/Helmet';
import { SINGLE_PLAYLIST_PAGE_HELMET } from '../../../utils/data/seoHelmet';
function SinglePlaylistPage({title, description, thumbnail, musics, id, playlists}) {
    const {db, auth} = useFirebaseContext();
    const {setActiveSlide} = useTabsContext();
    const [titleInput, setTitleInput] = useState(title);
    const [descriptionInput, setDescriptionInput] = useState(description);
    const [currentPlaylists, setCurrentPlaylists] = useState(null);

    const [showAlert, setShowAlert] = useState(false);
    const [textAlert, setTextAlert] = useState(undefined);
    const [severityAlert, setSeverityAlert] = useState(null);

    const [playlistMusics, setPlaylistMusics] = useState([]);

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

    const getAudioById = async (id) => {
        const docRef = await doc(db, AUDIO, id);
        const docSnap = await getDoc(docRef);
        await setPlaylistMusics(prev => [...prev, docSnap.data()]);
    };

    const deletePlaylist = async () => {
        if(currentPlaylists === null){
            return;
        }
        const index = await currentPlaylists.findIndex(item => item.id === id);
        const newArray = await [...currentPlaylists.slice(0, index), ...currentPlaylists.slice(index + 1)];
        const docRef = await doc(db, USERS, auth.currentUser.uid);
        await updateDoc(docRef, {
            playlists: newArray
        });
        await setActiveSlide(1);
    };

    useEffect(() => {
        getPlaylists();
        musics.forEach(item => {
            getAudioById(item.idAudio);
        });
        // eslint-disable-next-line
    }, [])

    return (
        <div className="single_playlist_page">
            <Helmet 
            title={title ? SINGLE_PLAYLIST_PAGE_HELMET(title).title : ''}
            description={title ? SINGLE_PLAYLIST_PAGE_HELMET(title).title : ''}/>
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
                        <textarea name="" id="" cols="70" rows="5" placeholder='Добавить описание...' value={descriptionInput} onChange={(e) => setDescriptionInput(e.target.value)} onKeyDown={changeDescriptionInput} ref={descriptionInputRef}/>
                    </div>
                    <div className="single_playlist_page_about_text_controls">
                        <button className='delete_playlist' onClick={deletePlaylist}>Удалить плейлист</button>
                    </div>
                </div>
            </div>

            <div className="single_playlist_page_list">
                <h2>Треки</h2>
                <MusicList albumMusics={playlistMusics} title=''/>
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