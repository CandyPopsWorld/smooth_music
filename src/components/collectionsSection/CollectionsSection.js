import { useEffect, useState } from 'react';
import 
{
    addUserFavoriteAudio, 
    removeUserFavoriteAudio, 
    getFavoriteMusic, 
    getDocDbAndSetStateWithoutPrev, 
    getAudioStorage,
    getAuthorId,
    getAlbumId,
    getImageStorage
} from '../../utils/functions/db';
import { useFirebaseContext } from '../../context/FirebaseContext';
import {useDatabaseContext} from '../../context/DatabaseContext';
import { useSearchContext } from '../../context/SearchContext';
import { useTabsContext } from '../../context/TabsContext';
import { useAudioContext } from '../../context/AudioContext';
import {AUTHORS, ALBUMS, AUDIO} from '../../utils/data/collectionsId';
import {ALBUM_STORAGE, AUTHOR_STORAGE} from '../../utils/data/storageId';
import './CollectionSection.scss';
export const AudioItem = ({uniqueid, i, name, album, author,textOfMusic, duration, albumMusics}) => {
    const {storage, auth, db} = useFirebaseContext();
    const {setCurrentAudio, setCurrentTextOfMusic,setCurrentIdAudio, currentIdAudio, setCurrentPlayMusicList, setCurrentUidMusicList} = useDatabaseContext();
    const {setSearchInfoAboutItem, setShowModal} = useSearchContext();
    const {setActiveSlide, setSearchTab} = useTabsContext();
    const {setPlayed, setCurrentTime} = useAudioContext();
    const [favoriteClass, setFavoriteClass] = useState(false);
    const [authorData, setAuthorData] = useState(null);
    const [albumData, setAlbumData] = useState(null);
    const [authorId, setAuthorId] = useState(null);
    const [albumId, setAlbumId] = useState(null);

    const getMusicByClick = async (id) => {
        await setCurrentPlayMusicList(albumMusics);
        await setCurrentUidMusicList(uniqueid);
        await setPlayed(true);
        await setCurrentTime(0);
        await setCurrentTextOfMusic(textOfMusic);
        await setCurrentIdAudio(id);
        await getAudioStorage(storage, AUDIO, id, setCurrentAudio);
    };

    const onFavoriteMusic = () => {
        getFavoriteMusic(db, auth.currentUser.uid).then((res) => {
            let bool = false;
            res.forEach(({audioId}) => {
                if(uniqueid === audioId){
                    bool = true;
                }
            })
            if(bool === true){
                setFavoriteClass(false);
                removeUserFavoriteAudio(db, auth.currentUser.uid, uniqueid);
            } else{
                setFavoriteClass(true);
                addUserFavoriteAudio(db, auth.currentUser.uid, uniqueid);
            }
        });
    };

    const getSingleAuthorPage = async () => {
        if(authorId === null || authorData === null){
            return;
        }
        setActiveSlide(1);
        setShowModal(false);
        await getImageStorage(storage, AUTHOR_STORAGE, authorId).then((image) => {
            console.log(image);
            if(authorData !== null){
                setAuthorData(prev => [{image, uid: prev.id, title: prev.title, description: prev.description, albums: prev.albums, musics: prev.musics}]);
                setSearchInfoAboutItem({image,...authorData});
            }
        });
        await setSearchTab(2);
        await setActiveSlide(6);
    };

    const getSingleAlbumPage = async () => {
        if(albumId === null || albumData === null){
            return;
        }
        setActiveSlide(1);
        setShowModal(false);
        await getImageStorage(storage, ALBUM_STORAGE, albumId).then((image) => {
            if(albumData !== null){
                setAlbumData(prev => [{image, uid: prev.id, title: prev.title, musics: prev.musics, year: prev.year, authorId, genreId: prev.genreId}]);
                setSearchInfoAboutItem({image,...albumData});
            }
        });
        await setSearchTab(1);
        await setActiveSlide(6);
    };

    useEffect(() => {
        getFavoriteMusic(db, auth.currentUser.uid).then((res) => {
            res.forEach(({audioId}) => {
                if(audioId === uniqueid){
                    setFavoriteClass(true);
                }
            })
        })
        getAuthorId(db, AUDIO, uniqueid, setAuthorId).then((authorId) => {
            getDocDbAndSetStateWithoutPrev(db, AUTHORS, authorId, setAuthorData);
        });
        getAlbumId(db, AUDIO, uniqueid, setAlbumId).then((albumId) => {
            getDocDbAndSetStateWithoutPrev(db, ALBUMS, albumId, setAlbumData);
        });
        //eslint-disable-next-line
    }, [])

    return (
        <div className="user_collection_list_all_music_item">
            <div className="user_collection_list_all_music_item_base">
                <div className="user_collection_list_all_music_item_num item_list_all_collection" onClick={() => getMusicByClick(uniqueid)}>
                    {uniqueid === currentIdAudio ? <span className='circle_animation'>●</span> : i + 1 }
                </div>
                <div className="user_collection_list_all_music_item_name item_list_all_collection" onClick={() => getMusicByClick(uniqueid)}>
                    {name}
                </div>
                <div className="user_collection_list_all_music_item_album item_list_all_collection" onClick={() => getSingleAlbumPage()}>
                    {album}
                </div>
                <div className="user_collection_list_all_music_item_author item_list_all_collection" onClick={() => getSingleAuthorPage()}>
                    {author}
                </div>
                <div className="user_collection_list_all_music_item_duration item_list_all_collection">
                    <span>| <span className='duration_time'>{duration}</span></span>
                </div>
                <div className="user_collection_list_all_music_item_favorite item_list_all_collection">
                    <i onClick={onFavoriteMusic} className="fa-solid fa-heart" style={favoriteClass ? {color: 'orangered'} : null}></i>
                </div>
            </div>
        </div>
    )
};