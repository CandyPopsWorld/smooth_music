import Helmet from '../../helmet/Helmet';
import { SETTINGSPAGE_HELMET } from '../../../utils/data/seoHelmet';

import './SettingsPage.scss';
function SettingsPage(props) {
    return (
        <div>
            <Helmet title={SETTINGSPAGE_HELMET.title} description={SETTINGSPAGE_HELMET.description}/>
        </div>
    );
}

export default SettingsPage;