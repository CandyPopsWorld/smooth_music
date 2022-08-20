import logoSprite from '../../../resources/image/logo.png';
import './MobilePage.scss';
function MobilePage(props) {
    return (
        <div className='mobile_page'>
            <div className="login_header">
                <div className="login_header_logo">
                    <img src={logoSprite} alt="logo" />
                    <h1>Smooth Music</h1>
                </div>
                <div className="login_header_hr"></div>
            </div>
            <div className="mobile_page_block">
                <div className="mobile_page_block_info">
                    <p>Установите приложение на свое мобильное устройство, и наслаждайтесь музыкой!</p>
                </div>
                <div className="mobile_page_block_btns_download">
                    <button className='android_app'>Установить на Android</button>
                    <button className='ios_app'>Установить на IOS</button>
                </div>
            </div>
        </div>
    );
}

export default MobilePage;