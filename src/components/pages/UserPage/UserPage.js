import Helmet from '../../helmet/Helmet';
import { USERPAGE_HELMET } from '../../../utils/data/seoHelmet';

import './UserPage.scss';
import Header from '../../headerUser/HeaderUser';
import MainSectionUser from '../../mainSectionUser/MainSectionUser';
import MainAudio from '../../mainAudio/MainAudio';
import Sections from '../../sections/Sections';

import {useFirebaseContext} from '../../../context/FirebaseContext';
import { useEffect } from 'react';
import { localSettings } from '../../../utils/data/localStorage';

function UserPage(props) {
    const {auth} = useFirebaseContext();

    useEffect(() => {
        if(localStorage.getItem(auth.currentUser.uid)){

        } else{
            localStorage.setItem(auth.currentUser.uid,JSON.stringify(localSettings));
        }
    }, [])

    return (
        <div className='user_page'>
            <Helmet title={USERPAGE_HELMET.title} description={USERPAGE_HELMET.description}/>
            <Header/>
            {/* <MainSectionUser/> */}
            <Sections/>
            <MainAudio/>
        </div>
    );
}

export default UserPage;