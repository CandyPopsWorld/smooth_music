import {useTabsContext} from '../../context/TabsContext';
import './Navbar.scss';
const tabs = [
    {active: false,title: 'Главная',id: 1},
    {active: false,title: 'Коллекция',id: 2},
    {active: false,title: 'Настройки',id: 5},
];
function Navbar(props) {
    const {activeSlide, setActiveSlide} = useTabsContext();
    const elements_btns = tabs.map(item => {
        const clazz = activeSlide === item.id ? 'active' : '';
        const clickBtn = (id) => {
            setActiveSlide(id);
        }
        return(
            <div className="user_header_item_list_link" key={item.id} style={{position: 'relative'}}>
                {/* <Badge color="error" overlap="circular" badgeContent=" " variant="dot" style={{position: 'absolute', top: '0', right: '0'}}/> */}
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