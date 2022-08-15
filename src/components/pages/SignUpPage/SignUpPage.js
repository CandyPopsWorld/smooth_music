import Helmet from '../../helmet/Helmet';
import { SIGNUP_HELMET } from '../../../utils/data/seoHelmet';

import {useFirebaseContext} from '../../../context/FirebaseContext';

import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile} from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 
import logoSprite from '../../../resources/image/logo.png';
import { Link, NavLink } from 'react-router-dom';

import './SignUpPage.scss';
import { useState } from 'react';
function SignUpPage(props) {
    const {auth, db} = useFirebaseContext();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const registerUser = () => {
        if(validateData()){
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                updateDataUser();
                mailVerification();
                addDatabaseData();
            })
            .catch(error => {
                let message = 'Произошла ошибка!';
            })
        }
    };

    const validateData = () => {
        if(username.length > 3 && password === confirmPassword){
            return true;
        }
        return false;
    };

    const mailVerification = () => {
        sendEmailVerification(auth.currentUser)
        .then(() => {

        })
        .catch(() => {

        })
    };

    const updateDataUser = () => {
        updateProfile(auth.currentUser, {
            displayName: username
        })
    };

    const addDatabaseData = async () => {
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
            id: auth.currentUser.uid,
            username: username,
            email: auth.currentUser.email,
            music: [],
            favoriteAudio: [],
            favoriteAlbum: [],
            favoriteAuthor: []
        });
    }

    return (
        <div>
            <Helmet title={SIGNUP_HELMET.title} description={SIGNUP_HELMET.description}/>
            <div className="login_navbar">
                <NavLink to={'/login'} style={({ isActive }) =>
              isActive ? {color: 'orangered'} : null
            }>Вход</NavLink>
                <span>/</span>
                <NavLink to={'/signup'} style={({ isActive }) =>
              isActive ? {color: 'orangered'} : null
            }>Регистрация</NavLink>
            </div>
            <div className="signup_wrapper">
                <div className="login_header">
                    <div className="login_header_logo">
                        <img src={logoSprite} alt="logo" />
                        <h1>Smooth Music</h1>
                    </div>
                    <div className="login_header_hr"></div>
                </div>

                <div className="signup_container">
                <div className="signup_container_item">
                    <div className="signup_container_item_header">
                        Регистрация
                    </div>
                </div>

                <div className="signup_container_item signup_container_item_form">
                    <div className="signup_container_item_input">
                            <label htmlFor="">Никнейм</label>
                            <input 
                            type="text" 
                            name='username'
                            id='username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}/>
                    </div>

                    <div className="signup_container_item_input">
                        <label htmlFor="">Почта</label>
                        <input 
                        type="email" 
                        name='email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className="signup_container_item_input">
                        <label htmlFor="">Пароль</label>
                        <input 
                        type="password" 
                        name='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className="signup_container_item_input">
                        <label htmlFor="">Повторите пароль</label>
                        <input 
                        type="password" 
                        name='confirm'
                        id='confirm'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>

                    <div className="signup_container_item_button">
                        <button id='signup' onClick={registerUser}>Зарегистрироваться</button>
                    </div>
                </div>
            </div>
                
            </div>
        </div>
    );
}

export default SignUpPage;