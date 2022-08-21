import { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';

import {doc, getDoc, updateDoc, arrayUnion, arrayRemove} from 'firebase/firestore';

import play from '../../resources/image/controls/play.png';
import pause from '../../resources/image/controls/pause.png';
import arrow from '../../resources/image/controls/arrow.png';

import './MainAudio.scss';

import {ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { useAudioContext } from '../../context/AudioContext';
import { useDatabaseContext } from '../../context/DatabaseContext';
import { useSearchContext } from '../../context/SearchContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { useRef } from 'react';
import { useTabsContext } from '../../context/TabsContext';
import Hint from '../hint/Hint';
import {repeatHint, translateTextHint, originalTextHint, banTextHint} from '../../utils/data/hintData';
import { localSettings } from '../../utils/data/localStorage';

import { Slider } from '@mui/material';

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
        textOfMusic,
        currentTime 
    } = useAudioContext();

    const {currentTextOfMusic} = useDatabaseContext();

    const {played, setPlayed} = useAudioContext();
    const {setCurrentPlayMusicList, currentPlayMusicList, setCurrentUidMusicList, currentUidMusicList} = useDatabaseContext();
    const [currentIndexMusicListAudio, setCurrentIndexMusicListAudio] = useState(null);
    const {setCurrentAudio, setCurrentTextOfMusic,setCurrentIdAudio} = useDatabaseContext();

    const [repeatMusicList, setRepeatMusicList] = useState(true);
    const {autoPlay, setAutoPlay} = useAudioContext();

    let audioRef = useRef(null);

    const loadMetadata = (e) => {
        const {duration, currentTime, volume} = e.target;
        const durationFloor = Math.floor(duration);
        setDuration(durationFloor);
        setVolume(volume);
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
            console.log("Можно играть!");
        }
    };

    if(audioRef !== null && audioRef.current !== null){
        // console.log(audioRef.current.audioEl.current);
    }

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
            <View 
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


