import { useEffect} from 'react';
import Playlist from '../playlist/Playlist';
import { doc, getDoc } from "firebase/firestore";
import MusicList from '../musicList/MusicList';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import likeSprite from '../../resources/image/like_playlist.png';

const Playlist_Block = () => {

    const {db, auth} = useFirebaseContext();
    const {playlistMusic, setPlaylistMusic, setFavoriteAudio} = useFavoritesContext();

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

    useEffect(() => {
        if(playlistMusic.length === 0){
            getFavoriteAudio();
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className='favorite_section_tabs_block_playlists'>
            <div className='albums_section'>
                <div className="albums_section_item_albums_block">
                    <Playlist image={likeSprite} title={'Мне нравится'}/>
                </div>
                <div className="albums_section_item_music_block">
                    <MusicList albumMusics={playlistMusic} title={'Мне нравится'}/>
                </div>
            </div>
        </div>
    )
};

export default Playlist_Block;

