import { useState, useEffect } from 'react';
import { useFirebaseContext } from '../../../context/FirebaseContext';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import {ref,getDownloadURL } from "firebase/storage";
import './SingleAuthorPage.scss';
import { MusicsList } from '../../albumsSection/AlbumsSection';
import { Album } from '../../albumsSection/AlbumsSection';
function SingleAuthorPage({image, uid, title, description, albums, musics}) {

    const {db, auth, storage} = useFirebaseContext();
    const [favoriteClass, setFavoriteClass] = useState(false);
    const [allAudioList, setAllAudioList] = useState([]);
    const [allAlbumList, setAllAlbumList] = useState([]);
    const [albumMusics, setAlbumMusics] = useState(null);

    const getFavoriteAuthor = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        return docSnap.data().favoriteAuthor;
    };

    const onFavoriteAuthor = () => {
        getFavoriteAuthor().then((res) => {
            let bool = false;
            res.forEach(({authorId}) => {
                if(uid === authorId){
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

    const addUserFavoriteAuthor = async () => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAuthor: arrayUnion({authorId: uid})
        });
    };

    const removeUserFavoriteAuthor = async () => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAuthor: arrayRemove({authorId: uid})
        });
    };

    const getAudioByid = async (id) => {
        const docRef = await doc(db, 'audio',id);
        const docSnap = await getDoc(docRef);
        await setAllAudioList(prev => [...prev,docSnap.data()]);
    };

    const getAlbumsByid = async (id) => {
        const docRef = await doc(db, 'albums',String(id));
        const docSnap = await getDoc(docRef);
        await getImageAlbumStorage(id).then((image) => {
            setAllAlbumList(prev => [...prev,{...docSnap.data(), image}]);
        });
    };

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

    useEffect(() => {
        musics.forEach(({idAudio}) => {
            getAudioByid(idAudio);
        });

        albums.forEach(({idAlbum}) => {
            getAlbumsByid(idAlbum);
        })

        getFavoriteAuthor().then((res) => {
            res.forEach(({authorId}) => {
                if(authorId === uid){
                    setFavoriteClass(true);
                }
            })
        })
    }, [])

    let elements_albums = null;
    if(allAlbumList.length > 0){
        elements_albums = allAlbumList.map(item => {
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
        <div className='single_author_page'>
            <div className="single_author_page_item_about">
                <div className="single_author_page_about">
                    <div className="single_author_page_about_image">
                        <img src={image} alt="" style={{width: '200px', height: '200px'}}/>
                    </div>

                    <div className="single_author_page_about_title">
                        <span>Исполнитель</span>
                        <h2>{title}</h2>
                        <div className="single_author_page_about_favorite">
                            <i className="fa-solid fa-heart favorite_album_control" onClick={onFavoriteAuthor} style={favoriteClass ? {color: 'orangered'} : null}></i>
                        </div>
                    </div>
                </div>

                <div className="single_author_page_about_description">
                    {description}
                </div>
                
                <h2>Все альбомы</h2>

                <div className="single_author_page_about_all_album_list">
                    {elements_albums}
                </div>

                <div className="single_author_page_about_all_music_list">
                    <MusicsList albumMusics={allAudioList} title={'Все треки'}/>
                </div>
            </div>

            <div className="albums_section_item_music_block">
                <MusicsList albumMusics={albumMusics !== null ? albumMusics : []}/>
            </div>
        </div>
    );
}

export default SingleAuthorPage;