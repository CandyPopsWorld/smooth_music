import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 
import { NavLink } from 'react-router-dom';
import {useFirebaseContext} from '../../../context/FirebaseContext';
import Helmet from '../../helmet/Helmet';
import Alert from '../../alert/Alert';
import MainLoader from '../../mainLoader/MainLoader';
import { SIGNUP_HELMET } from '../../../utils/data/seoHelmet';
import { mailVerification } from '../../../utils/functions/auth';
import { getErrorAlert, getSuccessAlert } from '../../../utils/functions/alert';
import { validateUserSignUp} from '../../../utils/functions/validate';
import { errorsAlert } from '../../../utils/data/alert';
import {USERS} from '../../../utils/data/collectionsId';
import logoSprite from '../../../resources/image/logo.png';
import './SignUpPage.scss';
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
        if(validateUserSignUp(username, password, confirmPassword, email, setShowAlert, setSeverityAlert, setTextAlert)){
            setLoading(true);
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                getSuccessAlert('Вы зарегистрировались в системе!', setShowAlert, setSeverityAlert, setTextAlert);
                updateDispayName();
                mailVerification(auth.currentUser, errorsAlert, setShowAlert, setSeverityAlert, setTextAlert);
                addDefaultDatabaseData();
            })
            .catch(error => {
                setLoading(false);
                getErrorAlert(error, setShowAlert, setSeverityAlert, setTextAlert);
            })
        }
    };

    const updateDispayName = () => {
        updateProfile(auth.currentUser, {
            displayName: username
        })
    };

    const addDefaultDatabaseData = async () => {
        await setDoc(doc(db, USERS, auth.currentUser.uid), {
            id: auth.currentUser.uid,
            username: username,
            email: auth.currentUser.email,
            music: [],
            favoriteAudio: [],
            favoriteAlbum: [],
            favoriteAuthor: [],
            playlists: [],
            maxIdPlaylist: '0',
            banAudio: []
        });
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