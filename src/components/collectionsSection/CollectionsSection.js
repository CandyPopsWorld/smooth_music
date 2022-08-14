import './CollectionSection.scss';
import { collection, getDocs, arrayUnion, arrayRemove, updateDoc, doc, getDoc } from "firebase/firestore";
import { useFirebaseContext } from '../../context/FirebaseContext';
import {useDatabaseContext} from '../../context/DatabaseContext';
import {ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { useSearchContext } from '../../context/SearchContext';
import { useTabsContext } from '../../context/TabsContext';
import { useAudioContext } from '../../context/AudioContext';

export const AudioItem = ({uniqueid, i, name, album, author,textOfMusic, duration, authorId, albumId}) => {

    const {storage, auth, db} = useFirebaseContext();
    const {setCurrentAudio, setCurrentTextOfMusic,setCurrentIdAudio, currentIdAudio} = useDatabaseContext();
    const [favoriteObj, setFavoriteObj] = useState([]);
    const [favoriteClass, setFavoriteClass] = useState(false);

    const {setFavoriteAudio, setPlaylistMusic} = useFavoritesContext();


    const {setSearchInfoAboutItem, setShowModal} = useSearchContext();
    const {setActiveSlide, setSearchTab} = useTabsContext();

    const [authorData, setAuthorData] = useState(null);
    const [albumData, setAlbumData] = useState(null);
    const {setPlayed, setCurrentTime} = useAudioContext();

    const getMusicByClick = (id) => {
        console.log(id);
        setPlayed(true);
        setCurrentTime(0);
        const pathReference = ref(storage, `audio/${id}`);
        setCurrentTextOfMusic(textOfMusic);
        setCurrentIdAudio(id);
        getDownloadURL(pathReference)
        .then((url) => {
            setCurrentAudio(url);
        })
        .catch(() => {
    
        })
    };

    const onFavoriteMusic = () => {
        getFavoriteMusic().then((res) => {
            let bool = false;
            res.forEach(({audioId}) => {
                if(uniqueid === audioId){
                    bool = true;
                }
            })
            if(bool === true){
                setFavoriteClass(false);
                removeUserFavoriteAudio();
            } else{
                setFavoriteClass(true);
                addUserFavoriteAudio();
            }
        });
        // addUserFavoriteAudio();
    };

    const addUserFavoriteAudio = async () => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAudio: arrayUnion({audioId: uniqueid})
        });
    };

    const removeUserFavoriteAudio = async () => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAudio: arrayRemove({audioId: uniqueid})
        });
    };


    const getFavoriteMusic = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        // await setFavoriteObj(docSnap.data().favoriteAudio);
        return docSnap.data().favoriteAudio;
        // console.log(docSnap.data().favoriteAudio);
    };

    const getAuthorMusic = async (id) => {
        const docRef = doc(db, 'authors', id);
        const docSnap = await getDoc(docRef);
        await setAuthorData(docSnap.data());
    };

    const getAlbumMusic = async (id) => {
        const docRef = doc(db, 'albums', id);
        const docSnap = await getDoc(docRef);
        await setAlbumData(docSnap.data());
    };

    if(uniqueid === currentIdAudio){

    };

    useEffect(() => {
        getFavoriteMusic().then((res) => {
            res.forEach(({audioId}) => {
                if(audioId === uniqueid){
                    console.log('совпадение:', uniqueid);
                    setFavoriteClass(true);
                }
            })
        })

        getAuthorMusic(authorId);
        getAlbumMusic(albumId);
        // console.log(authorId);
    }, [])

    const getImageAlbumStorage = async (id) => {
        const pathReference = ref(storage, `album/${id}`);
        let urlExport = '';
        await getDownloadURL(pathReference)
        .then((url) => {
            urlExport = url;
        })
        .catch((error) => {
            // console.log(error);
        })
        return urlExport;
    };

    const getSingleAuthorPage = async () => {
        setActiveSlide(1);
        setShowModal(false);
        await getImageAuthorStorage(authorId).then((image) => {
            console.log(image);
            if(authorData !== null){
                setAuthorData(prev => [{image, uid: prev.id, title: prev.title, description: prev.description, albums: prev.albums, musics: prev.musics}]);
                setSearchInfoAboutItem({image,...authorData});
            }
        });
        await setSearchTab(2);
        await setActiveSlide(6);
    };

    const getImageAuthorStorage = async (id) => {
        const pathReference = ref(storage, `author/${id}`);
        let urlExport = '';
        await getDownloadURL(pathReference)
        .then((url) => {
            urlExport = url;
        })
        .catch((error) => {
            // console.log(error);
        })
        return urlExport;
    };

    const getSingleAlbumPage = async () => {
        setActiveSlide(1);
        setShowModal(false);
        await getImageAlbumStorage(albumId).then((image) => {
            if(albumData !== null){
                setAuthorData(prev => [{image, uid: prev.id, title: prev.title, musics: prev.musics, year: prev.year, authorId, genreId: prev.genreId}]);
                setSearchInfoAboutItem({image,...albumData});
            }
        });
        // await setSearchInfoAboutItem({image, uid: id, title, musics, year, authorId, genreId});
        await setSearchTab(1);
        await setActiveSlide(6);
    };

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