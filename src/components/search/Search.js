import { useEffect, useState } from 'react';
import {useFirebaseContext} from '../../context/FirebaseContext';
import {getDocs, collection} from 'firebase/firestore';
import {ref,getDownloadURL } from "firebase/storage";
import './Search.scss';
import { useSearchContext } from '../../context/SearchContext';
import { AudioItem } from '../collectionsSection/CollectionsSection';
function Search(props) {

    const {db, storage} = useFirebaseContext();
    const {audios, setAudios, albums, setAlbums, authors, setAuthors} = useSearchContext();
    const [search, setSearch] = useState('');

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
    };

    const getFindItemsAudio = (arr, searchTerm) => {
        let findArray = [];
        arr.forEach(item => {
            if(item.name.includes(searchTerm)){
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
            if(item.title.includes(searchTerm)){
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
        elements_search_album = shortAlbumFind.map(item => {
            return (
                <div className="search_panel_modal_album_list_item">
                    <AlbumItem image={item.image} title={item.title}/>
                </div>
            )
        });
    };

    let elements_search_author = null;
    if(shortAuthorFind !== null){
        elements_search_author = shortAuthorFind.map(item => {
            return (
                <div className="search_panel_modal_author_list_item">
                    <AuthorItem image={item.image} title={item.title}/>
                </div>
            )
        });
    };

    let styleModal = 'none';
    if(search.length > 0){
        styleModal = 'block';
    }

    return (
        <div className="search_panel">
            <input 
            type="text" 
            placeholder="Трек, Альбом, Исполнитель"
            name='search'
            id='search'
            onChange={getSearchResults}/>
            <div className="search_panel_modal" style={{display: styleModal}}>
                <div className="search_panel_modal_audio">
                    <div className="search_panel_modal_audio_header">
                        <h4>Треки</h4>
                    </div>
                    <div className="search_panel_modal_audio_list">
                        {elements_search_audio}
                    </div>
                </div>

                <div className="search_panel_album_album">
                    <div className="search_panel_modal_album_header">
                        <h4>Альбомы</h4>
                    </div>
                    <div className="search_panel_modal_album_list">
                        {elements_search_album}
                    </div>
                </div>

                <div className="search_panel_author_album">
                    <div className="search_panel_modal_author_header">
                        <h4>Исполнители</h4>
                    </div>
                    <div className="search_panel_modal_author_list">
                        {elements_search_author}
                    </div>
                </div>
            </div>
        </div>
    );
};


const AlbumItem = ({image, title, author}) => {
    return (
        <div className="album_item">
            <div className="album_item_image">
                <img src={image} alt="" />
            </div>
            <div className="album_item_text">
                <div className="album_item_text_title">
                    {title}
                </div>
                <div className="album_item_text_author">
                    {author}
                </div>
            </div>
        </div>
    )
};

const AuthorItem = ({image, title}) => {
    return (
        <div className="album_item">
            <div className="album_item_image">
                <img src={image} alt="" />
            </div>
            <div className="album_item_text">
                <div className="album_item_text_author">
                    {title}
                </div>
            </div>
        </div>
    )
};

export default Search;