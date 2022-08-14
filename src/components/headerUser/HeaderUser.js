import React from 'react';
import Navbar from '../navbar/Navbar';
import {useFirebaseContext} from '../../context/FirebaseContext';
import avatarSprite from '../../resources/image/avatar.png';

import './HeaderUser.scss';
import Search from '../search/Search';
import { useSearchContext } from '../../context/SearchContext';
import { useTabsContext } from '../../context/TabsContext';
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
                    ПЛАВНАЯ МУЗЫКА
                </div>
            </div>

            <Navbar/>
            <Search/>

            <div className="user_header_item">
                <div className="user_header_item_user">
                    <img className='user_avatar_header' src={auth.currentUser.photoURL !== null ? auth.currentUser.photoURL : avatarSprite} alt="user" />
                </div>
            </div>
        </div>
    );
}

export default Header;