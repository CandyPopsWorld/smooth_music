import { useEffect, useState } from 'react';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { useAlbumContext } from '../../context/AlbumContext';
import { useTabsContext } from '../../context/TabsContext';
import { useSearchContext } from '../../context/SearchContext';
import { AudioItem } from '../collectionsSection/CollectionsSection';
import Skeleton from '../skeleton/Skeleton';
import {addUserFavoriteAlbum, removeUserFavoriteAlbum, getFavoriteAlbum, getDocDbAndSetState} from '../../utils/functions/db';
import { AUDIO } from '../../utils/data/collectionsId';
import { albumClass } from '../../utils/data/classNames';
import './AlbumSection.scss';
export const Album = ({image, uid, title, musics, setAlbumMusics, year, authorId, genreId}) => {
    const {setSearchInfoAboutItem} = useSearchContext();
    const {setActiveSlide, setSearchTab} = useTabsContext();
    const {db, auth} = useFirebaseContext();
    const {active, setActive} = useAlbumContext();
    const [favoriteClass, setFavoriteClass] = useState(false);
    const [loadImage, setLoadImage] = useState(false);

    const getMusicFromAlbum = async () => {
        await setAlbumMusics([]);
        await setActive(uid);
        await musics.forEach(item => {
            getDocDbAndSetState(db, AUDIO, item.idAudio, setAlbumMusics);
        })
    };

    const onFavoriteAlbum = async () => {
        await getFavoriteAlbum(db, auth.currentUser.uid).then((res) => {
            let bool = false;
            res.forEach(({albumId}) => {
                if(uid === albumId){
                    bool = true;
                }
            })
            if(bool === true){
                setFavoriteClass(false);
                removeUserFavoriteAlbum(db, auth.currentUser.uid, uid);
            } else{
                setFavoriteClass(true);
                addUserFavoriteAlbum(db, auth.currentUser.uid, uid);
            }
        });
    };

    useEffect(() => {
        getFavoriteAlbum(db, auth.currentUser.uid).then((res) => {
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
            <div className={albumClass(active, uid)}>
                <img src={image} alt="" onClick={async () => {
                    await setSearchInfoAboutItem({image, uid, title, musics, year, authorId, genreId});
                    await setSearchTab(1);
                    await setActiveSlide(6);
                }} onLoad={() => setLoadImage(true)}/>
                {
                    loadImage === false ? <Skeleton/> : null
                }
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
                duration={duration}
                albumMusics={albumMusics}/>
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
                    null
                }
            </div>
        </div>
    )
}