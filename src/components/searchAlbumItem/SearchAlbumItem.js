import { useEffect, useState } from 'react';
import {useFirebaseContext} from '../../context/FirebaseContext';
import { useSearchContext } from '../../context/SearchContext';
import { useTabsContext } from '../../context/TabsContext';
import 
{
    getFavoriteAlbum,
    addUserFavoriteAlbum,
    removeUserFavoriteAlbum,
} from '../../utils/functions/db';
const AlbumItem = ({image, title, author, id, musics, year, authorId, genreId, setShowModal}) => {
    const {db, auth} = useFirebaseContext();
    const {setSearchInfoAboutItem} = useSearchContext();
    const {setActiveSlide, setSearchTab} = useTabsContext();
    const [favoriteClass, setFavoriteClass] = useState(false);
    
    const onFavoriteAlbum = () => {
        getFavoriteAlbum(db, auth.currentUser.uid).then((res) => {
            let bool = false;
            res.forEach(({albumId}) => {
                if(+id === +albumId){
                    bool = true;
                }
            })
            if(bool === true){
                setFavoriteClass(false);
                removeUserFavoriteAlbum(db, auth.currentUser.uid ,id);
            } else{
                setFavoriteClass(true);
                addUserFavoriteAlbum(db, auth.currentUser.uid ,id);
            }
        });
    };

    useEffect(() => {
        getFavoriteAlbum(db, auth.currentUser.uid).then((res) => {
            res.forEach(({albumId}) => {
                if(+albumId === +id){
                    setFavoriteClass(true);
                }
            })
        })
        // eslint-disable-next-line
    }, [])


    const getSingleAlbumPage = async () => {
        await setActiveSlide(1);
        await setShowModal(false);
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

export default AlbumItem;