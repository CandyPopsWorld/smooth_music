import './CollectionSection.scss';
function CollectionsSection(props) {
    return (
        <div className='user_collection'>
            <h2>Коллекция</h2>
            <h3>Вся музыка</h3>
            <div className="user_collection_list_all_music">
                <div className="user_collection_list_all_music_item">
                    <div className="user_collection_list_all_music_item_base">
                        <div className="user_collection_list_all_music_item_num item_list_all_collection">
                            1
                        </div>
                        <div className="user_collection_list_all_music_item_name item_list_all_collection">
                            Come As You Are(Live)
                        </div>
                        <div className="user_collection_list_all_music_item_album item_list_all_collection">
                            Nevermind
                        </div>
                        <div className="user_collection_list_all_music_item_author item_list_all_collection">
                            Nirvana
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CollectionsSection;