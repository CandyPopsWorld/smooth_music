import loaderSprite from '../../resources/image/mainLoader.gif';

import './MainLoader.scss';
function MainLoader(props) {
    return (
        <div className="main_loader">
            <img src={loaderSprite} alt="Загрузка" style={{margin: 'auto'}}/>
        </div>
    );
}

export default MainLoader;