import { useRef, useState } from 'react';
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
// eslint-disable-next-line
import { SETTINGS_ACCOUNT_PAGE_HELMET, SETTINGS_OTHER_PAGE_HELMET } from '../../utils/data/seoHelmet';
import { dangerZoneElements } from '../../utils/data/setting';
import defaultLoaderSprite from '../../resources/image/loader.gif';
import dangerLoaderSprite from '../../resources/image/danger_loader.gif';

const tabs = [
    {active: false, title: 'Аккаунт', id: 1},
];

function SettingsSection(props) {
    const {auth,storage} = useFirebaseContext();
    const {activeSlide, setActiveSlide} = useSettingContext();
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [loading,setLoading] = useState(false);
    // eslint-disable-next-line
    const [styleLoader, setStyleLoader] = useState({position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'});
    const [srcLoader, setSrcLoader] = useState(defaultLoaderSprite);

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


    const uploadAvatar = async (e) => {
        await setLoading(true);
        const file = await e.target.files[0];
        if(file.type === 'image/jpeg' || file.type === 'image/png'){
            const storageRef = await ref(storage, `${AVATAR_STORAGE}/${auth.currentUser.uid}`);
            await uploadBytes(storageRef, file)
            .then(() => {

            })
            .catch(() => {
        
            })
            await updateAvatar();
        }

    };

    const updateAvatar = async () => {
        const avatarRef = await ref(storage, `${AVATAR_STORAGE}/${auth.currentUser.uid}`);
        await getDownloadURL(avatarRef)
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
            loading={loading}
            setLoading={setLoading}
            styleLoader={styleLoader}
            srcLoader={srcLoader}
            setSrcLoader={setSrcLoader}/>
            break;
        case 2:
            // elements_block = <OtherSettings/>
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

const AccountSettings = ({username, setUsername, avatar, uploadAvatar, updateUserProfile, loading, setLoading, styleLoader, srcLoader, setSrcLoader}) => {

    const {auth, db, storage} = useFirebaseContext();

    let avatarInputRef = useRef(null);

    const editAvatar = () => {
        if(avatarInputRef !== null && avatarInputRef.current){
            avatarInputRef.current.click();
        }
    };

    let danger_zone_elements = dangerZoneElements.map(({header, description, btnText, action, id}) => {
        return (
            <div className="user_settings_account_danger_zone_wrapper_item" key={id}>
                <div className="user_settings_account_danger_zone_wrapper_item_text">
                    <div className="user_settings_account_danger_zone_wrapper_item_text_header">
                        {header}
                    </div>

                    <div className="user_settings_account_danger_zone_wrapper_item_text_description" dangerouslySetInnerHTML={{__html: description}}>
                        {/* {description} */}
                    </div>
                </div>
                <div className="user_settings_account_danger_zone_wrapper_item_btn">
                    <button className='danger_btn' onClick={() => {
                        setSrcLoader(dangerLoaderSprite);
                        action(auth.currentUser, db, storage, setLoading);
                    }}>{btnText}</button>
                </div>
            </div>
        )
    });
     
    return (
        loading === false ?
        <div className="account_settings block_setting" style={{position: 'relative'}}>
            <Helmet 
            title={SETTINGS_ACCOUNT_PAGE_HELMET.title}
            description={SETTINGS_ACCOUNT_PAGE_HELMET.description}/>
            <h2>Настройки аккаунта</h2>
            
            <div className="account_settings_block">
                <div className="user_settings_list_inputs">
                    <div className="user_settings_inputs_block">
                        <div className="user_settings_list_inputs_item user_settings_list_inputs_item_username">
                            <label htmlFor="">Имя пользователя</label>
                            <input 
                            type="text" 
                            // placeholder={`текущий:${auth.currentUser.displayName}`}
                            name='username'
                            id='username'
                            defaultValue={username}
                            onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                    </div>


                    <div className="user_settings_avatar_block">
                        <div className="user_settings_list_inputs_item user_settings_list_inputs_item_avatar" style={{position: 'relative'}}>
                            <label style={{marginBottom: '10px'}} htmlFor="">Фото профиля</label>
                            <img src={auth.currentUser.photoURL !== null ? auth.currentUser.photoURL : avatarSprite} style={{width: '128px', height: '128px', borderRadius: '50%', userSelect: 'none'}} alt="" />
                            <button className='edit_avatar_btn' onClick={editAvatar}>Edit</button>
                            <input 
                            type="file" 
                            name='avatar'
                            id='avatar'
                            style={{display: 'none'}}
                            defaultValue={avatar}
                            ref={avatarInputRef}
                            onChange={uploadAvatar}/>
                        </div>
                    </div>
                </div>
                    <button className='change_setting' onClick={updateUserProfile}>Обновить профиль</button>
                <div className="user_settings_item">
                </div>

                <div className="user_settings_account_danger_zone">
                    <h2 style={{color: 'red'}}>Опасная зона</h2>
                    <div className="user_settings_account_danger_zone_wrapper">
                        {danger_zone_elements}
                    </div>
                </div>
                    <button className='sign_out_account' onClick={() => signOut(auth)}>Выйти из аккаунта</button>
            </div>
        </div>

        :

        <Loader style={styleLoader} src={srcLoader}/>
    )
};

// const OtherSettings = () => {
//     return (
//         <div className="other_settings block_setting">
//             <Helmet 
//             title={SETTINGS_OTHER_PAGE_HELMET.title}
//             description={SETTINGS_OTHER_PAGE_HELMET.description}/>
//             <div className="other_settings_header">
//                 <h2>Прочее</h2>
//             </div>
//             <div className="other_settings_form">
//                 <div className="other_settings_form_item">
//                     <label htmlFor="browser_setting">Сохранять настройки в браузере:</label>
//                     <input type="checkbox" id='browser_setting' name='browser_setting'/>
//                 </div>

//                 <div className="other_settings_form_item">
//                     <label htmlFor="hint_setting">Показывать подсказки в приложении:</label>
//                     <input type="checkbox" id='hint_setting' name='hint_setting'/>
//                 </div>
//             </div>
//         </div>
//     )
// };

export default SettingsSection;