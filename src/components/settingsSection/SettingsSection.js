import './SettingsSection.scss';
import {useFirebaseContext} from '../../context/FirebaseContext';
import { signOut } from 'firebase/auth';

function SettingsSection(props) {
    const {auth} = useFirebaseContext();
    return (
        <div className='user_settings'>
            <h2>Настройки</h2>
            <button onClick={() => signOut(auth)}>Выйти из аккаунта</button>
        </div>
    );
}

export default SettingsSection;