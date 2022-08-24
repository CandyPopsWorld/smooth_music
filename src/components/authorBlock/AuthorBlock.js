import { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import Author from '../author/Author';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import 
{ 
    getImageStorage, 
    getAuthor,
} from '../../utils/functions/db';
import { AUTHOR_STORAGE } from '../../utils/data/storageId';
import Loader from '../loader/Loader';
import Helmet from '../helmet/Helmet';
import { COLLECTION_AUTHORS_PAGE_HELMET } from '../../utils/data/seoHelmet';

const Author_Block = () => {

    const {db,auth, storage} = useFirebaseContext();
    const {authors, setAuthors, favoriteAuthors, setFavoriteAuthors} = useFavoritesContext();
    const [loading, setLoading] = useState(false);

    const getFavoriteAuthors = async () => {
        const docRef = await doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        await setFavoriteAuthors(docSnap.data().favoriteAuthor);
        await getAuthorsForFavorite(docSnap.data().favoriteAuthor);
        await setLoading(false);
    };

    const getAuthorsForFavorite = async (arr) => {
        await arr.forEach(item => {
            getAuthor(db, item.authorId).then(author => {
                getImageStorage(storage,AUTHOR_STORAGE,item.authorId).then((image) => {
                    setAuthors(prev => [...prev, {...author, image}]);
                });
            });
        })
    };

    useEffect(() => {
        if(authors.length === 0){
            setLoading(true);
            getFavoriteAuthors();
        }
        // eslint-disable-next-line
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
            <Helmet 
            title={auth && auth.currentUser ? COLLECTION_AUTHORS_PAGE_HELMET(auth.currentUser.displayName).title : ''}
            description={auth && auth.currentUser ? COLLECTION_AUTHORS_PAGE_HELMET(auth.currentUser.displayName).description : ''}/>
                <div className="favorite_section_tabs_block_authors_list">
                    {
                        loading ? <Loader/>
                        :
                        favoriteAuthors !== null && favoriteAuthors.length > 0 ?
                        elements_authors
                        :
                        <h2 className='not_found_elements'>Вы ещё не добавили ни одного исполнителя в коллекцию!</h2>
                    }
                </div>   
        </div>
    )
};

export default Author_Block;