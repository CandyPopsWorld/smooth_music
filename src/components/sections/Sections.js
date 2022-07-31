import {useTabsContext} from '../../context/TabsContext';
import CollectionsSection from '../collectionsSection/CollectionsSection';
import MainSectionUser from '../mainSectionUser/MainSectionUser';
import SettingsSection from '../settingsSection/SettingsSection';

import './Sections.scss';

function Sections(props) {
    const {activeSlide} = useTabsContext();

    let section_element = null;
    if(activeSlide === 1){
        section_element = <MainSectionUser/>
    } else if(activeSlide === 2){
        section_element = <CollectionsSection/>
    } else if(activeSlide === 3) {
        section_element = <SettingsSection/>
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