import Helmet from '../../helmet/Helmet';
import { SIGNUP_HELMET } from '../../../utils/data/seoHelmet';

import './SignUpPage.scss';
function SignUpPage(props) {
    return (
        <div>
            <Helmet title={SIGNUP_HELMET.title} description={SIGNUP_HELMET.description}/>
        </div>
    );
}

export default SignUpPage;