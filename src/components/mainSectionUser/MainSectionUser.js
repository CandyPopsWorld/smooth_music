import React from 'react';
import spriteVideo from '../../resources/video/animation.gif';
import { useAudioContext } from '../../context/AudioContext';

import './MainSectionUser.scss';
function MainSectionUser(props) {
    const {titleOrigin, titleTranslate, viewTitle} = useAudioContext();
    return (
        <div className='user_main'>
            {
                viewTitle === false ?
                <div className="user_main_animation">
                    <h1 className='user_volna'>Моя Волна</h1>
                </div>

                :

                <div className="user_main_text">
                    <h2 className='title_origin'>{titleOrigin}</h2>
                    <h2 className='title_translate'>{titleTranslate}</h2>
                </div>
            }
        </div>
    );
}

export default MainSectionUser;