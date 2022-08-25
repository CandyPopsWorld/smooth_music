import { useState } from "react";
import { useSearchContext } from "../../context/SearchContext";
import { useTabsContext } from "../../context/TabsContext";
import Skeleton from "../skeleton/Skeleton";

const Playlist = ({image, getMusicFromPlaylist, title, id, data}) => {
    const {setActiveSlide, setSearchTab} = useTabsContext();
    const {setSearchInfoAboutItem} = useSearchContext();
    const [loadImage, setLoadImage] = useState(false);

    const getSinglePlaylistPage = async () => {
        await setSearchInfoAboutItem(data);
        await setSearchTab(3);
        await setActiveSlide(6);
    };

    return (
    <div className="albums_section_item_albums_block_item" onClick={getSinglePlaylistPage}>
        <div className={'albums_section_item_albums_block_item_bg'} style={{position: 'relative'}}>
            <img src={image} alt="" onLoad={() => setLoadImage(true)} style={{width: '200px', height: '200px'}}/>
            {
                loadImage === false ? <Skeleton position={'absolute'} top={0}/> : null
            }
            <div className="albums_section_item_albums_block_item_bg_controls"></div>
        </div>
        <div className="albums_section_item_albums_block_item_title">
            {title}
        </div>
    </div>       
    )
};

export default Playlist;