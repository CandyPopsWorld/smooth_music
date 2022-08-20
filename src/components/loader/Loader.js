import loaderSprite from '../../resources/image/loader.gif';

function Loader(props) {
    return (
        <img src={loaderSprite} alt="Загрузка" style={{margin: 'auto auto'}}/>
    );
}

export default Loader;