import { useEffect, useState } from 'react';
import {useFirebaseContext} from '../../context/FirebaseContext';
import {getDocs, collection, doc, getDoc, arrayUnion, arrayRemove, updateDoc} from 'firebase/firestore';
import {ref,getDownloadURL } from "firebase/storage";
import './Search.scss';
import { useSearchContext } from '../../context/SearchContext';
import { AudioItem } from '../collectionsSection/CollectionsSection';
import { useTabsContext } from '../../context/TabsContext';

function Search(props) {

    const {db, storage} = useFirebaseContext();
    const {audios, setAudios, albums, setAlbums, authors, setAuthors, showModal, setShowModal, search, setSearch} = useSearchContext();
    // const [search, setSearch] = useState('');

    const [shortAudioFind, setShortAudioFind] = useState(null);
    const [shortAlbumFind, setShortAlbumFind] = useState(null);
    const [shortAuthorFind, setShortAuthorFind] = useState(null);
    
    const getSearchResults = async (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);
        if(searchTerm !== ''){
            console.log('search:', searchTerm);
    
            const audiosFind = getFindItemsAudio(audios, searchTerm);
            console.log('Найденные песни:', audiosFind);
            setShortAudioFind(audiosFind);
            const albumsFind = getFindItemsAlbumAndAuthor(albums, searchTerm);
            console.log('Найденные альбомы:', albumsFind);
            setShortAlbumFind(albumsFind);
            const authorsFind = getFindItemsAlbumAndAuthor(authors, searchTerm);
            console.log('Найденные авторы:', authorsFind);
            setShortAuthorFind(authorsFind);
        }
        setShowModal(true);
    };

    const getFindItemsAudio = (arr, searchTerm) => {
        let findArray = [];
        arr.forEach(item => {
            if(item.name.toLowerCase().includes(searchTerm.toLowerCase())){
                if(findArray.length < 10){
                    findArray.push(item);
                }
            }
        });
        return findArray;
    };

    const getFindItemsAlbumAndAuthor = (arr, searchTerm) => {
        let findArray = [];
        arr.forEach(item => {
            if(item.title.toLowerCase().includes(searchTerm.toLowerCase())){
                if(findArray.length < 4){
                    findArray.push(item);
                }
            }
        });
        return findArray;
    };

    const getAllDocument = async (collect, func) => {
        const querySnapshot = await getDocs(collection(db, collect));
        let arr = [];
        await querySnapshot.forEach((doc) => {
            if(collect === 'albums'){
                getImageAlbumStorage(doc.data().id, 'album').then(resImg => {
                    console.log('resImg:', resImg);
                    arr.push({...doc.data(), image: resImg});
                })
            } else if(collect === 'authors'){
                getImageAlbumStorage(doc.data().id, 'author').then(resImg => {
                    console.log('resImg:', resImg);
                    arr.push({...doc.data(), image: resImg});
                })
            } 
            else {
                arr.push(doc.data());
            }
        });
        func(arr);
        return arr;
    };

    const getImageAlbumStorage = async (id, str) => {
        const pathReference = ref(storage, `${str}/${id}`);
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

    useEffect(() => {
        getAllDocument('audio', setAudios);
        getAllDocument('albums', setAlbums);
        getAllDocument('authors', setAuthors);
    }, [])

    let elements_search_audio = null;
    if(shortAudioFind !== null){
        elements_search_audio = shortAudioFind.map(({id, album, author, name, textOfMusic, duration}, i) => {
            return (
                <div className="search_panel_modal_audio_list_item" key={i}>
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
                </div>
            )
        });
    };

    let elements_search_album = null;
    if(shortAlbumFind !== null){
        elements_search_album = shortAlbumFind.map((item, i) => {
            return (
                <div className="search_panel_modal_album_list_item" key={i}>
                    <AlbumItem 
                    image={item.image} 
                    title={item.title} 
                    id={item.id} 
                    musics={item.musics} 
                    year={item.year}
                    authorId={item.authorId}
                    genreId={item.genreId} 
                    setShowModal={setShowModal}/>
                </div>
            )
        });
    };

    let elements_search_author = null;
    if(shortAuthorFind !== null){
        elements_search_author = shortAuthorFind.map((item, i) => {
            return (
                <div className="search_panel_modal_author_list_item" key={i}>
                    <AuthorItem 
                    image={item.image} 
                    title={item.title}
                    description={item.description}
                    albums={item.albums}
                    musics={item.musics} 
                    id={item.id}
                    setShowModal={setShowModal}/>
                </div>
            )
        });
    };

    let styleModal = 'none';
    if(search.length > 0 && showModal){
        styleModal = 'block';
    }

    return (
        <div className="search_panel">
            <input 
            type="text" 
            placeholder="Трек, Альбом, Исполнитель"
            name='search'
            id='search'
            onChange={getSearchResults}
            onClick={() => {
                setShowModal(true);
            }}
            value={search}/>
            <div className="search_modal" style={showModal === false ? {display: 'none'} : {display: 'block'}} onClick={() => {
                setShowModal(false);
            }}>
            
            </div>
            <div className="search_panel_modal" style={{display: styleModal}}>
                <div className="search_panel_modal_audio">
                    <div className="search_panel_modal_audio_header">
                        <h4>Треки</h4>
                    </div>
                    <div className="search_panel_modal_audio_list">
                        {elements_search_audio}
                        {shortAudioFind !== null && shortAudioFind.length === 0 ?  <span style={{color: 'red'}}>Треки по вашему запросу не найдены</span> : null}
                    </div>
                </div>

                <div className="search_panel_album_album">
                    <div className="search_panel_modal_album_header">
                        <h4>Альбомы</h4>
                    </div>
                    <div className="search_panel_modal_album_list">
                        {elements_search_album}
                        {shortAlbumFind !== null && shortAlbumFind.length === 0 ? <span style={{color: 'red'}}>Альбомы по вашему запросу не найдены</span> : null}
                    </div>
                </div>

                <div className="search_panel_author_album">
                    <div className="search_panel_modal_author_header">
                        <h4>Исполнители</h4>
                    </div>
                    <div className="search_panel_modal_author_list">
                        {elements_search_author}
                        {shortAuthorFind !== null && shortAuthorFind.length === 0 ? <span style={{color: 'red'}}>Исполнители по вашему запросу не найдены</span> : null}
                    </div>
                </div>
            </div>
            </div>
    );
};


