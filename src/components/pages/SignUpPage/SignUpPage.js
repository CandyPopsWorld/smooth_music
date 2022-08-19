import Helmet from '../../helmet/Helmet';
import { SIGNUP_HELMET } from '../../../utils/data/seoHelmet';

import {useFirebaseContext} from '../../../context/FirebaseContext';

import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile} from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 
import logoSprite from '../../../resources/image/logo.png';
import { Link, NavLink } from 'react-router-dom';

import './SignUpPage.scss';
import { useState } from 'react';
import Alert from '../../alert/Alert';
import { errorsAlert } from '../../../utils/data/alert';
import MainLoader from '../../mainLoader/MainLoader';
function SignUpPage(props) {
    const {auth, db} = useFirebaseContext();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showAlert, setShowAlert] = useState(false);
    const [textAlert, setTextAlert] = useState(undefined);
    const [severityAlert, setSeverityAlert] = useState(null);

    const [loading, setLoading] = useState(false);

    const registerUser = () => {
        if(validateData()){
            setLoading(true);
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                getSuccessAlert('Вы зарегистрировались в системе!');
                updateDataUser();
                mailVerification();
                addDatabaseData();
            })
            .catch(error => {
                setLoading(false);
                getErrorAlert(error);
            })
        }
    };

    const validateData = () => {
        let validate = 0;
        if(username.length > 3){
            validate = 1;
        } else{
            getErrorAlertWithText('Никнейм должен быть больше 3 символов!');
            return false;
        }

        if(password.length > 5){
            validate = 2;
        } else {
            getErrorAlertWithText('Пароль должен быть длиннее 5 символов!');
            return false;
        }

        if(password === confirmPassword){
            validate = 3;
        } else {
            getErrorAlertWithText('Пароли должны совпадать');
            return false;
        }

        if(email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
            validate = 4;
        } else {
            getErrorAlertWithText('Некорретно введена почта!');
            return false;
        }

        if(validate === 4){
            setShowAlert(false);
            return true;
        } else{
            return false;
        }
    };

    const mailVerification = () => {
        sendEmailVerification(auth.currentUser)
        .then(() => {

        })
        .catch((error) => {
            getErrorAlert(error);
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
            favoriteAuthor: [],
            banAudio: []
        });
    };

    const getErrorAlert = async (error) => {
        await setShowAlert(false);
        setSeverityAlert('error');
        await setShowAlert(true);
        errorsAlert.forEach(item => {
            if(error.code === item.code){
                setTextAlert(item.message);
            }
        })
    };

    const getErrorAlertWithText = async (text) => {
        await setShowAlert(false);
        setSeverityAlert('error');
        await setShowAlert(true);
        setTextAlert(text);
    };

    const getSuccessAlert = async (text) => {
        await setShowAlert(false);
        setSeverityAlert('success');
        await setShowAlert(true);
        setTextAlert(text);
    };

    return (
        loading === false ?
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
            
            <div className="signup_alert">
                {
                    showAlert ? <Alert severity={severityAlert} text={textAlert} setShowAlert={setShowAlert} showAlert={showAlert}/> : null
                }
            </div>
        </div>

        :

        <MainLoader/>
    );
}

export default SignUpPage;