import { useState, useEffect } from 'react';
import { useFirebaseContext } from '../../../context/FirebaseContext';
import MusicList from '../../musicList/MusicList';
import 
{
    addUserFavoriteAlbum, 
    removeUserFavoriteAlbum, 
    getFavoriteAlbum,
    getAuthorNameById,
    getGenreNameById,
    getAudioByid
} from '../../../utils/functions/db';
import './SingleAlbumPage.scss';
import Helmet from '../../helmet/Helmet';
import { SINGLE_ALBUM_PAGE_HELMET } from '../../../utils/data/seoHelmet';
import { useSettingContext } from '../../../context/SettingContext';
import localization from '../../../utils/data/localization/index';
import { keys } from '../../../utils/data/localization/keys';
function SingleAlbumPage({image, uid, title, musics, year, authorId, genreId}) {
    const {currentLocalization} = useSettingContext();
    const {db, auth} = useFirebaseContext();
    const [audioList, setAudioList] = useState([]);
    const [author, setAuthor] = useState(null);
    const [genre, setGenre] = useState(null);
    const [favoriteClass, setFavoriteClass] = useState(false);

    const onFavoriteAlbum = () => {
        getFavoriteAlbum(db, auth.currentUser.uid).then((res) => {
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
        musics.forEach(({idAudio}) => {
            getAudioByid(db, idAudio, setAudioList);
        })
        getAuthorNameById(db, authorId, setAuthor);
        getGenreNameById(db, genreId, setGenre);

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
        <div className='single_album_page'>
            <Helmet 
            title={author !== null && title ? SINGLE_ALBUM_PAGE_HELMET(author, title).title : ''}
            description={author !== null && title ? SINGLE_ALBUM_PAGE_HELMET(author, title).description : ''}/>
            {/* <Helmet title={author !== null && title ? `${author} альбом ${title} слушать онлайн бесплатно на Smooth Music в хорошем качестве` : ''}/> */}
            <div className="single_album_page_about">
                <div className="single_album_page_about_image">
                    <img src={image} alt="" />
                </div>
                <div className="single_album_page_about_text">
                    <span>{currentLocalization !== null ? localization[currentLocalization][keys.collectionAlbumsBlockMusicListText] : ''}</span>
                    <div className="single_album_page_about_text_title">
                        <h2>{title}</h2>
                    </div>
                    <div className="single_album_page_about_text_title">
                        {author !== null ? author : null}
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
                <MusicList albumMusics={audioList}/>
            </div>
        </div>
    );
}

export default SingleAlbumPage;