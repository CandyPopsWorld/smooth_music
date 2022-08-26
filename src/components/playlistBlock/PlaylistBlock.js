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
import Helmet from '../helmet/Helmet';
import { COLLECTION_PLAYLISTS_PAGE_HELMET } from '../../utils/data/seoHelmet';
import Loader from '../loader/Loader';
import { useSettingContext } from '../../context/SettingContext';
import localization from '../../utils/data/localization/index';
import { keys } from '../../utils/data/localization/keys';
const Playlist_Block = () => {

    const {db, auth} = useFirebaseContext();
    const {playlistMusic, setPlaylistMusic, setFavoriteAudio} = useFavoritesContext();
    const [playlists, setPlaylists] = useState(null);
    const [loadingFavoriteList, setLoadingFavoriteList] = useState(false);
    const {currentLocalization} = useSettingContext();

    const getFavoriteAudio = async () => {
        const docRef = await doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        setFavoriteAudio(docSnap.data().favoriteAudio);
        if(docSnap.data().favoriteAudio.length !== 0){
            await docSnap.data().favoriteAudio.forEach(({audioId}, i) => {
                getMusic(audioId);
            });
        } else {
            await setPlaylistMusic('');
        }

    };

    const getMusic = async (id) => {
        const audioRef = await doc(db, 'audio', id);
        const audioSnap = await getDoc(audioRef);
        setPlaylistMusic(prev => [...prev, audioSnap.data()]);
    };

    const getPlaylists = async () => {
        await setLoadingFavoriteList(true);
        const docRef = await doc(db, USERS, auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        await setPlaylists(docSnap.data().playlists);
        await setLoadingFavoriteList(false);
    };

    useEffect(() => {
        if(playlistMusic !== null && playlistMusic.length === 0){
            getFavoriteAudio();
        }
        getPlaylists();
        // eslint-disable-next-line
    }, [])

    let elements_playlists = null;
    if(playlists !== null && playlists.length > 0){
        elements_playlists = playlists.map(item => {
            return <Playlist image={item.thumbnail} title={item.title} key={item.id} id={item.id} data={item}/>
        });
    }

    return (
        <div className='favorite_section_tabs_block_playlists'>
            <Helmet
            title={auth && auth.currentUser ? COLLECTION_PLAYLISTS_PAGE_HELMET(auth.currentUser.displayName).title : ''}
            description={auth && auth.currentUser ? COLLECTION_PLAYLISTS_PAGE_HELMET(auth.currentUser.displayName).description : ''}/>
            <div className='albums_section'>
                <div className="albums_section_item_albums_block">
                    <LikePlaylist image={likeSprite} title={currentLocalization !== null ? localization[currentLocalization][keys.collectionLikePlaylistText] : ''}/>
                    <CreatePlaylist playlists={playlists !== null ? playlists : null}/>
                    {elements_playlists}
                </div>
                <div className="albums_section_item_music_block">
                    {
                        loadingFavoriteList ? 
                        <Loader/>
                        :
                        <>
                        <h2 style={{marginLeft: '10px'}}>{currentLocalization !== null ? localization[currentLocalization][keys.collectionLikePlaylistText] : ''}</h2>
                        <p style={{color: 'red', marginLeft: '10px'}}>{playlistMusic !== null &&  playlistMusic === '' ? currentLocalization !== null ? localization[currentLocalization][keys.collectionLikePlaylistErrorText] : '' : null}</p>
                        <MusicList albumMusics={playlistMusic !== null ? playlistMusic : []} title={''}/>   
                        </> 
                    }
                </div>
            </div>
        </div>
    )
};

export default Playlist_Block;

