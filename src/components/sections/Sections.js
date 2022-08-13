import { useSearchContext } from '../../context/SearchContext';
import {useTabsContext} from '../../context/TabsContext';
import AlbumsSection from '../albumsSection/AlbumsSection';
import CollectionsSection from '../collectionsSection/CollectionsSection';
import MainSectionUser from '../mainSectionUser/MainSectionUser';
import SearchSection from '../searchSection/SearchSection';
import SettingsSection from '../settingsSection/SettingsSection';
import UserFavoritesSection from '../userFavoritesSection/UserFavoritesSection';

import './Sections.scss';

function Sections(props) {
    const {activeSlide} = useTabsContext();

    let section_element = null;
    if(activeSlide === 1){
        section_element = <MainSectionUser/>
    } else if(activeSlide === 2) {
        section_element = <UserFavoritesSection/>
    } else if(activeSlide === 3){
        section_element = <CollectionsSection/>
    } else if(activeSlide === 4){
        section_element = <AlbumsSection/>
    } else if(activeSlide === 5){
        section_element = <SettingsSection/>
    } else if(activeSlide === 6){
        section_element = <SearchSection/>
    }

    return (
        <div className='user_sections'>
            {
                section_element
            }
        </div>
    );
}

export default Sections;