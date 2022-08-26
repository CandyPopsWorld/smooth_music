import logoSprite from '../../../resources/image/logo.png';
import { ERROR_PAGE_HELMET } from '../../../utils/data/seoHelmet';
import { refreshPage } from '../../../utils/functions/helper';
import Helmet from '../../helmet/Helmet';
import { useSettingContext } from '../../../context/SettingContext';
import localization from '../../../utils/data/localization/index';
import { keys } from '../../../utils/data/localization/keys';
import './ErrorPage.scss';
import { useEffect } from 'react';
import { useFirebaseContext } from '../../../context/FirebaseContext';
function ErrorPage(props) {
    const {currentLocalization, setCurrentLocalization} = useSettingContext();
    const {auth} = useFirebaseContext();

    const getInitialLocalization = async () => {
        if(localStorage.getItem(auth.currentUser.uid)){
            const localization = await JSON.parse(localStorage.getItem(auth.currentUser.uid)).localization;
            await setCurrentLocalization(localization);
        }
    };

    useEffect(() => {
        getInitialLocalization();
        // eslint-disable-next-line
    },[])

    return (
        <div className='error_page'>
            <Helmet title={ERROR_PAGE_HELMET.title} description={ERROR_PAGE_HELMET.description}/>
            <div className="error_page_wrapper">
                <div className="error_page_wrapper_logo">
                    <img src={logoSprite} alt="logo" />
                </div>
                <div className="error_page_wrapper_text">
                    <h1>{currentLocalization !== null ? localization[currentLocalization][keys.singleErrorPageHeader] : ''}</h1>
                    <p>{currentLocalization !== null ? localization[currentLocalization][keys.singleErrorPageDescription] : ''}</p>
                </div>
                <div className="error_page_wrapper_refresh">
                    <button id='refresh' onClick={refreshPage}>{currentLocalization !== null ? localization[currentLocalization][keys.singleErrorPageRefresh] : ''}</button>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage;