import Helmet from '../../helmet/Helmet';
import { LOGIN_HELMET } from '../../../utils/data/seoHelmet';

import './LoginPage.scss';
function LoginPage(props) {
    return (
        <div>
            <Helmet title={LOGIN_HELMET.title} description={LOGIN_HELMET.description}/>
        </div>
    );
}

export default LoginPage;