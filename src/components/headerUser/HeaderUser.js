import React from 'react';
import {useFirebaseContext} from '../../context/FirebaseContext';
import { useTabsContext } from '../../context/TabsContext';
import Navbar from '../navbar/Navbar';
import Search from '../search/Search';
import avatarSprite from '../../resources/image/avatar.png';
import './HeaderUser.scss';
function Header(props) {
    const {auth} = useFirebaseContext();
    const {activeSlide, setActiveSlide} = useTabsContext();
    return (
        <div className='user_header'>
            <div className="user_header_item">
                <div className="user_header_item_logo" onClick={() => {
                    if(activeSlide !== 1){
                        setActiveSlide(1);
                    }
                }}>
                    SMOOTH MUSIC
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