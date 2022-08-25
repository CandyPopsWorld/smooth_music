import { useEffect, useState } from 'react';
import {doc, getDoc, updateDoc, arrayUnion, arrayRemove} from 'firebase/firestore';
import {ref,getDownloadURL } from "firebase/storage";
import { useAudioContext } from '../../context/AudioContext';
import { useDatabaseContext } from '../../context/DatabaseContext';
import { useSearchContext } from '../../context/SearchContext';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { useTabsContext } from '../../context/TabsContext';
import { localSettings } from '../../utils/data/localStorage';
import { Slider } from '@mui/material';
import Hint from '../hint/Hint';
import {repeatHint, translateTextHint, originalTextHint, banTextHint, textFoundHint, textNotFoundHint,addPlaylistHint} from '../../utils/data/hintData';
import arrow from '../../resources/image/controls/arrow.png';
import pause from '../../resources/image/controls/pause.png';
import play from '../../resources/image/controls/play.png';
import AddPlaylistModal from '../addPlaylistModal/AddPlaylistModal';

const Player = ({currentIdAudio, duration, currentTime, audioRef, volume, setVolume, mute, setMute, uniqueid, favoriteClass, setFavoriteClass, clickBackMusic, clickNextMusic, currentIndexMusicListAudio, setRepeatMusicList, repeatMusicList, banClass, setBanClass, setAutoPlay, autoPlay}) => {
    
    const {auth, db, storage} = useFirebaseContext();
    const [audioData, setAudioData] = useState(null);
    const {played, setPlayed} = useAudioContext();

    const {setOriginalTextMute, setTranslateTextMute, originalTextMute, translateTextMute, setCurrentTime, setTitleTranslate, setTitleOrigin} = useAudioContext();
    const {setCurrentAudio, setCurrentTextOfMusic,setCurrentIdAudio, currentTextOfMusic} = useDatabaseContext();

    const [album, setAlbum] = useState(null);
    const [author, setAuthor] = useState(null);

    const {setSearchInfoAboutItem, setShowModal} = useSearchContext();
    const {setCurrentPlayMusicList, currentPlayMusicList, setCurrentUidMusicList} = useDatabaseContext();
    const {setActiveSlide, setSearchTab} = useTabsContext();


    const [currentTimeInput, setCurrentTimeInput] = useState(currentTime);
    // eslint-disable-next-line
    const [volumeInput, setVolumeInput] = useState(volume);

    const [elementHint, setElementHint] = useState(null);

    const {showModalPlaylist, setShowModalPlaylist} = useAudioContext(false);

    const getAudioData = async () => {
        if(currentIdAudio === null){
            return;
        }
        const docRef = await doc(db, 'audio', currentIdAudio);
        const docSnap = await getDoc(docRef);
        await setAudioData(docSnap.data());
    };

    const getMusicLocalStorage = async (id) => {
        await setCurrentUidMusicList(id);
        await setPlayed(false);
        await setCurrentTime(0);
        const pathReference = await ref(storage, `audio/${id}`);

        const docRef = await doc(db, 'audio', id);
        const docSnap = await getDoc(docRef);

        await setCurrentTextOfMusic(docSnap.data().textOfMusic);
        await setCurrentIdAudio(id);
        await getDownloadURL(pathReference)
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
            const translateText = JSON.parse(localStorage.getItem(auth.currentUser.uid)).titleTranslate;
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

            // if(currentTextOfMusic && currentTextOfMusic[0] && currentTextOfMusic[0].titleTranslate && currentTextOfMusic[0].titleOriginal){
            //     // setTranslateTextMute(translateText);
            //     console.log(currentTextOfMusic[0].titleTranslate);
            //     // setOriginalTextMute(originalText);
            //     setOriginalTextMute(currentTextOfMusic[0].titleOriginal);
            // }

            setTitleTranslate(<span style={{opacity: '0.1'}}>{translateText}</span>);
            setTitleOrigin(<span style={{opacity: '0.1'}}>{originalText}</span>);


            if(repeatMusicList !== null){
                setRepeatMusicList(repeatMusicList);
            }
        }
        getAlbumAudio();
        getAuthorAudio();
        // eslint-disable-next-line
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
                object.titleTranslate = currentTextOfMusic[0].titleTranslate;
                object.originalText = currentTextOfMusic[0].titleOrigin;
            } else {
                localSettings.currentAudio = currentIdAudio;
                localSettings.currentPlayMusicList = currentPlayMusicList;
                object = localSettings;
            }
            const serializedLocalSettings = JSON.stringify(object);
            localStorage.setItem(auth.currentUser.uid, serializedLocalSettings);
        }
    // eslint-disable-next-line
    }, [currentIdAudio])

    useEffect(() => {
        setVolumeInput(volume);
    }, [volume])

    useEffect(() => {
        setCurrentTimeInput(currentTime);
        // eslint-disable-next-line
    }, [currentTimeInput])

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

                <div className="controls_add_playlits" style={currentIdAudio !== null ? {pointerEvents: 'all'} : {pointerEvents: 'none'}} 
                onClick={() => setShowModalPlaylist(true)} 
                onMouseOver={() => {
                    setElementHint(<Hint message={addPlaylistHint} top={'-30px'} left={'-1100%'}/>);
                }} onMouseOut={() => {
                    setElementHint(null);
                }}>
                    <span>+</span>
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

                <div className="controls_text_found_block" style={currentIdAudio !== null ? {pointerEvents: 'all', position: 'relative'} : {pointerEvents: 'none', position: 'relative'}} 
                onMouseOver={() => {
                    if(currentTextOfMusic.length > 1){
                        setElementHint(<Hint message={textFoundHint} top={'-20px'} left={'50%'}/>);
                    } else {
                        setElementHint(<Hint message={textNotFoundHint} top={'-20px'} left={'350%'}/>);
                    }
                }} onMouseOut={() => {
                    setElementHint(null);
                }}>
                    <span style={currentTextOfMusic.length > 1 ? {color: 'green'} : {color: 'red'}}>TXT</span>
                </div>
            </div>

            {
                showModalPlaylist ? <AddPlaylistModal/> : null
            }

        </div>
    )
};

export default Player;