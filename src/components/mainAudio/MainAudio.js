import { useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';


import spriteAudio from '../../resources/audio/come.mp3';
import play from '../../resources/image/controls/play.png';
import arrow from '../../resources/image/controls/arrow.png';

import './MainAudio.scss';

import { useAudioContext } from '../../context/AudioContext';

function MainAudio(props) {

    const {
        currentTime,
        setCurrentTime,
        titleOrigin,
        setTitleOrigin,
        titleTranslate,
        setTitleTranslate, 
        viewTitle, 
        setViewTitle, 
        textOfMusic, 
        setTextOfMusic
    } = useAudioContext();

    const loadMetadata = (e) => {
        const {duration, currentTime} = e.target;
        const durationFloor = Math.floor(duration);
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
        let element_text = textOfMusic.forEach(item => {
            if(currentTime === item.timeStart){
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
    }

    return (
        <div className='user_main_audio'>
            <div className="audio_player">
                <ReactAudioPlayer 
                src={spriteAudio} 
                controls 
                onLoadedMetadata={loadMetadata} 
                listenInterval={1000} 
                onListen={currentTimeAudio}
                onEnded={endAudio}
                onPause={viewTitlePause}
                onPlay={viewTitlePlay}/>
            </div>
        </div>
    );
};


const View = () => {
    return (
        <div className="controls">
            <div className="line">
            <input type={'range'} min={0} max={100} className="controls_line"/>
            </div>
            <div className="controls_buttons">
                <div className="controls_buttons_item arrow_back">
                    <img src={arrow} alt="" />
                </div>
                <div className="controls_buttons_item play_video">
                    <img src={play} alt="" />
                </div>
                <div className="controls_buttons_item arrow_next">
                    <img src={arrow} alt="" />
                </div>

                <div className="controls_text">
                    <div className="controls_text_name_music">
                        Come As You Are
                    </div>
                    <div className="controls_text_author_music">
                        Nirvana
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