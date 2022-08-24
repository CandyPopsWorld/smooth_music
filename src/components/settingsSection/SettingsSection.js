import { useState } from 'react';
import { signOut, updateProfile } from 'firebase/auth';
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {useFirebaseContext} from '../../context/FirebaseContext';
import { useSettingContext } from '../../context/SettingContext';
import Loader from '../loader/Loader';
import {refreshPage} from '../../utils/functions/helper';
import avatarSprite from '../../resources/image/avatar.png';
import { AVATAR_STORAGE } from '../../utils/data/storageId';
import './SettingsSection.scss';
import Helmet from '../helmet/Helmet';
import { SETTINGS_ACCOUNT_PAGE_HELMET, SETTINGS_OTHER_PAGE_HELMET } from '../../utils/data/seoHelmet';

const tabs = [
    {active: false, title: 'Аккаунт', id: 1},
    {active: false, title: 'Прочее', id: 2},
];

function SettingsSection(props) {
    const {auth,storage} = useFirebaseContext();
    const {activeSlide, setActiveSlide} = useSettingContext();
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [loading,setLoading] = useState(false);

    const updateUserProfile = async (e) => {
        if(username.length > 0){
            setLoading(true);
            await updateProfile(auth.currentUser, {
                displayName: username
            })
            clearSettings();
            setLoading(false);   
        }

        if(avatar !== null){
            uploadAvatar();
        }
    };


    const uploadAvatar = (e) => {
        setLoading(true);
        const file = e.target.files[0];
        const storageRef = ref(storage, `${AVATAR_STORAGE}/${auth.currentUser.uid}`);
        uploadBytes(storageRef, file)
        .then(() => {
        })
        .catch(() => {
    
        })
        updateAvatar();
    };

    const updateAvatar = () => {
        const avatarRef = ref(storage, `${AVATAR_STORAGE}/${auth.currentUser.uid}`);
        getDownloadURL(avatarRef)
        .then((url) => {
            updateProfile(auth.currentUser, {
                photoURL: url
            })
            clearSettings();
            setLoading(false);
            refreshPage();
        })
        .catch(() => {
    
        })
    };

    const clearSettings = () => {
        setAvatar(null);
        setUsername('');
    };

    const elements_nav = tabs.map(item => {
        let clazz = "user_settings_nav_tabs_item";
        clazz += activeSlide === item.id ? ' active' : '';

        const clickBtn = (id) => {
            setActiveSlide(id);
        }

        return (
            <div className={clazz} onClick={() => clickBtn(item.id)} key={item.id}>
                {item.title}
            </div>
        )
    });

    let elements_block = null;

    switch(activeSlide){
        case 1:
            elements_block = 
            <AccountSettings
            username={username}
            setUsername={setUsername}
            avatar={avatar}
            uploadAvatar={uploadAvatar}
            updateUserProfile={updateUserProfile}
            loading={loading}/>
            break;
        case 2:
            elements_block = <OtherSettings/>
            break;
        default:
            break;
    }

    return (
        <div className='user_settings'>
            <div className="user_settings_nav">
                <div className="user_settings_nav_info">
                    <div className="user_settings_nav_info_photo">
                        <img src={auth.currentUser.photoURL !== null ? auth.currentUser.photoURL : avatarSprite} style={{borderRadius: '50%'}} alt="" />
                    </div>

                    <div className="user_settings_nav_info_about">
                        <div className="user_settings_nav_info_about_name">{auth.currentUser.displayName}</div>
                        <div className="user_settings_nav_info_about_text">Ваш аккаунт</div>
                    </div>
                </div>

                <div className="user_settings_nav_tabs">
                    {elements_nav}
                </div>
            </div>

            <div className="user_settings_tabs_block">
                {elements_block}
            </div>
        </div>
    );
}

const AccountSettings = ({username, setUsername, avatar, uploadAvatar, updateUserProfile, loading}) => {

    const {auth} = useFirebaseContext();

    return (
        loading === false ?
        <div className="account_settings block_setting">
            <Helmet 
            title={SETTINGS_ACCOUNT_PAGE_HELMET.title}
            description={SETTINGS_ACCOUNT_PAGE_HELMET.description}/>
            <h2>Настройки аккаунта</h2>
            
            <div className="account_settings_block">
                <div className="user_settings_list_inputs">
                    <div className="user_settings_list_inputs_item user_settings_list_inputs_item_username">
                        <label htmlFor="">Имя пользователя</label>
                        <input 
                        type="text" 
                        placeholder={`текущий:${auth.currentUser.displayName}`}
                        name='username'
                        id='username'
                        defaultValue={username}
                        onChange={(e) => setUsername(e.target.value)}/>
                    </div>

                    <div className="user_settings_list_inputs_item user_settings_list_inputs_item_avatar">
                        <label htmlFor="">Фото профиля</label>
                        <img src={auth.currentUser.photoURL !== null ? auth.currentUser.photoURL : avatarSprite} style={{width: '64px', height: '64px', borderRadius: '50%'}} alt="" />
                        <input 
                        type="file" 
                        name='avatar'
                        id='avatar'
                        defaultValue={avatar}
                        onChange={uploadAvatar}/>
                    </div>
                    <button className='change_setting' onClick={updateUserProfile}>Изменить настройки</button>
                </div>
                <div className="user_settings_item">
                <button className='sign_out_account' onClick={() => signOut(auth)}>Выйти из аккаунта</button>
            </div>
            </div>
        </div>

        :

        <Loader/>
    )
};

const OtherSettings = () => {
    return (
        <div className="other_settings block_setting">
            <Helmet 
            title={SETTINGS_OTHER_PAGE_HELMET.title}
            description={SETTINGS_OTHER_PAGE_HELMET.description}/>
            <div className="other_settings_header">
                <h2>Прочее</h2>
            </div>
            <div className="other_settings_form">
                <div className="other_settings_form_item">
                    <label htmlFor="browser_setting">Сохранять настройки в браузере:</label>
                    <input type="checkbox" id='browser_setting' name='browser_setting'/>
                </div>

                <div className="other_settings_form_item">
                    <label htmlFor="hint_setting">Показывать подсказки в приложении:</label>
                    <input type="checkbox" id='hint_setting' name='hint_setting'/>
                </div>
            </div>
        </div>
    )
};

export default SettingsSection;