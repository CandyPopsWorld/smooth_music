import { useState } from 'react';
import './Navbar.scss';

import {useTabsContext} from '../../context/TabsContext';

const tabs = [
    {active: false,title: 'Главная',id: 1},
    {active: false,title: 'Коллекция',id: 7},
    {active: false,title: 'Вся Музыка',id: 2},
    {active: false,title: 'Все Альбомы',id: 5},
    {active: false,title: 'Настройки',id: 3},
    {active: false,title:'Загрузить аудио',id: 4},
    {active: false,title: 'Создать Альбом',id: 6},
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