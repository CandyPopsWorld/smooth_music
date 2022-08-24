import loaderSprite from '../../resources/image/mainLoader.gif';
import './MainLoader.scss';
function MainLoader({size = null}) {
    return (
        <div className="main_loader">
            <img src={loaderSprite} alt="Загрузка" style={{margin: 'auto', width: size, height: size}}/>
        </div>
    );
}
export default MainLoader;