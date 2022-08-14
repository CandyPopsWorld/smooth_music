import { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';

import {doc, getDoc} from 'firebase/firestore';

import spriteAudio from '../../resources/audio/come.mp3';
import play from '../../resources/image/controls/play.png';
import pause from '../../resources/image/controls/pause.png';
import arrow from '../../resources/image/controls/arrow.png';

import './MainAudio.scss';

import { useAudioContext } from '../../context/AudioContext';
import { useDatabaseContext } from '../../context/DatabaseContext';
import { useSearchContext } from '../../context/SearchContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { useRef } from 'react';

function MainAudio(props) {
    const {currentAudio, currentIdAudio} = useDatabaseContext();
    const [duration, setDuration] = useState(null);

    const {
        setCurrentTime,
        setTitleOrigin,
        setTitleTranslate, 
        setViewTitle,
        setTextOfMusic, 
        textOfMusic,
        currentTime 
    } = useAudioContext();

    const {currentTextOfMusic} = useDatabaseContext();

    let audioRef = useRef(null);

    const loadMetadata = (e) => {
        const {duration, currentTime} = e.target;
        const durationFloor = Math.floor(duration);
        setDuration(durationFloor);
        // console.log(currentTime);
        // console.log(durationFloor);
    };
    
    const currentTimeAudio = (currentTime) => {
        let currentTimeFloor = Math.floor(currentTime);
        setCurrentTime(currentTimeFloor);
        currentText(currentTimeFloor);
        // currentTextAudio(currentTimeFloor);
    };

    const currentText = (currentTime) => {
        console.log('time:', currentTime);
        if(+currentTextOfMusic[0].timeStart >= 4){
            if(+currentTextOfMusic[0].timeStart - currentTime <= 3 && +currentTextOfMusic[0].timeStart - currentTime > 0){
                // setTitleOrigin(+currentTextOfMusic[0].timeStart - currentTime);
                setTitleOrigin(<span style={{opacity: '0.1', fontSize: '2em'}}>{+currentTextOfMusic[0].timeStart - currentTime}</span>)
                setTitleTranslate('');
                return;
            }
        }
        let element_text = currentTextOfMusic.forEach(item => {
            if(currentTime === +item.timeStart){
                console.log("Совпадение");
                setTitleOrigin(item.titleOrigin);
                setTitleTranslate(item.titleTranslate);
                console.log('title:', item.titleOrigin);
            }
        });
    };

    const endAudio = () => {
        setViewTitle(false);
        setTitleOrigin('');
        setTitleTranslate('');
    };

    const viewTitlePlay = () => {
        setViewTitle(true);
    };

    const viewTitlePause = () => {
        setViewTitle(false);
    };

    const startPlay = (e) => {
        if(currentTextOfMusic.length !== 0){
            setTextOfMusic(currentTextOfMusic);
            setTitleOrigin(<span style={{opacity: '0.1'}}>{currentTextOfMusic !== null ? currentTextOfMusic[0].titleOrigin : null}</span>);
            setTitleTranslate(<span style={{opacity: '0.1'}}>{currentTextOfMusic !== null ? currentTextOfMusic[0].titleTranslate : null}</span>);
            e.target.play();
            console.log("Можно играть!");
        }
    };

    if(audioRef !== null && audioRef.current !== null){
        console.log(audioRef.current.audioEl.current);
    }

    return (
        <div className='user_main_audio'>
            <View 
            currentIdAudio={currentIdAudio} 
            duration={duration} 
            currentTime={currentTime}
            audioRef={audioRef !== null && audioRef.current !== null ? audioRef.current.audioEl.current : null}/>
            <div className="audio_player">
                <ReactAudioPlayer 
                src={currentAudio} 
                controls 
                onLoadedMetadata={loadMetadata} 
                listenInterval={1000} 
                onListen={currentTimeAudio}
                onEnded={endAudio}
                onPause={viewTitlePause}
                onPlay={viewTitlePlay}
                onCanPlayThrough={startPlay}
                ref={audioRef}
                style={{display: 'none'}}/>
            </div>
        </div>
    );
};


const View = ({currentIdAudio, duration, currentTime, audioRef}) => {
    
    const {auth, db} = useFirebaseContext();
    const [audioData, setAudioData] = useState(null);
    const {played, setPlayed} = useAudioContext();

    const getAudioData = async () => {
        const docRef = await doc(db, 'audio', currentIdAudio);
        const docSnap = await getDoc(docRef);
        await setAudioData(docSnap.data());
    };

    useEffect(() => {
        getAudioData();
    }, [currentIdAudio])

    if(audioRef !== null){
        console.log(audioRef.currentTime);
    }

    const transformCurrentTime = () => {
        let minutes = null;
        let seconds = null;
        
        minutes = Math.trunc(currentTime / 60);
        if(currentTime < 60){
            seconds = currentTime;
        } else {
            seconds = currentTime - (minutes * 60);
        }

        minutes = validateNum(minutes);
        seconds = validateNum(seconds);

        return `${minutes}:${seconds}`;
    };

    const transformDurationTime = () => {
        let minutes = null;
        let seconds = null;
        if(duration !== null){
            minutes = Math.trunc(duration / 60);
            seconds = duration - (minutes * 60);
            // seconds = (duration / 60) - Math.floor((duration / 60)).toFixed(1);
        }
        
        minutes = validateNum(minutes);
        seconds = validateNum(seconds);

        return `${minutes}:${seconds}`;
    };

    const validateNum = (num) => {
        if(num <= 9){
            return `0${num}`;
        } else {
            return num;
        }
    }

    return (
        <div className="controls">
            <div className="line">
                <span className='current_time_audio'>{duration !== null  ? transformCurrentTime() : null}</span>
                <input type={'range'} min={0} max={duration} className="controls_line" value={currentTime} onChange={(e) => {
                   if(audioRef !== null){
                       audioRef.currentTime = e.target.value;
                       setPlayed(true);
                   }
                }}/>
                <span className='duration_time_audio'>{duration !== null ? transformDurationTime() : null}</span>
            </div>
            <div className="controls_buttons">
                <div className="controls_buttons_item arrow_back">
                    <img src={arrow} alt="" />
                </div>
                <div className="controls_buttons_item play_video">
                    <img src={played === true ? pause : play} alt="" onClick={() => {
                        if(audioRef !== null){
                            if(played === true){
                                audioRef.pause();
                                setPlayed(false);
                            } else {
                                audioRef.play();
                                setPlayed(true);
                            }
                        }
                    }}/>
                </div>
                <div className="controls_buttons_item arrow_next">
                    <img src={arrow} alt="" />
                </div>

                <div className="controls_text">
                    <div className="controls_text_name_music">
                        {audioData !== null ? audioData.name : null}
                    </div>
                    <div className="controls_text_author_music">
                        {audioData !== null ? audioData.author : null}
                    </div>
                </div>

                <div className="controls_favorite">
                    ❤
                </div>
            </div>
        </div>
    )
}

export default MainAudio;