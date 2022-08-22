import { useFavoritesContext } from '../../context/FavoritesContext';
const Playlist = ({image, getMusicFromPlaylist, title}) => {
    const {activePlaylist} = useFavoritesContext();
    
    let clazz = 'albums_section_item_albums_block_item_bg';
    let active = false;
    if(activePlaylist === 0){
        active = true;
    }

    return (
    <div className="albums_section_item_albums_block_item">
        <div className={clazz}>
            <img src={image} alt="" />
            <div className="albums_section_item_albums_block_item_bg_controls">
                <i className="fa-solid fa-circle-play play_album_control"></i>
            </div>
        </div>
        <div className="albums_section_item_albums_block_item_title" style={active ? {color: 'orangered'} : null}>
            {title}
        </div>
    </div>       
    )
};

export default Playlist;