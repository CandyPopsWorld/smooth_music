import Helmet from '../../helmet/Helmet';
import { HOMEPAGE_HELMET } from '../../../utils/data/seoHelmet';

import './HomePage.scss';
import { Link } from 'react-router-dom';
function HomePage(props) {
    return (
        <div className='homepage'>
            <Helmet title={HOMEPAGE_HELMET.title} description={HOMEPAGE_HELMET.description}/>
            <h1>Homepage</h1>
            <div className="links">
                <Link to={'/login'}>
                    Логин
                </Link>

                <Link to={'/signup'}>
                    Регистрация
                </Link>
            </div>
        </div>
    );
}

export default HomePage;