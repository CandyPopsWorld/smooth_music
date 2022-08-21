import logoSprite from '../../../resources/image/logo.png';
import './ErrorPage.scss';
function ErrorPage(props) {

    const refreshPage = () => {
        window.location.reload();
    };

    return (
        <div className='error_page'>
            <div className="error_page_wrapper">
                <div className="error_page_wrapper_logo">
                    <img src={logoSprite} alt="logo" />
                </div>
                <div className="error_page_wrapper_text">
                    <h1>Что-то пошло не так!</h1>
                    <p>Попробуйте перезагрузить страницу.</p>
                </div>
                <div className="error_page_wrapper_refresh">
                    <button id='refresh' onClick={refreshPage}>Перезагрузить страницу</button>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage;