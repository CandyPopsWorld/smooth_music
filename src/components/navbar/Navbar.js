import { useState } from 'react';
import './Navbar.scss';

import {useTabsContext} from '../../context/TabsContext';

const tabs = [
    {active: false,title: 'Главное',id: 1},
    {active: false,title: 'Коллекция',id: 2},
    {active: false,title: 'Настройки',id: 3},
    {active: false,title:'Загрузка',id: 4}
]

function Navbar(props) {
    const {activeSlide, setActiveSlide} = useTabsContext();

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