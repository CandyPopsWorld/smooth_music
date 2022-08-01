import './SettingsSection.scss';
import {useFirebaseContext} from '../../context/FirebaseContext';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { updateProfile } from "firebase/auth";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import Loader from '../loader/Loader';

function SettingsSection(props) {
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [loading,setLoading] = useState(false);
    const {auth,storage} = useFirebaseContext();

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

    return (
        <div className='user_settings'>
            <div className="user_settings_item">
                {
                    loading === false ?
                    <>
                            <h2>Настройки</h2>
                            <div className="user_settings_item_header">
                                <h3>Обновить настройки аккаунта</h3>
                            </div>
                            <div className="user_settings_list_inputs">
                                <div className="user_settings_list_inputs_item user_settings_list_inputs_item_username">
                                    <label htmlFor="">Никнейм</label>
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
                                    <input 
                                    type="file" 
                                    name='avatar'
                                    id='avatar'
                                    defaultValue={avatar}
                                    onChange={uploadAvatar}/>
                                </div>
                                <button onClick={updateUserProfile}>Изменить настройки</button>
                            </div>
                    </>

                    :

                    <Loader/>
                }
            </div>
            <div className="user_settings_item">
                <button className='sign_out_account' onClick={() => signOut(auth)}>Выйти из аккаунта</button>
            </div>
        </div>
    );
}

export default SettingsSection;