import { useFavoritesContext } from '../../context/FavoritesContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { doc, getDoc } from "firebase/firestore";
import './UserFavoritesSection.scss';
import { MusicsList } from '../albumsSection/AlbumsSection';
import Loader from '../loader/Loader';
import { Album } from '../albumsSection/AlbumsSection';
import { useEffect, useState } from 'react';
import {ref,getDownloadURL } from "firebase/storage";
import {arrayUnion, arrayRemove, updateDoc} from "firebase/firestore";
import likeSprite from '../../resources/image/like_playlist.png';
import { useSearchContext } from '../../context/SearchContext';
import { useTabsContext } from '../../context/TabsContext';
import Skeleton from '../skeleton/Skeleton';

const nav_data = [
    {active: false, title: 'Альбомы', id: 1},
    {active: false, title: 'Исполнители', id: 2},
    {active: false, title: 'Плейлисты', id: 3},
];

function UserFavoritesSection(props) {
    const {activeTab, setActiveTab} = useFavoritesContext();

    const getActiveTab = () => {
        switch(activeTab){
            case 1:
                return <Album_Block/>;
            case 2:
                return <Author_Block/>;
            case 3:
                return <Playlist_Block/>;
            default: throw new Error();
        }
    };

    const element_tab = getActiveTab();

    const elements_nav = nav_data.map(({id, title, active}) => {
        const clazz = id === activeTab ? 'active' : '';

        const clickTab = () => {
            setActiveTab(id);
        };

        return (
            <div onClick={clickTab} className={`favorite_section_nav_block_item ${clazz}`} key={id}>
                {title}
            </div>
        )
    });
    return (
        <div className='favorite_section'>
            <div className="favorite_section_nav_block">
                {elements_nav}
            </div>
            <div className="favorite_section_tabs_block">
                {element_tab}
            </div>
        </div>
    );
};

const Playlist_Block = () => {

    const {db, auth} = useFirebaseContext();
    const {playlistMusic, setPlaylistMusic, favoriteAudio, setFavoriteAudio} = useFavoritesContext();

    const getFavoriteAudio = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        setFavoriteAudio(docSnap.data().favoriteAudio);
        docSnap.data().favoriteAudio.forEach(({audioId}) => {
            getMusic(audioId);
        });
        console.log(docSnap.data().favoriteAudio);
    };

    const getMusic = async (id) => {
        const audioRef = doc(db, 'audio', id);
        const audioSnap = await getDoc(audioRef);
        setPlaylistMusic(prev => [...prev, audioSnap.data()]);
    };

    const getMusicFromPlaylist = () => {
        console.log('dasd');
    }

    useEffect(() => {
        if(playlistMusic.length === 0){
            getFavoriteAudio();
        }
    }, [])

    const Playlist = ({image, getMusicFromPlaylist, title}) => {
        const {activePlaylist, setActivePlaylist} = useFavoritesContext();
        
        let clazz = 'albums_section_item_albums_block_item_bg';
        let active = false;
        if(activePlaylist === 0){
            // clazz+= ' active';
            active = true;
        }

        return (
        <div className="albums_section_item_albums_block_item">
            {/* <div className="albums_section_item_albums_block_item_bg"> */}
            <div className={clazz}>
                <img src={image} alt="" />
                <div className="albums_section_item_albums_block_item_bg_controls">
                    <i onClick={getMusicFromPlaylist} className="fa-solid fa-circle-play play_album_control"></i>
                </div>
            </div>
            <div className="albums_section_item_albums_block_item_title" style={active ? {color: 'orangered'} : null}>
                {title}
            </div>
        </div>       
        )
    }

    return (
        <div className='favorite_section_tabs_block_playlists'>
            <div className='albums_section'>
                <div className="albums_section_item_albums_block">
                    {
                        // elements_albums
                    }
                    <Playlist image={likeSprite} title={'Мне нравится'} getMusicFromPlaylist={getMusicFromPlaylist}/>
                </div>
                <div className="albums_section_item_music_block">
                    <MusicsList albumMusics={playlistMusic} title={'Мне нравится'}/>
                </div>
            </div>
        </div>
    )
};
// 