const View = ({currentIdAudio, duration, currentTime, audioRef, volume, setVolume, mute, setMute, uniqueid, favoriteClass, setFavoriteClass, clickBackMusic, clickNextMusic, currentIndexMusicListAudio, setRepeatMusicList, repeatMusicList, banClass, setBanClass, setAutoPlay, autoPlay}) => {
    
    const {auth, db, storage} = useFirebaseContext();
    const [audioData, setAudioData] = useState(null);
    const {played, setPlayed} = useAudioContext();

    const {setOriginalTextMute, setTranslateTextMute, originalTextMute, translateTextMute, setCurrentTime} = useAudioContext();
    const {setCurrentAudio, setCurrentTextOfMusic,setCurrentIdAudio} = useDatabaseContext();

    const [album, setAlbum] = useState(null);
    const [author, setAuthor] = useState(null);

    const {setSearchInfoAboutItem, setShowModal} = useSearchContext();
    const {setCurrentPlayMusicList, currentPlayMusicList, setCurrentUidMusicList} = useDatabaseContext();
    const {setActiveSlide, setSearchTab} = useTabsContext();


    const [currentTimeInput, setCurrentTimeInput] = useState(currentTime);
    const [volumeInput, setVolumeInput] = useState(volume);

    const [elementHint, setElementHint] = useState(null);

    const getAudioData = async () => {
        if(currentIdAudio === null){
            return;
        }
        const docRef = await doc(db, 'audio', currentIdAudio);
        const docSnap = await getDoc(docRef);
        await setAudioData(docSnap.data());
    };

    const getMusicLocalStorage = async (id) => {
        setCurrentUidMusicList(id);
        console.log(id);
        setPlayed(false);
        setCurrentTime(0);
        const pathReference = ref(storage, `audio/${id}`);

        const docRef = await doc(db, 'audio', id);
        const docSnap = await getDoc(docRef);

        setCurrentTextOfMusic(docSnap.data().textOfMusic);
        setCurrentIdAudio(id);
        getDownloadURL(pathReference)
        .then((url) => {
            setCurrentAudio(url);
        })
        .catch(() => {
    
        })
    };

    useEffect(() => {
        setCurrentTimeInput(currentTime);
        setVolumeInput(volume);
        getFavoriteMusic().then((res) => {
            res.forEach(({audioId}) => {
                if(audioId === uniqueid){
                    setFavoriteClass(true);
                }
            })
        })

        if(localStorage.getItem(auth.currentUser.uid)){
            const id = JSON.parse(localStorage.getItem(auth.currentUser.uid)).currentAudio;
            const list = JSON.parse(localStorage.getItem(auth.currentUser.uid)).currentPlayMusicList;
            const volume = JSON.parse(localStorage.getItem(auth.currentUser.uid)).volume;
            const translateText = JSON.parse(localStorage.getItem(auth.currentUser.uid)).translateText;
            const originalText = JSON.parse(localStorage.getItem(auth.currentUser.uid)).originalText;
            const repeatMusicList = JSON.parse(localStorage.getItem(auth.currentUser.uid)).repeatMusicList;
            
            if(list !== null){
                setCurrentPlayMusicList(list);
            }
            
            if(id !== null){
                setAutoPlay(false);
                getMusicLocalStorage(id);
            }

            if(volume !== null){
                setVolume(+volume);
                setVolumeInput(+volume);
            }

            if(translateText !== null){
                setTranslateTextMute(translateText);
            }

            if(originalText !== null){
                setOriginalTextMute(originalText);
            }

            if(repeatMusicList !== null){
                setRepeatMusicList(repeatMusicList);
            }
        }
        getAlbumAudio();
        getAuthorAudio();
    }, [])

    useEffect(() => {
        getAudioData();

        setFavoriteClass(false);
        getFavoriteMusic().then((res) => {
            res.forEach(({audioId}) => {
                if(audioId === uniqueid){
                    setFavoriteClass(true);
                }
            })
        })

        setBanClass(false);
        getBanAudio().then((res) => {
            res.forEach(({audioId}) => {
                if(audioId === uniqueid){
                    setBanClass(true);
                }
            })
        })

        setAlbum(null);
        setAuthor(null);

        getAlbumAudio();
        getAuthorAudio();
        if(currentIdAudio !== null){
            let object = null;
            if(localStorage.getItem(auth.currentUser.uid)){
                object = JSON.parse(localStorage.getItem(auth.currentUser.uid));
                object.currentAudio = currentIdAudio;
                object.currentPlayMusicList = currentPlayMusicList;
            } else {
                localSettings.currentAudio = currentIdAudio;
                localSettings.currentPlayMusicList = currentPlayMusicList;
                object = localSettings;
            }
            const serializedLocalSettings = JSON.stringify(object);
            localStorage.setItem(auth.currentUser.uid, serializedLocalSettings);
        }

    }, [currentIdAudio])

    useEffect(() => {
        setVolumeInput(volume);
    }, [volume])

    useEffect(() => {
        setCurrentTimeInput(currentTime);
    }, [currentTimeInput])

    if(audioRef !== null){
        // console.log(audioRef.currentTime);
        // console.log(audioRef.volume);
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
    };

    //favorite
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

    const onBanAudio = () => {
        getBanAudio().then((res) => {
            let bool = false;
            res.forEach(({audioId}) => {
                if(uniqueid === audioId){
                    bool = true;
                }
            })

            if(bool === true){
                setBanClass(false);
                removeUserBanAudio();
            } else {
                setBanClass(true);
                addUserBanAudio();
            }
        });
    };

    const getBanAudio = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        return docSnap.data().banAudio;
    };

    const addUserBanAudio = async () => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            banAudio: arrayUnion({audioId: uniqueid})
        });
    };

    const removeUserBanAudio = async () => {
        const userDbRef = await doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDbRef, {
            banAudio: arrayRemove({audioId: uniqueid})
        });
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
        return docSnap.data().favoriteAudio;
    };

    const getAlbumAudio = async () => {
        if(currentIdAudio === null){
            return;
        }
        const docRef = await doc(db, 'audio', uniqueid);
        const docSnap = await getDoc(docRef);
        const albumId = await docSnap.data().albumId;

        const albumRef = await doc(db, 'albums', albumId);
        const albumSnap = await getDoc(albumRef);

        await getImageAlbumStorage(albumId).then((image) => {
            setAlbum({image, 
                uid: albumSnap.data().id, 
                title: albumSnap.data().title, 
                musics: albumSnap.data().musics, 
                year: albumSnap.data().year, authorId: albumSnap.data().authorId, 
                genreId: albumSnap.data().genreId})
            // setAlbum([{image, ...albumSnap.data()}]);
        });
        

    };

    const getSingleAlbumPage = async () => {
        setActiveSlide(1);
        setShowModal(false);
        if(album !== null){
            setSearchInfoAboutItem({...album});
        }
        await setSearchTab(1);
        await setActiveSlide(6);
    };

    const getImageAlbumStorage = async (id) => {
        const pathReference = ref(storage, `album/${id}`);
        let urlExport = '';
        await getDownloadURL(pathReference)
        .then((url) => {
            urlExport = url;
        })
        .catch((error) => {
            // console.log(error);
        })
        return urlExport;
    };

    //author

    const getAuthorAudio = async () => {
        if(currentIdAudio === null){
            return;
        }
        const docRef = await doc(db, 'audio', uniqueid);
        const docSnap = await getDoc(docRef);
        const authorId = await docSnap.data().authorId;

        const authorRef = await doc(db, 'authors', authorId);
        const authorSnap = await getDoc(authorRef);

        await getImageAuthorStorage(authorId).then((image) => {
            setAuthor({image, 
                uid: authorSnap.data().id, 
                title: authorSnap.data().title, 
                description: authorSnap.data().description, 
                albums: authorSnap.data().albums, 
                musics: authorSnap.data().musics})
        });
        

    };

    const getSingleAuthorPage = async () => {
        setActiveSlide(1);
        setShowModal(false);
        if(author !== null){
            setSearchInfoAboutItem({...author});
        }
        await setSearchTab(2);
        await setActiveSlide(6);
    };

    const getImageAuthorStorage = async (id) => {
        const pathReference = ref(storage, `author/${id}`);
        let urlExport = '';
        await getDownloadURL(pathReference)
        .then((url) => {
            urlExport = url;
        })
        .catch((error) => {
            // console.log(error);
        })
        return urlExport;
    };

    const transformVolumeLabelValue = (value) => {
        const volume = value * 100;
        return `${volume}%`;
    };

    return (
        <div className="controls">
            <div className="line">
                <span className='current_time_audio'>{duration !== null  ? transformCurrentTime() : null}</span>
                <Slider
                    color="warning"
                    disabled={false}
                    marks={false}
                    orientation="horizontal"
                    size="md"
                    min={0}
                    max={duration}
                    className="controls_line"
                    style={currentIdAudio !== null ? {pointerEvents: 'all'} : {pointerEvents: 'none'}}
                    value={currentTime !== null ? currentTime : 0}
                    valueLabelFormat={(value) => {
                        return transformCurrentTime();
                    }}
                    valueLabelDisplay="auto"
                    onChange={(e) => {
                        if(audioRef !== null){
                            audioRef.currentTime = e.target.value;
                            setPlayed(true);
                    }
                }}/>
                <span className='duration_time_audio'>{duration !== null ? transformDurationTime() : null}</span>
            </div>
            <div className="controls_buttons">
                <div className="controls_buttons_item arrow_back">
                    <img onClick={clickBackMusic} src={arrow} alt="" style={currentIdAudio !== null ? {pointerEvents: 'all'} : {pointerEvents: 'none'}}/>
                </div>
                <div className="controls_buttons_item play_video">
                    <img src={played === true ? pause : play} alt="" style={currentIdAudio !== null ? {pointerEvents: 'all'} : {pointerEvents: 'none'}} onClick={() => {
                        
                        if(audioRef !== null){
                            if(played === true){
                                audioRef.pause();
                                setPlayed(false);
                            } else {
                                if(autoPlay === false){
                                    setAutoPlay(true);
                                }
                                audioRef.play();
                                setPlayed(true);
                            }
                        }
                    }}/>
                </div>
                <div className="controls_buttons_item arrow_next">
                    <img onClick={clickNextMusic} src={arrow} alt="" style={currentIdAudio !== null ? {pointerEvents: 'all'} : {pointerEvents: 'none'}}/>
                </div>

                <div className="controls_album_image" style={currentIdAudio !== null && album !== null ? {pointerEvents: 'all'} : {pointerEvents: 'none'}} onClick={ () => {
                    if(album !== null){
                        getSingleAlbumPage();
                    }
                }}>
                    <img 
                    src={album !== null && album.image ? album.image : null} 
                    alt="" 
                    style={album !== null && album.image ? {width: '32px', height: '32px', pointerEvents: 'all'} : {width: '32px', height: '32px', pointerEvents: 'none'}}/>
                </div>

                <div className="controls_text">
                    <div className="controls_text_name_music" style={currentIdAudio !== null ? {pointerEvents: 'all'} : {pointerEvents: 'none'}}>
                        {audioData !== null ? audioData.name : null}
                    </div>
                    <div className="controls_text_author_music" style={currentIdAudio !== null && author !== null ? {pointerEvents: 'all'} : {pointerEvents: 'none'}} onClick={() => {
                        if(author !== null){
                            getSingleAuthorPage();
                        }
                    }}>
                        {audioData !== null ? audioData.author : null}
                    </div>
                </div>

                <div className="controls_favorite" style={currentIdAudio !== null ? {pointerEvents: 'all'} : {pointerEvents: 'none'}}>
                    <i onClick={onFavoriteMusic} className="fa-solid fa-heart" style={favoriteClass ? {color: 'orangered'} : null}></i>
                </div>

                <div className="controls_volume_block">
                    {
                        volume !== null && (volume > 0) ?
                        <i className="fa-solid fa-volume-high" style={currentIdAudio !== null ? {color: 'white', pointerEvents: 'all'} : {pointerEvents: 'none'}} onClick={() => {
                            setVolume(0);
                            setMute(true);
                        }}></i>
                        :
                        volume !== null && (volume === 0) ?
                        <i className="fa-solid fa-volume-xmark" style={currentIdAudio !== null ? {color: 'white', pointerEvents: 'all'} : {pointerEvents: 'none'}} onClick={() => {
                            setVolume(1);
                            setMute(false);
                        }}></i>
                        :
                        null
                    }
                    <Slider
                        className="volume_line"
                        color="warning"
                        disabled={false}
                        marks={false}
                        orientation="horizontal"
                        size="sm"
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => {
                            return transformVolumeLabelValue(value);
                        }}
                        min={0}
                        max={1}
                        step={0.1}
                        value={volume !== null ? volume : 0}
                        style={currentIdAudio !== null ? {pointerEvents: 'all'} : {pointerEvents: 'none'}}
                        onChange={(e) => {
                            if(audioRef !== null){
                                setVolume(e.target.value);
                                audioRef.volume = e.target.value;
    
                                let object = null;
                                if(localStorage.getItem(auth.currentUser.uid)){
                                    object = JSON.parse(localStorage.getItem(auth.currentUser.uid));
                                    object.volume = e.target.value;
                                    localStorage.setItem(auth.currentUser.uid, JSON.stringify(object));
                                }
                            }
                        }}
                    />
                </div>

                <div className="controls_original_text_block" style={currentIdAudio !== null ? {pointerEvents: 'all'} : {pointerEvents: 'none'}} onClick={ async () => {
                    await setOriginalTextMute(prev => !prev);
                    if(localStorage.getItem(auth.currentUser.uid)){
                        let object = JSON.parse(localStorage.getItem(auth.currentUser.uid));
                        object.originalText = !originalTextMute;
                        localStorage.setItem(auth.currentUser.uid, JSON.stringify(object));
                    }
                }} onMouseOver={() => {
                    setElementHint(<Hint message={originalTextHint} top={'-20px'} left={'50%'}/>);
                }} onMouseOut={() => {
                    setElementHint(null);
                }}>
                    <span style={originalTextMute === true ? {color: 'orangered'} : {color: 'white'}}>OR</span>
                </div>

                 <div className="controls_translate_text_block" style={currentIdAudio !== null ? {pointerEvents: 'all'} : {pointerEvents: 'none'}} onClick={() => {
                    if(localStorage.getItem(auth.currentUser.uid)){
                        let object = JSON.parse(localStorage.getItem(auth.currentUser.uid));
                        object.translateText = !translateTextMute;
                        localStorage.setItem(auth.currentUser.uid, JSON.stringify(object));
                    }
                    setTranslateTextMute(prev => !prev);
                 }} onMouseOver={() => {
                    setElementHint(<Hint message={translateTextHint} top={'-20px'} left={'50%'}/>);
                 }} onMouseOut={() => {
                    setElementHint(null);
                 }}>
                    <span style={translateTextMute === true ? {color: 'orangered'} : {color: 'white'}}>TR</span>
                </div>

                <div className="controls_repeat_text_block" style={currentIdAudio !== null ? {pointerEvents: 'all', position: 'relative'} : {pointerEvents: 'none', position: 'relative'}} onClick={() => {
                    if(localStorage.getItem(auth.currentUser.uid)){
                        let object = JSON.parse(localStorage.getItem(auth.currentUser.uid));
                        object.repeatMusicList = !repeatMusicList;
                        localStorage.setItem(auth.currentUser.uid, JSON.stringify(object));
                    }
                    setRepeatMusicList(prev => !prev);
                }} onMouseOver={() => {
                    setElementHint(<Hint message={repeatHint} top={'-20px'} left={'50%'}/>);
                }} onMouseOut={() => {
                    setElementHint(null);
                }}>
                    {elementHint}
                    <span style={repeatMusicList === true ? {color: 'orangered'} : {color: 'white'}}>RP</span>
                </div>

                <div className="controls_ban_text_block" style={currentIdAudio !== null ? {pointerEvents: 'all', position: 'relative'} : {pointerEvents: 'none', position: 'relative'}} onClick={() => {
                    
                }} onMouseOver={() => {
                    setElementHint(<Hint message={banTextHint} top={'-20px'} left={'50%'}/>);
                }} onMouseOut={() => {
                    setElementHint(null);
                }}>
                    <i onClick={onBanAudio} className="fa-solid fa-ban" style={banClass ? {color: 'red'} : null}></i>
                </div>
            </div>
        </div>
    )
}

export default MainAudio;