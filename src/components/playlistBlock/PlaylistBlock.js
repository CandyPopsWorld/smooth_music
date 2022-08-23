import { useEffect} from 'react';
import Playlist from '../playlist/Playlist';
import { doc, getDoc } from "firebase/firestore";
import MusicList from '../musicList/MusicList';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import likeSprite from '../../resources/image/like_playlist.png';
import './PlaylistBlock.scss';
import CreatePlaylist from '../createPlaylist/CreatePlaylist';
import { USERS } from '../../utils/data/collectionsId';
import { useState } from 'react';
import LikePlaylist from '../likePlaylist/LikePlaylist';
const Playlist_Block = () => {

    const {db, auth} = useFirebaseContext();
    const {playlistMusic, setPlaylistMusic, setFavoriteAudio} = useFavoritesContext();
    const [playlists, setPlaylists] = useState(null);

    const getFavoriteAudio = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        setFavoriteAudio(docSnap.data().favoriteAudio);
        docSnap.data().favoriteAudio.forEach(({audioId}) => {
            getMusic(audioId);
        });
    };

    const getMusic = async (id) => {
        const audioRef = doc(db, 'audio', id);
        const audioSnap = await getDoc(audioRef);
        setPlaylistMusic(prev => [...prev, audioSnap.data()]);
    };

    const getPlaylists = async () => {
        const docRef = await doc(db, USERS, auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        await setPlaylists(docSnap.data().playlists)
    };

    useEffect(() => {
        if(playlistMusic.length === 0){
            getFavoriteAudio();
        }
        getPlaylists();
        // eslint-disable-next-line
    }, [])

    let elements_playlists = null;
    if(playlists !== null){
        elements_playlists = playlists.map(item => {
            return <Playlist image={item.thumbnail} title={item.title} key={item.id} id={item.id} data={item}/>
        });
    }

    return (
        <div className='favorite_section_tabs_block_playlists'>
            <div className='albums_section'>
                <div className="albums_section_item_albums_block">
                    <LikePlaylist image={likeSprite} title={'Мне нравится'}/>
                    <CreatePlaylist playlists={playlists !== null ? playlists : null}/>
                    {elements_playlists}
                </div>
                <div className="albums_section_item_music_block">
                    <MusicList albumMusics={playlistMusic} title={'Мне нравится'}/>
                </div>
            </div>
        </div>
    )
};

export default Playlist_Block;

