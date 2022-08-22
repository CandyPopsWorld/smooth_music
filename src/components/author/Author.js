import { useEffect, useState } from 'react';
import Skeleton from '../skeleton/Skeleton';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { useSearchContext } from '../../context/SearchContext';
import { useTabsContext } from '../../context/TabsContext';
import 
{
    getFavoriteAuthor,
    addUserFavoriteAuthor,
    removeUserFavoriteAuthor,
} from '../../utils/functions/db';

const Author = ({image, id, description, title, albums, musics}) => {

    const {db, auth} = useFirebaseContext();
    const {setSearchInfoAboutItem, setShowModal} = useSearchContext();
    const {setActiveSlide, setSearchTab} = useTabsContext();
    const [favoriteClass, setFavoriteClass] = useState(false);

    const [loadImage, setLoadImage] = useState(false);

    const onFavoriteAuthor = () => {
        getFavoriteAuthor(db, auth.currentUser.uid).then((res) => {
            let bool = false;
            res.forEach(({authorId}) => {
                if(id === authorId){
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
                if(authorId === id){
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

export default Author;