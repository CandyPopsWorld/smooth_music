import { useEffect, useState } from 'react';
import './Navbar.scss';
import { doc, getDoc } from "firebase/firestore";
import {useTabsContext} from '../../context/TabsContext';
import { useFirebaseContext } from '../../context/FirebaseContext';

const tabs = [
    {active: false,title: 'Главная',id: 1},
    {active: false,title: 'Коллекция',id: 2},
    {active: false,title: 'Настройки',id: 5},
]

function Navbar(props) {
    const {activeSlide, setActiveSlide} = useTabsContext();
    const {auth, db} = useFirebaseContext();

    const elements_btns = tabs.map(item => {
        const clazz = activeSlide === item.id ? 'active' : '';

        const clickBtn = (id) => {
            setActiveSlide(id);
        }

        return(
        <div className="user_header_item_list_link" key={item.id}>
            <button className={clazz} onClick={() => clickBtn(item.id)}>{item.title}</button>
        </div>
        )
    });
    
    return (
        <div className="user_header_item user_header_tabs">
            <div className="user_header_item_list">
                {elements_btns}
            </div>
        </div>
    );
}

export default Navbar;