import { useState, useEffect } from 'react';
import { useFirebaseContext } from '../../../context/FirebaseContext';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { MusicsList } from '../../albumsSection/AlbumsSection';
import './SingleAlbumPage.scss';
function SingleAlbumPage({image, uid, title, musics, year, authorId, genreId}) {
    const {db, auth} = useFirebaseContext();
    const [audioList, setAudioList] = useState([]);
    const [author, setAuthor] = useState(null);
    const [genre, setGenre] = useState(null);
    const [favoriteClass, setFavoriteClass] = useState(false);

    const getAudioByid = async (id) => {
        const docRef = await doc(db, 'audio',id);
        const docSnap = await getDoc(docRef);
        await setAudioList(prev => [...prev,docSnap.data()]);
        // return docSnap.data().favoriteAlbum;
    };

    const getAuthorById = async (id) => {
        const docRef = doc(db, 'authors', id);
        const docSnap = await getDoc(docRef);
        await setAuthor(docSnap.data().title);
    };

    const getGenreById = async (id) => {
        const docRef = doc(db, 'genres', id);
        const docSnap = await getDoc(docRef);
        await setGenre(docSnap.data().genre);
    };

    const getFavoriteAlbum = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        return docSnap.data().favoriteAlbum;
    };

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


    useEffect(() => {
        musics.forEach(({idAudio}) => {
            getAudioByid(idAudio);
        })
        getAuthorById(authorId);
        getGenreById(genreId);

        getFavoriteAlbum().then((res) => {
            res.forEach(({albumId}) => {
                if(albumId === uid){
                    setFavoriteClass(true);
                }
            })
        })
    }, [])

    return (
        <div className='single_album_page'>
            <div className="single_album_page_about">
                <div className="single_album_page_about_image">
                    <img src={image} alt="" />
                </div>
                <div className="single_album_page_about_text">
                    <span>Альбом</span>
                    <div className="single_album_page_about_text_title">
                        <h2>{title}</h2>
                    </div>
                    <div className="single_album_page_about_text_title">
                        {author !== null ? author : null}
                        {/* {author} */}
                    </div>
                    <div className="single_album_page_about_text_title">
                        {year} * {genre !== null ? genre : null}
                    </div>

                    <div className="single_album_page_favorite">
                        <i className="fa-solid fa-heart favorite_album_control" onClick={onFavoriteAlbum} style={favoriteClass ? {color: 'orangered'} : null}></i>
                    </div>

                </div>
            </div>

            <div className="single_album_page_audio_list">
                <MusicsList albumMusics={audioList}/>
            </div>
        </div>
    );
}

export default SingleAlbumPage;