const AlbumItem = ({image, title, author, id, musics, year, authorId, genreId, setShowModal}) => {
    const {db, auth} = useFirebaseContext();
    const {setSearchInfoAboutItem} = useSearchContext();
    const {setActiveSlide, setSearchTab} = useTabsContext();
    const [favoriteClass, setFavoriteClass] = useState(false);
    
    const onFavoriteAlbum = () => {
        getFavoriteAlbum().then((res) => {
            let bool = false;
            res.forEach(({albumId}) => {
                if(+id === +albumId){
                    bool = true;
                }
            })
            if(bool === true){
                setFavoriteClass(false);
                removeUserFavoriteAlbum(id);
            } else{
                setFavoriteClass(true);
                addUserFavoriteAlbum(id);
            }
        });
        // addUserFavoriteAudio();
    };

    const getFavoriteAlbum = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        return docSnap.data().favoriteAlbum;
    };

    const addUserFavoriteAlbum = async (id) => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAlbum: arrayUnion({albumId: id})
        });
    };

    const removeUserFavoriteAlbum = async (id) => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAlbum: arrayRemove({albumId: id})
        });
    };

    useEffect(() => {
        getFavoriteAlbum().then((res) => {
            res.forEach(({albumId}) => {
                if(+albumId === +id){
                    setFavoriteClass(true);
                }
            })
        })
    }, [])


    const getSingleAlbumPage = async () => {
        setActiveSlide(1);
        setShowModal(false);
        await setSearchInfoAboutItem({image, uid: id, title, musics, year, authorId, genreId});
        await setSearchTab(1);
        await setActiveSlide(6);
    };

    return (
        <div className="album_item">
            <div className="album_item_image">
                <img src={image} alt="" onClick={getSingleAlbumPage}/>
            </div>
            <div className="album_item_text">
                <div className="album_item_text_title" onClick={getSingleAlbumPage}>
                    {title}
                </div>
                <div className="album_item_text_author">
                    {author}
                </div>
            </div>
            <div className="album_item_favorite">
                <i className="fa-solid fa-heart favorite_album_control" onClick={onFavoriteAlbum} style={favoriteClass ? {color: 'orangered'} : null}></i>
            </div>
        </div>
    )
};

const AuthorItem = ({image, title, description, albums, musics, id, setShowModal}) => {

    const {db, auth} = useFirebaseContext();
    const {setSearchInfoAboutItem} = useSearchContext();
    const {setActiveSlide, setSearchTab} = useTabsContext();
    const [favoriteClass, setFavoriteClass] = useState(false);
    
    const onFavoriteAlbum = () => {
        getFavoriteAlbum().then((res) => {
            let bool = false;
            res.forEach(({authorId}) => {
                if(+id === +authorId){
                    bool = true;
                }
            })
            if(bool === true){
                setFavoriteClass(false);
                removeUserFavoriteAlbum(id);
            } else{
                setFavoriteClass(true);
                addUserFavoriteAlbum(id);
            }
        });
        // addUserFavoriteAudio();
    };

    const getFavoriteAlbum = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        return docSnap.data().favoriteAuthor;
    };

    const addUserFavoriteAlbum = async (id) => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAuthor: arrayUnion({authorId: id})
        });
    };

    const removeUserFavoriteAlbum = async (id) => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAuthor: arrayRemove({authorId: id})
        });
    };

    useEffect(() => {
        getFavoriteAlbum().then((res) => {
            res.forEach(({authorId}) => {
                if(+authorId === +id){
                    setFavoriteClass(true);
                }
            })
        })
    }, [])

    const getSingleAuthorPage = async () => {
        setActiveSlide(1);
        setShowModal(false);
        await setSearchInfoAboutItem({image, uid: id, title, description, albums, musics});
        await setSearchTab(2);
        await setActiveSlide(6);
    };

    return (
        <div className="album_item">
            <div className="album_item_image" onClick={getSingleAuthorPage}>
                <img src={image} alt="" />
            </div>
            <div className="album_item_text">
                <div className="album_item_text_author" onClick={getSingleAuthorPage}>
                    {title}
                </div>
            </div>
            <div className="album_item_favorite">
                <i className="fa-solid fa-heart favorite_album_control" onClick={onFavoriteAlbum} style={favoriteClass ? {color: 'orangered'} : null}></i>
            </div>
        </div>
    )
};

export default Search;