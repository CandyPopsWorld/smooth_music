import { useEffect, useState } from 'react';
import {useFirebaseContext} from '../../context/FirebaseContext';
import { useSearchContext } from '../../context/SearchContext';
import { AudioItem } from '../collectionsSection/CollectionsSection';
import {getFindItemsAudio, getFindItemsAlbumAndAuthor} from '../../utils/functions/search';
import {getAllDocument,} from '../../utils/functions/db';
import { ALBUMS, AUDIO, AUTHORS } from '../../utils/data/collectionsId';
import SearchIcon from '@mui/icons-material/Search';
import AlbumItem from '../searchAlbumItem/SearchAlbumItem';
import AuthorItem from '../searchAuthorItem/SearchAuthorItem';
import { useSettingContext } from '../../context/SettingContext';
import localization from '../../utils/data/localization/index';
import { keys } from '../../utils/data/localization/keys';
import './Search.scss';
function Search(props) {

    const {db, storage} = useFirebaseContext();
    const {audios, setAudios, albums, setAlbums, authors, setAuthors, showModal, setShowModal, search, setSearch} = useSearchContext();
    const [shortAudioFind, setShortAudioFind] = useState(null);
    const [shortAlbumFind, setShortAlbumFind] = useState(null);
    const [shortAuthorFind, setShortAuthorFind] = useState(null);
    const {currentLocalization} = useSettingContext();
    
    const getSearchResults = async (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);
        if(searchTerm !== ''){
            const audiosFind = getFindItemsAudio(audios, searchTerm);
            setShortAudioFind(audiosFind);
            const albumsFind = getFindItemsAlbumAndAuthor(albums, searchTerm);
            setShortAlbumFind(albumsFind);
            const authorsFind = getFindItemsAlbumAndAuthor(authors, searchTerm);
            setShortAuthorFind(authorsFind);
        }
        setShowModal(true);
    };

    useEffect(() => {
        getAllDocument(db, storage, AUDIO, setAudios);
        getAllDocument(db, storage, ALBUMS, setAlbums);
        getAllDocument(db, storage, AUTHORS, setAuthors);
        // eslint-disable-next-line
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
            <label htmlFor="search">
                <SearchIcon style={{color: 'white', marginRight: '10px', marginTop: '5px', cursor: 'pointer'}}/>
            </label>
            <input 
            type="text" 
            placeholder={currentLocalization !== null ? localization[currentLocalization][keys.searchPlaceholder] : ''}
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
            <div className="search_panel_modal" style={{display: styleModal, zIndex: 100}}>
                <div className="search_panel_modal_audio">
                    <div className="search_panel_modal_audio_header">
                        <h4>{currentLocalization !== null ? localization[currentLocalization][keys.searchHeaderAudio] : ''}</h4>
                    </div>
                    <div className="search_panel_modal_audio_list">
                        {elements_search_audio}
                        {shortAudioFind !== null && shortAudioFind.length === 0 ?  <span style={{color: 'red'}}>{currentLocalization !== null ? localization[currentLocalization][keys.searchErrorHeaderAudio] : ''}</span> : null}
                    </div>
                </div>

                <div className="search_panel_album_album">
                    <div className="search_panel_modal_album_header">
                        <h4>{currentLocalization !== null ? localization[currentLocalization][keys.searchHeaderAlbum] : ''}</h4>
                    </div>
                    <div className="search_panel_modal_album_list">
                        {elements_search_album}
                        {shortAlbumFind !== null && shortAlbumFind.length === 0 ? <span style={{color: 'red'}}>{currentLocalization !== null ? localization[currentLocalization][keys.searchErrorHeaderAlbum] : ''}</span> : null}
                    </div>
                </div>

                <div className="search_panel_author_album">
                    <div className="search_panel_modal_author_header">
                        <h4>{currentLocalization !== null ? localization[currentLocalization][keys.searchHeaderAuthor] : ''}</h4>
                    </div>
                    <div className="search_panel_modal_author_list">
                        {elements_search_author}
                        {shortAuthorFind !== null && shortAuthorFind.length === 0 ? <span style={{color: 'red'}}>{currentLocalization !== null ? localization[currentLocalization][keys.searchErrorHeaderAuthor] : ''}</span> : null}
                    </div>
                </div>
            </div>
            </div>
    );
};

export default Search;