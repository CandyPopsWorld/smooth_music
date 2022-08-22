import { useEffect} from 'react';
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

const Album_Block = () => {
    const {auth, db, storage} = useFirebaseContext();
    const {favoriteAlbums, setFavoriteAlbums, albumMusics, setAlbumMusics, albums, setAlbums} = useFavoritesContext();

    const getFavoriteAlbum = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        setFavoriteAlbums(docSnap.data().favoriteAlbum);
        getAlbumsForFavorite(docSnap.data().favoriteAlbum);
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
            getFavoriteAlbum();
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(albums.length > 0){
            setAlbums([]);
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
            <div className='albums_section'>
                <div className="albums_section_item_albums_block">
                    {
                        favoriteAlbums.length !== 0 || favoriteAlbums === null ?
                        elements_albums
                        :
                        <h2 className='not_found_elements'>Вы ещё не добавили ни одного альбма в коллекцию!</h2>
                    }
                </div>
                <div className="albums_section_item_music_block">
                    <MusicList albumMusics={albumMusics}/>
                </div>
            </div>
        </div>
    )
};

export default Album_Block;