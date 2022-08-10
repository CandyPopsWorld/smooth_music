import { useEffect, useState } from 'react';
import { useFirebaseContext } from '../../context/FirebaseContext';
import {useDatabaseContext} from '../../context/DatabaseContext';
import { doc, getDoc } from "firebase/firestore";
import {ref,getDownloadURL } from "firebase/storage";
import { AudioItem } from '../collectionsSection/CollectionsSection';
import './AlbumSection.scss';
import { useAlbumContext } from '../../context/AlbumContext';
import Loader from '../loader/Loader';
import {arrayUnion, arrayRemove, updateDoc} from "firebase/firestore";
import { useFavoritesContext } from '../../context/FavoritesContext';
function AlbumsSection(props) {
    const {albumsOffset, setAlbumsOffset} = useDatabaseContext();
    const {db, storage} = useFirebaseContext();
    const {albums, setAlbums, image, setImage, albumMusics, setAlbumMusics, loadingAlbums, setLoadingAlbums} = useAlbumContext();
    // const [albums, setAlbums] = useState([]);
    // const [image, setImage] = useState(null);
    // const [albumMusics, setAlbumMusics] = useState([]);
    const getAlbumsWithOffset = async (object) => {
        const maxId = object.maxId;
        const minId = object.minId;
        let globalOffsetNum = albumsOffset;
        let globalOffsetStr = albumsOffset;
        for(let i = 1; i < 10; i++){
            globalOffsetNum = globalOffsetNum + 1;
            globalOffsetStr = String(globalOffsetNum);
            const offset = await albumsOffset + 1;
            console.log(offset);
            const offsetStr = String(offset);
            await setAlbumsOffset(prev => prev + 1);
            const docRef = await doc(db, 'albums', globalOffsetStr);
            const docSnap = await getDoc(docRef);
            const image = await getImagaAlbumStorage(globalOffsetStr);
            // console.log('image:', image);
            if(docSnap.data() !== undefined){
                await setAlbums(prev => [...prev, {...docSnap.data(), image}]);   
            }
            setLoadingAlbums(false);
        }
    };

    const getDataIdByDatabase = async () => {
        setLoadingAlbums(true);
        const docRef = doc(db, 'albumsIds', 'albumsIds');
        const docSnap = await getDoc(docRef);
        // await setAlbumIds(docSnap.data());
        await getAlbumsWithOffset(docSnap.data());
    };

    const getImagaAlbumStorage = async (globalOffset) => {
        const pathReference = ref(storage, `album/${globalOffset}`);
        let urlExport = '';
        await getDownloadURL(pathReference)
        .then((url) => {
            setImage(url);
            urlExport = url;
        })
        .catch((error) => {
            // console.log(error);
        })
        return urlExport;
    };

    const elements_albums = albums.map(item => {
        // console.log(item);
        return (
            <Album key={item.id} title={item.title} image={item.image} uid={item.id} musics={item.musics} setAlbumMusics={setAlbumMusics}/>
        )
    });

    useEffect(() => {
        if(albumMusics.length === 0){
            getDataIdByDatabase();
        }
    }, [])
    return (
        <div className='albums_section'>
            <div className="albums_section_item_albums_block">
                {
                    loadingAlbums === false ?
                    elements_albums
                    :
                    <Loader style={{margin: 0}}/>
                }
                {/* {elements_albums} */}
            </div>
            <div className="albums_section_item_music_block">
                <MusicsList albumMusics={albumMusics}/>
            </div>
        </div>
    );
};

export const Album = ({image, uid, title, musics, setAlbumMusics}) => {
    const {setFavoriteAlbums} = useFavoritesContext();
    const {db, auth} = useFirebaseContext();
    const {active, setActive} = useAlbumContext();
    const [favoriteClass, setFavoriteClass] = useState(false);
    // const [active, setActive] = useState(false);

    const getMusicFromAlbum = async () => {
        setAlbumMusics([]);
        setActive(uid);
        await musics.forEach(item => {
            getDataIdByDatabase(item.idAudio);
        })
        // console.log('uid:', uid);
        // console.log('musics:', musics);
    };

    const getDataIdByDatabase = async (id) => {
        const docRef = doc(db, 'audio', id);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
        setAlbumMusics(prev => [...prev, docSnap.data()]);
        // await setAlbumIds(docSnap.data());
        // await (docSnap.data());
    };

    let clazz = 'albums_section_item_albums_block_item_bg';
    if(active === uid){
        clazz+= ' active';
    }

    const onFavoriteAlbum = () => {
        getFavoriteAlbum().then((res) => {
            let bool = false;
            res.forEach(({albumId}) => {
                if(uid === albumId){
                    bool = true;
                }
            })
            if(bool === true){
                setFavoriteClass(false);
                removeUserFavoriteAlbum();
            } else{
                setFavoriteClass(true);
                addUserFavoriteAlbum();
            }
        });
        // addUserFavoriteAudio();
    };

    const addUserFavoriteAlbum = async () => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAlbum: arrayUnion({albumId: uid})
        });
    };

    const removeUserFavoriteAlbum = async () => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAlbum: arrayRemove({albumId: uid})
        });
    };


    const getFavoriteAlbum = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        // await setFavoriteObj(docSnap.data().favoriteAudio);
        return docSnap.data().favoriteAlbum;
        // console.log(docSnap.data().favoriteAudio);
    };

    useEffect(() => {
        getFavoriteAlbum().then((res) => {
            res.forEach(({albumId}) => {
                if(albumId === uid){
                    setFavoriteClass(true);
                }
            })
        })
    }, [])

    return (
        <div className="albums_section_item_albums_block_item">
            {/* <div className="albums_section_item_albums_block_item_bg"> */}
            <div className={clazz}>
                <img src={image} alt="" />
                <div className="albums_section_item_albums_block_item_bg_controls">
                    <i onClick={getMusicFromAlbum} className="fa-solid fa-circle-play play_album_control"></i>
                    <i className="fa-solid fa-heart favorite_album_control" onClick={onFavoriteAlbum} style={favoriteClass ? {color: 'orangered'} : null}></i>
                </div>
            </div>
            <div className="albums_section_item_albums_block_item_title">
                {title}
            </div>
        </div>
    )
};

export const MusicsList = ({albumMusics, title = null}) => {
    let albumName = '';
    let elements_audio_items = null;
    if(albumMusics.length > 0){
        elements_audio_items = albumMusics.map(({album, author, name, id, textOfMusic, duration}, i) => {
            albumName = album;
            return (
                <AudioItem 
                idkey={id}
                uniqueid={id} 
                key={id} 
                album={album} 
                author={author} 
                name={name} 
                i={i}
                textOfMusic={textOfMusic}
                duration={duration}/>
            )
        });
    }
    return (
        <div className='music_list_albums'>
            {
                albumMusics.length > 0 && albumName.length > 0 ?
                <h2>{title === null ? `Альбом ${albumName}` : title}</h2>
                :
                null
            }
            <div className="music_list_albums_wrapper">
                {
                    albumMusics.length > 0 && albumName.length > 0 ?
                    elements_audio_items
                    :
                    <div style={{margin: 'auto auto'}}>
                        <h2>Выберите Альбом</h2>
                        <h3>Слушайте и вдохновляйтесь</h3>
                    </div>
                }
                {/* {elements_audio_items} */}
            </div>
        </div>
    )
}

export default AlbumsSection;