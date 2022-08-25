import loaderSprite from '../../resources/image/loader.gif';
function Loader({style = {margin: 'auto auto'}}) {
    return (
        <img src={loaderSprite} alt="Загрузка" style={style}/>
    );
}
export default Loader;