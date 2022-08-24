import logoSprite from '../../../resources/image/logo.png';
import { ERROR_PAGE_HELMET } from '../../../utils/data/seoHelmet';
import { refreshPage } from '../../../utils/functions/helper';
import Helmet from '../../helmet/Helmet';
import './ErrorPage.scss';
function ErrorPage(props) {
    return (
        <div className='error_page'>
            <Helmet title={ERROR_PAGE_HELMET.title} description={ERROR_PAGE_HELMET.description}/>
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