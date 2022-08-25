import { useEffect, useState} from 'react';
import { doc, getDoc } from "firebase/firestore";
import Album from '../album/Album';
import MusicList from '../musicList/MusicList';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import 
{ 
    getImageStorage, 
    getDocDbAndReturn,
} from '../../utils/functions/db';
import { ALBUM_STORAGE } from '../../utils/data/storageId';
import { ALBUMS } from '../../utils/data/collectionsId';
import Loader from '../loader/Loader';
import { Helmet } from 'react-helmet';
import { COLLECTION_ALBUMS_PAGE_HELMET } from '../../utils/data/seoHelmet';

const Album_Block = () => {
    const {auth, db, storage} = useFirebaseContext();
    const {favoriteAlbums, setFavoriteAlbums, albumMusics, setAlbumMusics, albums, setAlbums} = useFavoritesContext();
    const [loading, setLoading] = useState(false);

    const getFavoriteAlbum = async () => {
        const docRef = await doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        await setFavoriteAlbums(docSnap.data().favoriteAlbum);
        await getAlbumsForFavorite(docSnap.data().favoriteAlbum);
        setLoading(false);
    };

    const getAlbumsForFavorite = async (arr) => {
        await arr.forEach(item => {
            getDocDbAndReturn(db, ALBUMS ,item.albumId).then(album => {
                getImageStorage(storage,ALBUM_STORAGE,item.albumId).then((image) => {
                    setAlbums(prev => [...prev, {...album, image}]);
                });
            });
        })
    };

    useEffect(() => {
        if(albums.length === 0){
            setLoading(true);
            getFavoriteAlbum();
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(albums.length > 0){
            setAlbums([]);
            setLoading(true);
            getFavoriteAlbum();
        }
        // eslint-disable-next-line
    }, [favoriteAlbums])

    let elements_albums = null;
    if(albums.length > 0){
        elements_albums = albums.map(item => {
            return <Album 
            key={item.id} 
            title={item.title} 
            image={item.image} 
            uid={item.id} 
            musics={item.musics}
            year={item.year}
            authorId={item.authorId}
            genreId={item.genreId} 
            setAlbumMusics={setAlbumMusics}/>
        });
    }

    return (
        <div className='favorite_section_tabs_block_albums'>
            <Helmet 
            title={auth && auth.currentUser ? COLLECTION_ALBUMS_PAGE_HELMET(auth.currentUser.displayName).title : ''}
            description={auth && auth.currentUser ? COLLECTION_ALBUMS_PAGE_HELMET(auth.currentUser.displayName).description : ''}/>
            <div className='albums_section'>
                <div className="albums_section_item_albums_block">
                    {
                        loading ? <Loader/>
                        :
                        favoriteAlbums.length !== 0 || favoriteAlbums === null ?
                        elements_albums
                        :
                        <h2 className='not_found_elements'>Вы ещё не добавили ни одного альбома в коллекцию!</h2>
                    }
                </div>
                <div className="albums_section_item_music_block">
                    {
                        albumMusics === null ?
                        <h2 style={{marginLeft: '10px', color: 'red', opacity: '0.4'}}>Вы еще не выбрали ни одного альбома</h2>
                        :
                        <MusicList albumMusics={albumMusics}/>
                    }
                    {/* <MusicList albumMusics={albumMusics}/> */}
                </div>
            </div>
        </div>
    )
};

export default Album_Block;