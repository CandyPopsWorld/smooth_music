import './SettingsSection.scss';
import {useFirebaseContext} from '../../context/FirebaseContext';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { updateProfile } from "firebase/auth";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import Loader from '../loader/Loader';
import avatarSprite from '../../resources/image/avatar.png';
import { Tabs, Tab } from '@mui/material';
import { useSettingContext } from '../../context/SettingContext';

const tabs = [
    {active: false, title: 'Основные', id: 1},
    {active: false, title: 'Аккаунт', id: 2},
    {active: false, title: 'Прочее', id: 3},
];

function SettingsSection(props) {
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [loading,setLoading] = useState(false);
    const {auth,storage} = useFirebaseContext();

    const {activeSlide, setActiveSlide} = useSettingContext();

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
        console.log('file:',file);
        // const blob = window.URL || window.webkitURL;
        // const fileURL = blob.createObjectURL(file);
        const storageRef = ref(storage, `avatar/${auth.currentUser.uid}`);
        console.log(storageRef);
        uploadBytes(storageRef, file)
        .then(() => {
          console.log('File Upload!');
        })
        .catch(() => {
    
        })
        updateAvatar();
    };

    const updateAvatar = () => {
        const avatarRef = ref(storage, `avatar/${auth.currentUser.uid}`);
        getDownloadURL(avatarRef)
        .then((url) => {
            updateProfile(auth.currentUser, {
                photoURL: url
            })
            clearSettings();
            setLoading(false);
            reloadPage();
        })
        .catch(() => {
    
        })
    };

    const clearSettings = () => {
        setAvatar(null);
        setUsername('');
    };

    const reloadPage = () => {
        window.location.reload();
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
            elements_block = <BasicSettings/>
            break;
        case 2:
            elements_block = 
            <AccountSettings
            username={username}
            setUsername={setUsername}
            avatar={avatar}
            uploadAvatar={uploadAvatar}
            updateUserProfile={updateUserProfile}
            loading={loading}/>
            break;
        case 3:
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


const BasicSettings = () => {
    return (
        <div className="basic_settings block_setting">
            <h2>Основные настройки</h2>
        </div>
    )
};

const AccountSettings = ({username, setUsername, avatar, uploadAvatar, updateUserProfile, loading}) => {

    const {auth} = useFirebaseContext();

    return (
        loading === false ?
        <div className="account_settings block_setting">
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
            <h2>Прочее</h2>
        </div>
    )
};

export default SettingsSection;