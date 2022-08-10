import './CollectionSection.scss';
import { collection, getDocs, arrayUnion, arrayRemove, updateDoc, doc, getDoc } from "firebase/firestore";
import { useFirebaseContext } from '../../context/FirebaseContext';
import {useDatabaseContext} from '../../context/DatabaseContext';
import {ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
function CollectionsSection(props) {

    const {db, auth} = useFirebaseContext();
    const {allDocumentDatabaseAudio,setAllDocumentDatabaseAudio} = useDatabaseContext();

    const getAllDocumentDatabase = async () => {
        const querySnapshot = await getDocs(collection(db, "audio"));
        querySnapshot.forEach((doc) => {
            setAllDocumentDatabaseAudio(prev => [...prev,doc.data()]);
            console.log(doc.id, " => ", doc.data());
        });
    };

    useEffect(() => {
        if(allDocumentDatabaseAudio.length === 0){
            getAllDocumentDatabase();
        }
    }, [])

    let elements_all_music = null;
    if(allDocumentDatabaseAudio.length !== 0){
        elements_all_music = allDocumentDatabaseAudio.map(({album, author, name, id, textOfMusic, duration}, i) => {
            return(
                <AudioItem 
                idkey={id}
                uniqueid={id} 
                key={id} 
                album={album} 
                author={author} 
                name={name} 
                i={i}
                textOfMusic={textOfMusic}
                duration={duration}/>
            )
        });
    }

    return (
        <div className='user_collection'>
            <h2>Коллекция</h2>
            <h3>Вся музыка</h3>
            <div className="user_collection_list_all_music">
                {elements_all_music}
            </div>
        </div>
    );
};


export const AudioItem = ({uniqueid, i, name, album, author,textOfMusic, duration}) => {

    const {storage, auth, db} = useFirebaseContext();
    const {setCurrentAudio, setCurrentTextOfMusic,setCurrentIdAudio, currentIdAudio} = useDatabaseContext();
    const [favoriteObj, setFavoriteObj] = useState([]);
    const [favoriteClass, setFavoriteClass] = useState(false);

    const getMusicByClick = (id) => {
        console.log(id);
        const pathReference = ref(storage, `audio/${id}`);
        setCurrentTextOfMusic(textOfMusic);
        setCurrentIdAudio(id);
        getDownloadURL(pathReference)
        .then((url) => {
            setCurrentAudio(url);
        })
        .catch(() => {
    
        })
    };

    const onFavoriteMusic = () => {
        getFavoriteMusic().then((res) => {
            let bool = false;
            res.forEach(({audioId}) => {
                if(uniqueid === audioId){
                    bool = true;
                }
            })
            if(bool === true){
                setFavoriteClass(false);
                removeUserFavoriteAudio();
            } else{
                setFavoriteClass(true);
                addUserFavoriteAudio();
            }
        });
        // addUserFavoriteAudio();
    };

    const addUserFavoriteAudio = async () => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAudio: arrayUnion({audioId: uniqueid})
        });
    };

    const removeUserFavoriteAudio = async () => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            favoriteAudio: arrayRemove({audioId: uniqueid})
        });
    };


    const getFavoriteMusic = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        // await setFavoriteObj(docSnap.data().favoriteAudio);
        return docSnap.data().favoriteAudio;
        // console.log(docSnap.data().favoriteAudio);
    };

    if(uniqueid === currentIdAudio){

    };

    useEffect(() => {
        getFavoriteMusic().then((res) => {
            res.forEach(({audioId}) => {
                if(audioId === uniqueid){
                    console.log('совпадение:', uniqueid);
                    setFavoriteClass(true);
                }
            })
        })
    }, [])

    console.log(favoriteClass);

    return (
        <div className="user_collection_list_all_music_item" onClick={() => getMusicByClick(uniqueid)}>
            <div className="user_collection_list_all_music_item_base">
                <div className="user_collection_list_all_music_item_num item_list_all_collection">
                    {uniqueid === currentIdAudio ? <span className='circle_animation'>●</span> : i + 1 }
                </div>
                <div className="user_collection_list_all_music_item_name item_list_all_collection">
                    {name}
                </div>
                <div className="user_collection_list_all_music_item_album item_list_all_collection">
                    {album}
                </div>
                <div className="user_collection_list_all_music_item_author item_list_all_collection">
                    {author}
                </div>
                <div className="user_collection_list_all_music_item_duration item_list_all_collection">
                    <span>| <span className='duration_time'>{duration}</span></span>
                </div>
                <div className="user_collection_list_all_music_item_favorite item_list_all_collection">
                    <i onClick={onFavoriteMusic} className="fa-solid fa-heart" style={favoriteClass ? {color: 'orangered'} : null}></i>
                </div>
            </div>
        </div>
    )
};

export default CollectionsSection;