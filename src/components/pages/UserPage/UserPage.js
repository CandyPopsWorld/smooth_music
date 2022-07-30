import Helmet from '../../helmet/Helmet';
import { USERPAGE_HELMET } from '../../../utils/data/seoHelmet';

import './UserPage.scss';
function UserPage(props) {
    return (
        <div>
            <Helmet title={USERPAGE_HELMET.title} description={USERPAGE_HELMET.description}/>
        </div>
    );
}

export default UserPage;