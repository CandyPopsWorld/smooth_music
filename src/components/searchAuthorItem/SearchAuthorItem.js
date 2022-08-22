import { useEffect, useState } from 'react';
import {useFirebaseContext} from '../../context/FirebaseContext';
import { useSearchContext } from '../../context/SearchContext';
import { useTabsContext } from '../../context/TabsContext';
import 
{
    getFavoriteAuthor,
    addUserFavoriteAuthor,
    removeUserFavoriteAuthor
} from '../../utils/functions/db';

const AuthorItem = ({image, title, description, albums, musics, id, setShowModal}) => {

    const {db, auth} = useFirebaseContext();
    const {setSearchInfoAboutItem} = useSearchContext();
    const {setActiveSlide, setSearchTab} = useTabsContext();
    const [favoriteClass, setFavoriteClass] = useState(false);
    
    const onFavoriteAlbum = () => {
        getFavoriteAuthor(db, auth.currentUser.uid).then((res) => {
            let bool = false;
            res.forEach(({authorId}) => {
                if(+id === +authorId){
                    bool = true;
                }
            })
            if(bool === true){
                setFavoriteClass(false);
                removeUserFavoriteAuthor(db, auth.currentUser.uid, id);
            } else{
                setFavoriteClass(true);
                addUserFavoriteAuthor(db, auth.currentUser.uid, id);
            }
        });
    };

    useEffect(() => {
        getFavoriteAuthor(db, auth.currentUser.uid).then((res) => {
            res.forEach(({authorId}) => {
                if(+authorId === +id){
                    setFavoriteClass(true);
                }
            })
        })
        // eslint-disable-next-line
    }, [])

    const getSingleAuthorPage = async () => {
        await setActiveSlide(1);
        await setShowModal(false);
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

export default AuthorItem;