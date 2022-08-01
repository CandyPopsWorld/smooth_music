import './CollectionSection.scss';
import { collection, getDocs } from "firebase/firestore";
import { useFirebaseContext } from '../../context/FirebaseContext';
import {useDatabaseContext} from '../../context/DatabaseContext';
import {ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { useEffect } from 'react';
function CollectionsSection(props) {

    const {db} = useFirebaseContext();
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


const AudioItem = ({idKey,uniqueid, i, name, album, author,textOfMusic, duration}) => {

    const {storage} = useFirebaseContext();
    const {setCurrentAudio, setCurrentTextOfMusic,setCurrentIdAudio, currentIdAudio} = useDatabaseContext();

    const getMusicByClick = (id) => {
        console.log(id);
        const pathReference = ref(storage, id);
        setCurrentTextOfMusic(textOfMusic);
        setCurrentIdAudio(id);
        getDownloadURL(pathReference)
        .then((url) => {
            setCurrentAudio(url);
        })
        .catch(() => {
    
        })
    };

    if(uniqueid === currentIdAudio){

    }

    return (
        <div idKey={idKey} className="user_collection_list_all_music_item" onClick={() => getMusicByClick(uniqueid)}>
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
            </div>
        </div>
    )
};

export default CollectionsSection;