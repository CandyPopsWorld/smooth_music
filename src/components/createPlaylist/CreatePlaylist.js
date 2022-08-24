import { doc, getDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { useFirebaseContext } from "../../context/FirebaseContext";
import { useSearchContext } from "../../context/SearchContext";
import { useTabsContext } from "../../context/TabsContext";
import { USERS } from "../../utils/data/collectionsId";
import { getImageStorage } from '../../utils/functions/db';
import { useEffect, useState } from "react";
import {PLAYLIST_STORAGE} from '../../utils/data/storageId';

function CreatePlaylist({playlists}) {
    const {db, auth, storage} = useFirebaseContext();

    const {setActiveSlide, setSearchTab} = useTabsContext();
    const {setSearchInfoAboutItem} = useSearchContext();

    const [playlistId, setPlaylistId] = useState(null);
    const [defaultThumbPlaylist, setDefaultThumbPlaylist] = useState(null);

    const createUserPlaylist = async () => {
        if(playlistId === null || defaultThumbPlaylist === null) {
            return;
        }
        const docRef = await doc(db, USERS, auth.currentUser.uid);
        const object = {title: 'НОВЫЙ ПЛЕЙЛИСТ', description: '' , thumbnail: defaultThumbPlaylist, musics: [], id: String(+playlistId + 1)};
        await updateDoc(docRef, {
            playlists: arrayUnion(object)
        })
        await updateMaxIdPlaylist(playlistId);
        await getSinglePlaylistPage(object);
    };

    const getSinglePlaylistPage = async (object) => {
        await setSearchInfoAboutItem({...object, playlists});
        await setSearchTab(3);
        await setActiveSlide(6);
    };

    const updateMaxIdPlaylist = async (maxId) => {
        const idsRef = await doc(db, USERS, auth.currentUser.uid);
        await updateDoc(idsRef, {
            maxIdPlaylist: (+maxId + 1).toString()
        });
    };

    const getIds = async () => {
        const docRef = await doc(db, USERS, auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        await setPlaylistId(docSnap.data().maxIdPlaylist);
    };

    const getDefaultThumb = async () => {
        await getImageStorage(storage, PLAYLIST_STORAGE, 'defaultPlaylist.png').then(res => {
            setDefaultThumbPlaylist(res);
        });
    };

    useEffect(() => {
        getIds();
        getDefaultThumb();
        // eslint-disable-next-line
    }, [])

    return (
        <div className="create_playlist" onClick={createUserPlaylist}>
            <span>+</span>
        </div>
    );
}

export default CreatePlaylist;