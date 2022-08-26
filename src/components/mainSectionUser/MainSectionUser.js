import React, { useEffect } from 'react';
import {doc, getDoc} from 'firebase/firestore';
import {ref} from "firebase/storage";
import { useAudioContext } from '../../context/AudioContext';
import {useDatabaseContext} from '../../context/DatabaseContext';
import {useFirebaseContext} from '../../context/FirebaseContext';
import {AUDIO_STORAGE} from '../../utils/data/storageId';
import {IDS, AUDIO, USERS} from '../../utils/data/collectionsId';
import { downloadFile } from '../../utils/functions/db';
import { useSettingContext } from '../../context/SettingContext';
import localization from '../../utils/data/localization/index';
import { keys } from '../../utils/data/localization/keys';
import './MainSectionUser.scss';
function MainSectionUser(props) {
    const {titleOrigin, titleTranslate, viewTitle} = useAudioContext();
    const {setCurrentAudio, setCurrentTextOfMusic, ids, setIds, setCurrentIdAudio, currentTextOfMusic} = useDatabaseContext();
    const {db, storage, auth} = useFirebaseContext();
    const {setPlayed} = useAudioContext();
    const {originalTextMute, translateTextMute} = useAudioContext();
    const {setAutoPlay} = useAudioContext();
    const {currentLocalization} = useSettingContext();

    const onRandomAudio = async () => {
        await setAutoPlay(true);
        await setPlayed(true);
        const randId = await randomId();
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
            const pathReference = ref(storage, `${AUDIO_STORAGE}/${randId}`);
            downloadFile(pathReference, setCurrentAudio);
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

    const getDataIdByDatabase = async () => {
        const docRef = doc(db,IDS,IDS);
        const docSnap = await getDoc(docRef);
        await setIds(docSnap.data());
    };

    const getDataAboutAudio = async (pathReference) => {
        const docRef = doc(db, AUDIO, pathReference);
        const docSnap = await getDoc(docRef);
        setCurrentTextOfMusic(docSnap.data().textOfMusic);
    };

    const getBanAudio = async () => {
        const docRef = doc(db, USERS, auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        return docSnap.data().banAudio;
    };

    useEffect(() => {
        getDataIdByDatabase();
        // eslint-disable-next-line
    }, [])
    return (
        <div className='user_main'>
            {
                viewTitle === false ?
                <div className="user_main_animation">
                    <h1 className='user_volna' style={{userSelect: 'none'}} onClick={onRandomAudio}>{currentLocalization !== null ? localization[currentLocalization][keys.waveText] : ''}</h1>
                </div>
                :
                <div className="user_main_text">
                    <h2 className='title_origin'>{originalTextMute === true ? titleOrigin : null}</h2>
                    <h2 className='title_translate'>{translateTextMute === true ? titleTranslate : null}</h2>
                    <h2 className='text_not_found'>{currentTextOfMusic.length <= 1 ? currentLocalization !== null ? localization[currentLocalization][keys.hintNotFoundText] : '' : null}</h2>
                </div>
            }
        </div>
    );
}
export default MainSectionUser;