const Author_Block = () => {

    const {db,auth, storage} = useFirebaseContext();
    const {authors, setAuthors, favoriteAuthors, setFavoriteAuthors} = useFavoritesContext();

    const getFavoriteAuthors = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data().favoriteAuthor);
        setFavoriteAuthors(docSnap.data().favoriteAuthor);
        getAuthorsForFavorite(docSnap.data().favoriteAuthor);
    };

    const getAuthorsForFavorite = async (arr) => {
        await arr.forEach(item => {
            getAuthor(item.authorId).then(author => {
                getImageAuthorStorage(item.authorId).then((image) => {
                    setAuthors(prev => [...prev, {...author, image}]);
                });
            });
        })
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

    const getAuthor = async (id) => {
        const docRef = await doc(db, 'authors', id);
        const docSnap = await getDoc(docRef);
        // console.log(docSnap.data());
        return await docSnap.data();
    };

    useEffect(() => {
        if(authors.length === 0){
            getFavoriteAuthors();
        }
    }, [])

    let elements_authors = null;
    if(authors.length > 0){
        elements_authors = authors.map(item => {
            return <Author 
            key={item.id} 
            image={item.image}
            id={item.id}
            description={item.description}
            title={item.title}
            albums={item.albums}
            musics={item.musics}
            />
        });
    }

    return (
        <div className='favorite_section_tabs_block_authors'>
            <div className="favorite_section_tabs_block_authors_list">
                {
                    favoriteAuthors !== null && favoriteAuthors.length > 0 ?
                    elements_authors
                    :
                    (favoriteAuthors !== null ? <h2 className='not_found_elements'>Вы ещё не добавили ни одного альбма в коллекцию!</h2> : null)   
                }
            </div>
        </div>
    )
};

const Author = ({image, id, description, title, albums, musics}) => {

    const {db, auth} = useFirebaseContext();
    const {setSearchInfoAboutItem, setShowModal} = useSearchContext();
    const {setActiveSlide, setSearchTab} = useTabsContext();
    const [favoriteClass, setFavoriteClass] = useState(false);

    const [loadImage, setLoadImage] = useState(false);

    const onFavoriteAuthor = () => {
        getFavoriteAuthor().then((res) => {
            let bool = false;
            res.forEach(({authorId}) => {
                if(id === authorId){
                    bool = true;
                }
            })
            if(bool === true){
                setFavoriteClass(false);
                removeUserFavoriteAuthor();
            } else{
                setFavoriteClass(true);
                addUserFavoriteAuthor();
            }
        });
    };

    const getFavoriteAuthor = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        return docSnap.data().favoriteAuthor;
    };

    const addUserFavoriteAuthor = async () => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAuthor: arrayUnion({authorId: id})
        });
    };

    const removeUserFavoriteAuthor = async () => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAuthor: arrayRemove({authorId: id})
        });
    };

    useEffect(() => {
        getFavoriteAuthor().then((res) => {
            res.forEach(({authorId}) => {
                if(authorId === id){
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


    return(
        <div className="favorite_section_author_block">
            <div className="favorite_section_author_block_image" style={{position: 'relative'}}>
                <img src={image} alt="" onClick={getSingleAuthorPage} onLoad={() => {
                    setLoadImage(true);
                }}/>
                {
                    loadImage === false ? <Skeleton position={'absolute'} variant={'circular'}/> : null
                }
                <span style={{textAlign: 'center'}}>{title}</span>
                <div className="favorite_section_author_block_favorite">
                    <i className="fa-solid fa-heart favorite_album_control" onClick={onFavoriteAuthor} style={favoriteClass ? {color: 'orangered'} : null}></i>
                </div>
            </div>
        </div>
    )
};

const Album_Block = () => {
    const {auth, db, storage} = useFirebaseContext();
    const {favoriteAlbums, setFavoriteAlbums, albumMusics, setAlbumMusics, albums, setAlbums} = useFavoritesContext();

    const getFavoriteAlbum = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data().favoriteAlbum);
        setFavoriteAlbums(docSnap.data().favoriteAlbum);
        getAlbumsForFavorite(docSnap.data().favoriteAlbum);
    };

    const getAlbum = async (id) => {
        const docRef = await doc(db, 'albums', id);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
        return await docSnap.data();
    }

    const getAlbumsForFavorite = async (arr) => {
        await arr.forEach(item => {
            getAlbum(item.albumId).then(album => {
                getImagaAlbumStorage(item.albumId).then((image) => {
                    setAlbums(prev => [...prev, {...album, image}]);
                });
            });
        })
    };

    const getImagaAlbumStorage = async (id) => {
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

    useEffect(() => {
        if(albums.length === 0){
            getFavoriteAlbum();
        }
    }, [])

    useEffect(() => {
        if(albums.length > 0){
            setAlbums([]);
            getFavoriteAlbum();
        }
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

    console.log(favoriteAlbums);

    const favoriteCount = () => {

    };

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
                    <MusicsList albumMusics={albumMusics}/>
                </div>
            </div>
        </div>
    )
};

export default UserFavoritesSection;