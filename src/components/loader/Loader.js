import loaderSprite from '../../resources/image/loader.gif';
function Loader({style = {margin: 'auto auto'}, src = loaderSprite}) {
    return (
        <img src={src} alt="Загрузка" style={style}/>
    );
}
export default Loader;