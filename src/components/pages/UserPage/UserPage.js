import Helmet from '../../helmet/Helmet';
import { USERPAGE_HELMET } from '../../../utils/data/seoHelmet';

import './UserPage.scss';
import Header from '../../headerUser/HeaderUser';
import MainSectionUser from '../../mainSectionUser/MainSectionUser';
import MainAudio from '../../mainAudio/MainAudio';
function UserPage(props) {
    return (
        <div className='user_page'>
            <Helmet title={USERPAGE_HELMET.title} description={USERPAGE_HELMET.description}/>
            <Header/>
            <MainSectionUser/>
            <MainAudio/>
        </div>
    );
}

export default UserPage;