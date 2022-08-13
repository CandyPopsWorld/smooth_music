import './SearchSection.scss';
import SingleAlbumPage from '../pages/singleAlbumPage/SingleAlbumPage';
import { useTabsContext } from '../../context/TabsContext';
import { useSearchContext } from '../../context/SearchContext';

function SearchSection(props) {
    const {searchInfoAboutItem} = useSearchContext();
    console.log(searchInfoAboutItem);
    const {searchTab} = useTabsContext();
    let search_section = null;
    switch(searchTab){
        case 1:
            search_section = <SingleAlbumPage {...searchInfoAboutItem}/>
            break;
        default:
            break;
    }

    return (
        <div className="search_section">
            {search_section}
        </div>
    );
}

export default SearchSection;