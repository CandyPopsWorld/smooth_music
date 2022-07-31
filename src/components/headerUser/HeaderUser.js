import React from 'react';
import Navbar from '../navbar/Navbar';

import './HeaderUser.scss';
function Header(props) {
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
                    <img src="https://cdn-icons.flaticon.com/png/512/3177/premium/3177440.png?token=exp=1659188291~hmac=29958df9fed263f651bef67423fce779" alt="user" />
                </div>
            </div>
        </div>
    );
}

export default Header;