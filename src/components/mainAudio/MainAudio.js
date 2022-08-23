import { useState, useRef } from 'react';
import {ref,getDownloadURL } from "firebase/storage";
import ReactAudioPlayer from 'react-audio-player';
import Player from '../player/Player';
import { useAudioContext } from '../../context/AudioContext';
import { useDatabaseContext } from '../../context/DatabaseContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import './MainAudio.scss';

function MainAudio(props) {
    const {storage} = useFirebaseContext();
    const {currentAudio, currentIdAudio} = useDatabaseContext();
    const [duration, setDuration] = useState(null);
    const [volume, setVolume] = useState(null);
    const [mute, setMute] = useState(false);
    const [favoriteClass, setFavoriteClass] = useState(false);
    const [banClass, setBanClass] = useState(false);

    const {
        setCurrentTime,
        setTitleOrigin,
        setTitleTranslate, 
        setViewTitle,
        setTextOfMusic, 
        currentTime 
    } = useAudioContext();

    const {currentTextOfMusic} = useDatabaseContext();

    const {played, setPlayed} = useAudioContext();
    const {currentPlayMusicList, setCurrentUidMusicList, currentUidMusicList} = useDatabaseContext();
    const [currentIndexMusicListAudio, setCurrentIndexMusicListAudio] = useState(null);
    const {setCurrentAudio, setCurrentTextOfMusic,setCurrentIdAudio} = useDatabaseContext();

    const [repeatMusicList, setRepeatMusicList] = useState(true);
    const {autoPlay, setAutoPlay} = useAudioContext();

    let audioRef = useRef(null);

    const loadMetadata = (e) => {
        const {duration, volume} = e.target;
        const durationFloor = Math.floor(duration);
        setDuration(durationFloor);
        setVolume(volume);
    };
    
    const currentTimeAudio = (currentTime) => {
        let currentTimeFloor = Math.floor(currentTime);
        setCurrentTime(currentTimeFloor);
        currentText(currentTimeFloor);
    };

    const currentText = (currentTime) => {
        console.log('time:', currentTime);
        if(+currentTextOfMusic[0].timeStart >= 4){
            if(+currentTextOfMusic[0].timeStart - currentTime <= 3 && +currentTextOfMusic[0].timeStart - currentTime > 0){
                setTitleOrigin(<span style={{opacity: '0.1', fontSize: '2em'}}>{+currentTextOfMusic[0].timeStart - currentTime}</span>)
                setTitleTranslate('');
                return;
            }
        }
        // eslint-disable-next-line
        let element_text = currentTextOfMusic.forEach(item => {
            if(currentTime === +item.timeStart){
                setTitleOrigin(item.titleOrigin);
                setTitleTranslate(item.titleTranslate);
            }
        });
    };

    const endAudio = () => {
        setViewTitle(false);
        setTitleOrigin('');
        setTitleTranslate('');
        setPlayed(false);
        clickNextMusic();
    };

    const viewTitlePlay = () => {
        setViewTitle(true);
    };

    const viewTitlePause = () => {
        setViewTitle(false);
    };

    const startPlay = (e) => {
        if(currentTextOfMusic.length !== 0 && played === true){
            setTextOfMusic(currentTextOfMusic);
            setTitleOrigin(<span style={{opacity: '0.1'}}>{currentTextOfMusic !== null ? currentTextOfMusic[0].titleOrigin : null}</span>);
            setTitleTranslate(<span style={{opacity: '0.1'}}>{currentTextOfMusic !== null ? currentTextOfMusic[0].titleTranslate : null}</span>);
            e.target.play();
        }
    };

    const clickBackMusic = async () => {
        if(currentPlayMusicList === null || currentUidMusicList === null){
            return;
        }

        const currentIndex = currentPlayMusicList.findIndex(item => currentUidMusicList === item.id);
        setCurrentIndexMusicListAudio(currentIndex);
        if(currentIndex === 0){
            return;
        }

        const currentIdPrevAudio = currentPlayMusicList[currentIndex - 1].id;
        const currentTextOfMusicPrevAudio = currentPlayMusicList[currentIndex - 1].textOfMusic;
        await setCurrentUidMusicList(currentIdPrevAudio);

        await setPlayed(true);
        await setCurrentTime(0);
        const pathReference = await ref(storage, `audio/${currentIdPrevAudio}`);
        await setCurrentTextOfMusic(currentTextOfMusicPrevAudio);
        await setCurrentIdAudio(currentIdPrevAudio);
        await getDownloadURL(pathReference)
        .then((url) => {
            setCurrentAudio(url);
        })
        .catch(() => {
        
        })
    
    };

    const clickNextMusic = async () => {
        if(currentPlayMusicList === null || currentUidMusicList === null){
            return;
        }

        const currentIndex = currentPlayMusicList.findIndex(item => currentUidMusicList === item.id);
        setCurrentIndexMusicListAudio(currentIndex);
        if(currentIndex === currentPlayMusicList.length - 1 && repeatMusicList === false){
            return;
        }

        if(currentIndex === currentPlayMusicList.length - 1 && repeatMusicList === true){
            const currentIdPrevAudio = currentPlayMusicList[0].id;
            const currentTextOfMusicPrevAudio = currentPlayMusicList[0].textOfMusic;
            await setCurrentUidMusicList(currentIdPrevAudio);
    
            await setPlayed(true);
            await setCurrentTime(0);
            const pathReference = await ref(storage, `audio/${currentIdPrevAudio}`);
            await setCurrentTextOfMusic(currentTextOfMusicPrevAudio);
            await setCurrentIdAudio(currentIdPrevAudio);
            await getDownloadURL(pathReference)
            .then((url) => {
                setCurrentAudio(url);
            })
            .catch(() => {
            
            })
            return;
        }

        const currentIdPrevAudio = currentPlayMusicList[currentIndex + 1].id;
        const currentTextOfMusicPrevAudio = currentPlayMusicList[currentIndex + 1].textOfMusic;
        await setCurrentUidMusicList(currentIdPrevAudio);

        await setPlayed(true);
        await setCurrentTime(0);
        const pathReference = await ref(storage, `audio/${currentIdPrevAudio}`);
        await setCurrentTextOfMusic(currentTextOfMusicPrevAudio);
        await setCurrentIdAudio(currentIdPrevAudio);
        await getDownloadURL(pathReference)
        .then((url) => {
            setCurrentAudio(url);
        })
        .catch(() => {
        
        })
    };

    return (
        <div className='user_main_audio'>
            <Player 
            currentIdAudio={currentIdAudio} 
            duration={duration} 
            currentTime={currentTime}
            audioRef={audioRef !== null && audioRef.current !== null ? audioRef.current.audioEl.current : null}
            volume={volume}
            setVolume={setVolume}
            mute={mute}
            setMute={setMute}
            uniqueid={currentIdAudio}
            favoriteClass={favoriteClass}
            setFavoriteClass={setFavoriteClass}
            clickBackMusic={clickBackMusic}
            clickNextMusic={clickNextMusic}
            currentIndexMusicListAudio={currentIndexMusicListAudio}
            setRepeatMusicList={setRepeatMusicList}
            repeatMusicList={repeatMusicList}
            banClass={banClass}
            setBanClass={setBanClass}
            setAutoPlay={setAutoPlay}
            autoPlay={autoPlay}/>
            <div className="audio_player">
                <ReactAudioPlayer 
                src={currentAudio !== null ? currentAudio : ''} 
                controls
                autoPlay={autoPlay} 
                onLoadedMetadata={loadMetadata} 
                listenInterval={1000} 
                onListen={currentTimeAudio}
                onEnded={endAudio}
                onPause={viewTitlePause}
                onPlay={viewTitlePlay}
                onCanPlayThrough={startPlay}
                onCanPlay={startPlay}
                onAbort={startPlay}
                ref={audioRef}
                style={{display: 'none'}}
                volume={volume}/>
            </div>
        </div>
    );
};

export default MainAudio;