import { useState, useEffect } from 'react';
import { useFirebaseContext } from '../../../context/FirebaseContext';
import { MusicsList } from '../../albumsSection/AlbumsSection';
import { Album } from '../../albumsSection/AlbumsSection';
import 
{
    addUserFavoriteAuthor,
    removeUserFavoriteAuthor,
    getFavoriteAuthor,
    getAudioByid,
    getAlbumsByid
} from '../../../utils/functions/db';
import './SingleAuthorPage.scss';
function SingleAuthorPage({image, uid, title, description, albums, musics}) {

    const {db, auth, storage} = useFirebaseContext();
    const [favoriteClass, setFavoriteClass] = useState(false);
    const [allAudioList, setAllAudioList] = useState([]);
    const [allAlbumList, setAllAlbumList] = useState([]);
    const [albumMusics, setAlbumMusics] = useState(null);

    const onFavoriteAuthor = () => {
        getFavoriteAuthor(db, auth.currentUser.uid).then((res) => {
            let bool = false;
            res.forEach(({authorId}) => {
                if(uid === authorId){
                    bool = true;
                }
            })
            if(bool === true){
                setFavoriteClass(false);
                removeUserFavoriteAuthor(db, auth.currentUser.uid, uid);
            } else{
                setFavoriteClass(true);
                addUserFavoriteAuthor(db, auth.currentUser.uid, uid);
            }
        });
    };

    useEffect(() => {
        musics.forEach(({idAudio}) => {
            getAudioByid(db,idAudio,setAllAudioList);
        });

        albums.forEach(({idAlbum}) => {
            getAlbumsByid(db, storage, idAlbum, setAllAlbumList);
        })

        getFavoriteAuthor(db, auth.currentUser.uid).then((res) => {
            res.forEach(({authorId}) => {
                if(authorId === uid){
                    setFavoriteClass(true);
                }
            })
        })
        // eslint-disable-next-line
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