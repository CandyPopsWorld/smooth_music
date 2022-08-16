import { useEffect, useState } from 'react';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { doc, getDoc } from "firebase/firestore";
import { AudioItem } from '../collectionsSection/CollectionsSection';
import './AlbumSection.scss';
import { useAlbumContext } from '../../context/AlbumContext';
import {arrayUnion, arrayRemove, updateDoc} from "firebase/firestore";
import { useTabsContext } from '../../context/TabsContext';
import { useSearchContext } from '../../context/SearchContext';

export const Album = ({image, uid, title, musics, setAlbumMusics, year, authorId, genreId}) => {
    const {setSearchInfoAboutItem} = useSearchContext();
    const {setActiveSlide, setSearchTab} = useTabsContext();
    const {db, auth} = useFirebaseContext();
    const {active, setActive} = useAlbumContext();
    const [favoriteClass, setFavoriteClass] = useState(false);

    const getMusicFromAlbum = async () => {
        setAlbumMusics([]);
        setActive(uid);
        await musics.forEach(item => {
            getDataIdByDatabase(item.idAudio);
        })
    };

    const getDataIdByDatabase = async (id) => {
        const docRef = doc(db, 'audio', id);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
        setAlbumMusics(prev => [...prev, docSnap.data()]);
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
        return docSnap.data().favoriteAlbum;
    };

    useEffect(() => {
        getFavoriteAlbum().then((res) => {
            res.forEach(({albumId}) => {
                if(albumId === uid){
                    setFavoriteClass(true);
                }
            })
        })
        // eslint-disable-next-line
    }, [])

    return (
        <div className="albums_section_item_albums_block_item">
            <div className={clazz}>
                <img src={image} alt="" onClick={async () => {
                    await setSearchInfoAboutItem({image, uid, title, musics, year, authorId, genreId});
                    await setSearchTab(1);
                    await setActiveSlide(6);
                }}/>
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

    console.log('albMusc:', albumMusics);
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
            </div>
        </div>
    )
}