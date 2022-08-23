import SingleAlbumPage from '../pages/singleAlbumPage/SingleAlbumPage';
import SingleAuthorPage from '../pages/singleAuthorPage/SingleAuthorPage';
import SinglePlaylistPage from '../pages/singlePlaylistPage/SinglePlaylistPage';
import { useTabsContext } from '../../context/TabsContext';
import { useSearchContext } from '../../context/SearchContext';
import './SearchSection.scss';
function SearchSection(props) {
    
    const {searchInfoAboutItem} = useSearchContext();
    const {searchTab} = useTabsContext();
    let search_section = null;
    switch(searchTab){
        case 1:
            search_section = <SingleAlbumPage {...searchInfoAboutItem}/>
            break;
        case 2:
            search_section = <SingleAuthorPage {...searchInfoAboutItem}/>
            break;
        case 3:
            search_section = <SinglePlaylistPage {...searchInfoAboutItem}/>
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