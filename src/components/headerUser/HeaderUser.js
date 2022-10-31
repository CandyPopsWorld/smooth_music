import React from 'react';
import {useFirebaseContext} from '../../context/FirebaseContext';
import { useTabsContext } from '../../context/TabsContext';
import Navbar from '../navbar/Navbar';
import Search from '../search/Search';
import avatarSprite from '../../resources/image/avatar.png';
import './HeaderUser.scss';
import { useSettingContext } from '../../context/SettingContext';
import localization from '../../utils/data/localization/index';
import { keys } from '../../utils/data/localization/keys';
import { useAudioContext } from '../../context/AudioContext';
import { headerLogoClass } from '../../utils/data/classNames';
function Header(props) {
    const {auth} = useFirebaseContext();
    const {activeSlide, setActiveSlide} = useTabsContext();
    const {currentLocalization} = useSettingContext();
    const {played, volume} = useAudioContext();
    const logo = localization && currentLocalization && keys.logo ? localization[currentLocalization][keys.logo] : '';

    return (
        <div className='user_header'>
            <div className="user_header_item">
                <div className={headerLogoClass(played)} onClick={() => {
                    if(activeSlide !== 1){
                        setActiveSlide(1);
                    }
                }}>
                    {currentLocalization !== null ? [...logo].map((item, i) => {
                        return <span key={i + 1} className='user_header_item_logo_span' style={{'--i': i + 1, '--s': volume}}>{item}</span>
                    }) : ''}
                </div>
            </div>
            <Navbar/>
            <Search/>
            <div className="user_header_item">
                <div className="user_header_item_user">
                    <img onClick={() => {
                        if(activeSlide !== 5){
                            setActiveSlide(5);
                        }
                    }} className='user_avatar_header' src={auth.currentUser.photoURL !== null ? auth.currentUser.photoURL : avatarSprite} alt="user" />
                </div>
            </div>
        </div>
    );
}

export default Header;