import Helmet from '../../helmet/Helmet';
import { HOMEPAGE_HELMET } from '../../../utils/data/seoHelmet';

import './HomePage.scss';
function HomePage(props) {
    return (
        <div>
            <Helmet title={HOMEPAGE_HELMET.title} description={HOMEPAGE_HELMET.description}/>
        </div>
    );
}

export default HomePage;