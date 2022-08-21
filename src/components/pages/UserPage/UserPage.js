import { useEffect } from 'react';
import {useFirebaseContext} from '../../../context/FirebaseContext';
import Header from '../../headerUser/HeaderUser';
import MainAudio from '../../mainAudio/MainAudio';
import Sections from '../../sections/Sections';
import Helmet from '../../helmet/Helmet';
import { USERPAGE_HELMET } from '../../../utils/data/seoHelmet';
import { localSettings } from '../../../utils/data/localStorage';
import './UserPage.scss';
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
            <Sections/>
            <MainAudio/>
        </div>
    );
}

export default UserPage;