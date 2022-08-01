import React from 'react';
import Navbar from '../navbar/Navbar';
import {useFirebaseContext} from '../../context/FirebaseContext';

import './HeaderUser.scss';
function Header(props) {
    const {auth} = useFirebaseContext();
    const avatar = 'https://cdn-icons.flaticon.com/png/512/3177/premium/3177440.png?token=exp=1659188291~hmac=29958df9fed263f651bef67423fce779';
    return (
        <div className='user_header'>
            <div className="user_header_item">
                <div className="user_header_item_logo">
                    ПЛАВНАЯ МУЗЫКА
                </div>
            </div>

            <Navbar/>

            <div className="user_header_item">
                <div className="user_header_item_user">
                    <img className='user_avatar_header' src={auth.currentUser.photoURL !== null ? auth.currentUser.photoURL : avatar} alt="user" />
                </div>
            </div>
        </div>
    );
}

export default Header;