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

const Author_Block = () => {

    const {db,auth, storage} = useFirebaseContext();
    const {authors, setAuthors, favoriteAuthors, setFavoriteAuthors} = useFavoritesContext();
    const [countFavorite, setCountFavorite] = useState(null);

    const getFavoriteAuthors = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data().favoriteAuthor);
        setFavoriteAuthors(docSnap.data().favoriteAuthor);
        getAuthorsForFavorite(docSnap.data().favoriteAuthor);
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
        const data = async () => {
            await getFavoriteAuthorTest().then(res => {
                setCountFavorite(res.length);
            });
        };

        data();

        if(authors.length === 0){
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

    const getFavoriteAuthorTest = async () => {
        const docRef = await doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        return await docSnap.data().favoriteAuthor;
    };

    return (
        <div className='favorite_section_tabs_block_authors'>
            {
                countFavorite !== null && countFavorite !== 0 ? 
                <div className="favorite_section_tabs_block_authors_list">
                    {
                        favoriteAuthors !== null && favoriteAuthors.length > 0 ?
                        elements_authors
                        :
                        null  
                    }
                </div>   
                : 
                <h2 className='not_found_elements'>Вы ещё не добавили ни одного исполнителя в коллекцию!</h2> 
            }
        </div>
    )
};

export default Author_Block;