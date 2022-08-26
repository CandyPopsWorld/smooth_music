import Playlist_Block from '../playlistBlock/PlaylistBlock';
import Author_Block from '../authorBlock/AuthorBlock';
import Album_Block from '../albumBlock/AlbumBlock';
import { useFavoritesContext } from '../../context/FavoritesContext';
import './UserFavoritesSection.scss';
import { useSettingContext } from '../../context/SettingContext';
import localization from '../../utils/data/localization/index';
import { keys } from '../../utils/data/localization/keys';

function UserFavoritesSection(props) {
    const {currentLocalization} = useSettingContext();

    const nav_data = [
        {active: false, title: currentLocalization !== null ? localization[currentLocalization][keys.searchHeaderAlbum] : '', id: 1},
        {active: false, title: currentLocalization !== null ? localization[currentLocalization][keys.searchHeaderAuthor] : '', id: 2},
        {active: false, title: currentLocalization !== null ? localization[currentLocalization][keys.searchHeaderPlaylist] : '', id: 3},
    ];


    const {activeTab, setActiveTab} = useFavoritesContext();

    const getActiveTab = () => {
        switch(activeTab){
            case 1:
                // eslint-disable-next-line
                return <Album_Block/>;
            case 2:
                // eslint-disable-next-line
                return <Author_Block/>;
            case 3:
                // eslint-disable-next-line
                return <Playlist_Block/>;
            default: throw new Error();
        }
    };

    const element_tab = getActiveTab();

    const elements_nav = nav_data.map(({id, title, active}) => {
        const clazz = id === activeTab ? 'active' : '';

        const clickTab = () => {
            setActiveTab(id);
        };

        return (
            <div onClick={clickTab} className={`favorite_section_nav_block_item ${clazz}`} key={id}>
                {title}
            </div>
        )
    });
    return (
        <div className='favorite_section'>
            <div className="favorite_section_nav_block">
                {elements_nav}
            </div>
            <div className="favorite_section_tabs_block">
                {element_tab}
            </div>
        </div>
    );
};

export default UserFavoritesSection;