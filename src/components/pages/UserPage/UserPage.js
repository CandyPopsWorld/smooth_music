import { useEffect } from 'react';
import {useFirebaseContext} from '../../../context/FirebaseContext';
import Header from '../../headerUser/HeaderUser';
import MainAudio from '../../mainAudio/MainAudio';
import Sections from '../../sections/Sections';
import Helmet from '../../helmet/Helmet';
import { USERPAGE_HELMET } from '../../../utils/data/seoHelmet';
import { localSettings } from '../../../utils/data/localStorage';
import './UserPage.scss';
import { useSettingContext } from '../../../context/SettingContext';
function UserPage(props) {
    const {auth} = useFirebaseContext();
    const {setCurrentLocalization} = useSettingContext();

    const getInitialLocalization = async () => {
        if(localStorage.getItem(auth.currentUser.uid)){
            const localization = await JSON.parse(localStorage.getItem(auth.currentUser.uid)).localization;
            await setCurrentLocalization(localization);
        }
    };

    useEffect(() => {
        if(localStorage.getItem(auth.currentUser.uid)){
        } else{
            localStorage.setItem(auth.currentUser.uid,JSON.stringify(localSettings));
        }

        getInitialLocalization();

        // eslint-disable-next-line
    }, [])

    return (
        <div className='user_page'>
            <Helmet title={USERPAGE_HELMET.title} description={USERPAGE_HELMET.description}/>
            <Header/>
            <Sections/>
            <MainAudio/>
        </div>
    );
}

export default UserPage;