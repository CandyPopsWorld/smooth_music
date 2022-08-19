import React, { useEffect } from 'react';
import spriteVideo from '../../resources/video/animation.gif';
import { useAudioContext } from '../../context/AudioContext';
import {useDatabaseContext} from '../../context/DatabaseContext';
import {doc, getDoc} from 'firebase/firestore';
import {useFirebaseContext} from '../../context/FirebaseContext';
import {ref,getDownloadURL } from "firebase/storage";
import './MainSectionUser.scss';
function MainSectionUser(props) {
    const {titleOrigin, titleTranslate, viewTitle} = useAudioContext();
    const {currentAudio, setCurrentAudio, setCurrentTextOfMusic, ids, setIds, setCurrentIdAudio} = useDatabaseContext();
    const {db, storage, auth} = useFirebaseContext();
    const {setPlayed} = useAudioContext();
    const {originalTextMute, translateTextMute} = useAudioContext();
    const {setAutoPlay} = useAudioContext();

    const onRandomAudio = async () => {
        await setAutoPlay(true);
        await setPlayed(true);
        const randId = await randomId();
        console.log(randId);

        let bool = false;
        await getBanAudio().then((res) => {
            res.forEach(({audioId}) => {
                if(String(randId) === audioId){
                    bool = true;
                }
            })
        });


        if(bool === true){
            onRandomAudio();
            return;
        } else{
            const pathReference = ref(storage, `audio/${randId}`);
            randomDownloadFile(pathReference);
            getDataAboutAudio(`${randId}`);
            setCurrentIdAudio(`${randId}`);
            return;
        }
    };

    const randomId = () => {
        const minId = +ids.minId;
        const maxId = +ids.maxId;
        const randId = Math.floor(Math.random() * (maxId - minId + 1) + minId);
        return randId;
    };

    const randomDownloadFile = (pathReference) => {
        getDownloadURL(pathReference)
        .then((url) => {
            setCurrentAudio(url);
        })
        .catch(() => {

        })
    }

    const getDataIdByDatabase = async () => {
        const docRef = doc(db, 'ids', 'ids');
        const docSnap = await getDoc(docRef);
        await setIds(docSnap.data());
    };

    const getDataAboutAudio = async (pathReference) => {
        console.log(pathReference);
        const docRef = doc(db, 'audio', pathReference);
        const docSnap = await getDoc(docRef);
        setCurrentTextOfMusic(docSnap.data().textOfMusic);
        console.log(docSnap.data());
    };

    const getBanAudio = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        return docSnap.data().banAudio;
    };

    useEffect(() => {
        getDataIdByDatabase();
    }, [])

    return (
        <div className='user_main'>
            {
                viewTitle === false ?
                <div className="user_main_animation">
                    <h1 className='user_volna' style={{userSelect: 'none'}} onClick={onRandomAudio}>Моя Волна</h1>
                </div>

                :

                <div className="user_main_text">
                    <h2 className='title_origin'>{originalTextMute === true ? titleOrigin : null}</h2>
                    <h2 className='title_translate'>{translateTextMute === true ? titleTranslate : null}</h2>
                </div>
            }
        </div>
    );
}

export default MainSectionUser;