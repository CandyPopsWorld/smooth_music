import {useTabsContext} from '../../context/TabsContext';
import { useSettingContext } from '../../context/SettingContext';
import localization from '../../utils/data/localization/index';
import { keys } from '../../utils/data/localization/keys';
import './Navbar.scss';

function Navbar(props) {
    const {currentLocalization} = useSettingContext();

    const tabs = [
        {active: false,title: currentLocalization !== null ? localization[currentLocalization][keys.navbarMain] : '',id: 1},
        {active: false,title: currentLocalization !== null ? localization[currentLocalization][keys.navbarCollection] : '',id: 2},
        {active: false,title: currentLocalization !== null ? localization[currentLocalization][keys.navbarSettings] : '',id: 5},
    ];

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