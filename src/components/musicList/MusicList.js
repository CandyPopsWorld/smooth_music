import { AudioItem } from '../collectionsSection/CollectionsSection';
import { useSettingContext } from '../../context/SettingContext';
import localization from '../../utils/data/localization/index';
import { keys } from '../../utils/data/localization/keys';
import './MusicList.scss';
const MusicList = ({albumMusics, title = null}) => {
    const {currentLocalization} = useSettingContext();
    let albumName = '';
    let elements_audio_items = null;
    if(albumMusics !== null && albumMusics.length > 0){
        elements_audio_items = albumMusics.map(({album, author, name, id, textOfMusic, duration}, i) => {
            albumName = album;
            return (
                <AudioItem 
                idkey={id}
                uniqueid={id} 
                key={id} 
                album={album} 
                author={author} 
                name={name} 
                i={i}
                textOfMusic={textOfMusic}
                duration={duration}
                albumMusics={albumMusics}/>
            )
        });
    }
    return (
        <div className='music_list_albums'>
            {
                albumMusics !== null && albumMusics.length > 0 && albumName.length > 0 ?
                <h2>{title === null ? `${currentLocalization !== null ? localization[currentLocalization][keys.collectionAlbumsBlockMusicListText] : ''} ${albumName}` : title}</h2>
                :
                null
            }
            <div className="music_list_albums_wrapper">
                {
                    albumMusics !== null && albumMusics.length > 0 && albumName.length > 0 ?
                    elements_audio_items
                    :
                    null
                }
            </div>
        </div>
    )
}

export default MusicList;