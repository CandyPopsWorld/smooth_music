import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAudioContext } from '../../context/AudioContext';
import { useDatabaseContext } from '../../context/DatabaseContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { USERS } from '../../utils/data/collectionsId';
import MainLoader from '../mainLoader/MainLoader';
import './AddPlaylistModal.scss';
function AddPlaylistModal(props) {
    const {db, auth} = useFirebaseContext();
    // eslint-disable-next-line
    const {showModalPlaylist, setShowModalPlaylist} = useAudioContext();
    const [playlists, setPlaylists] = useState(null);

    const getPlaylists = async () => {
        const docRef = await doc(db, USERS, auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        await setPlaylists(docSnap.data().playlists)
    };

    useEffect(() => {
        getPlaylists();
        // eslint-disable-next-line
    }, [])

    let elements_playlists = null;
    if(playlists !== null && playlists.length > 0){
        elements_playlists = playlists.map(item => {
            return <ButtonAddPlaylist title={item.title} key={item.id} idPlaylist={item.id} playlists={playlists}/>
        });
    }

    return (
        <div className='add_playlist_modal' onClick={() => setShowModalPlaylist(false)}>
            <div className={`add_playlist_modal_wrapper`}>
                <div className="add_playlist_modal_wrapper_header">
                    <h3>Добавить в плейлист</h3>
                </div>
                {playlists === null ? <MainLoader size={'100px'}/> : null}
                {elements_playlists ? elements_playlists : null}
                {playlists !== null && playlists.length === 0 ? <span style={{color: 'red'}}>Плейлисты не найдены!</span> : null}
            </div>
        </div>
    );
};


const ButtonAddPlaylist = ({title, idPlaylist, playlists}) => {
    const {db, auth} = useFirebaseContext();
    const {currentIdAudio} = useDatabaseContext();

    const [index, setIndex] = useState(null);
    const [oldObj, setOldObj] = useState(null);
    const [musics, setMusics] = useState(null);

    const [match, setMatch] = useState(false);

    const addAudioPlaylist = async () => {
        if(index === null || oldObj === null || musics === null){
            return;
        }

        if(match === true){
            removeAudioPlaylist();
            return;
        }

        const newobj = await {...oldObj, musics: [...musics, {idAudio: currentIdAudio}]};
        const newArray = await [...playlists.slice(0, index), newobj, ...playlists.slice(index + 1)];

        const docRef = await doc(db, USERS, auth.currentUser.uid);
        await updateDoc(docRef, {
            playlists: newArray
        });
    };

    const removeAudioPlaylist = async () => {
        let index = null;
        await musics.forEach((item, i) => {
            if(item.idAudio === currentIdAudio){
                index = i;
            }
        });
        const newMusics = await [...musics.slice(0, index), ...musics.slice(index + 1)];
        const updateObj = await {...playlists[index], musics: newMusics};
        const docRef = await doc(db, USERS, auth.currentUser.uid);
        playlists[index] = await updateObj;
        await updateDoc(docRef, {
            playlists: playlists 
        });
    };

    const getInitialData = async () => {
        const index = await playlists.findIndex(item => item.id === idPlaylist);
        const oldObj = await playlists[index];
        const musics = await playlists[index].musics;
        await setIndex(index);
        await setOldObj(oldObj);
        await setMusics(musics);
    };

    useEffect(() => {
        getInitialData();
        // eslint-disable-next-line
    }, []) 

    useEffect(() => {
        if(musics !== null){
            musics.forEach(item => {
                if(item.idAudio === currentIdAudio){
                    console.log('Совпадение!');
                    setMatch(true);
                } 
            })
        }
        // eslint-disable-next-line
    }, [musics])


    return (
        <button className='add_audio_playlist' onClick={addAudioPlaylist} style={match ? {color: 'orangered'} : {}}>{title}</button>
    )
};

export default AddPlaylistModal;