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
import LocalizationSelect from '../../localizationSelect/LocalizationSelect';
import {languageLocation} from '../../../utils/data/setting';
import localization from '../../../utils/data/localization/index';
import { keys } from '../../../utils/data/localization/keys';
import {useLoginAndSignUpContext} from '../../../context/LoginAndSignUpContext';
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
    const {currentLocalization, setCurrentLocalization} = useLoginAndSignUpContext();

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

    const indexCurrentLocationOption = languageLocation.findIndex(item => item.title === currentLocalization);

    let languageLocationFilter = [languageLocation[indexCurrentLocationOption], ...languageLocation.slice(0, indexCurrentLocationOption), ...languageLocation.slice(indexCurrentLocationOption + 1)];

    let elements_option = languageLocationFilter.map(item => {
        return <option value={item.title} key={item.id}>{item.title}</option>
    });

    const styleLocalization = {
        backgroundColor: 'rgb(14, 15, 15)', 
        border: '1px solid white', 
        color: 'white',
        position: 'absolute',
        bottom: '20px',
        right: '20px'
    }

    const updateLocalization = async (e) => {
        let value = e.target.value;
        await setCurrentLocalization(value);
    };
 
    return (
        loading === false ?
        <div>
            <Helmet title={SIGNUP_HELMET.title} description={SIGNUP_HELMET.description}/>
            <div className="login_navbar">
                <NavLink to={'/login'} style={({ isActive }) =>
              isActive ? {color: 'orangered'} : null
            }>{currentLocalization !== null ? localization[currentLocalization][keys.singupAndLoginPageNavigateLinkLogin] : ''}</NavLink>
                <span>/</span>
                <NavLink to={'/signup'} style={({ isActive }) =>
              isActive ? {color: 'orangered'} : null
            }>{currentLocalization !== null ? localization[currentLocalization][keys.singupAndLoginPageNavigateLinkSignup] : ''}</NavLink>
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
                    {currentLocalization !== null ? localization[currentLocalization][keys.signupPageHeader] : ''}
                    </div>
                </div>

                <div className="signup_container_item signup_container_item_form">
                    <div className="signup_container_item_input">
                            <label htmlFor="">{currentLocalization !== null ? localization[currentLocalization][keys.signupPageLabelUsername] : ''}</label>
                            <input 
                            type="text" 
                            name='username'
                            id='username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}/>
                    </div>

                    <div className="signup_container_item_input">
                        <label htmlFor="">{currentLocalization !== null ? localization[currentLocalization][keys.signupPageLabelEmail] : ''}</label>
                        <input 
                        type="email" 
                        name='email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className="signup_container_item_input">
                        <label htmlFor="">{currentLocalization !== null ? localization[currentLocalization][keys.signupPageLabelPassword] : ''}</label>
                        <input 
                        type="password" 
                        name='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className="signup_container_item_input">
                        <label htmlFor="">{currentLocalization !== null ? localization[currentLocalization][keys.signupPageLabelConfirmPassword] : ''}</label>
                        <input 
                        type="password" 
                        name='confirm'
                        id='confirm'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>

                    <div className="signup_container_item_button">
                        <button id='signup' onClick={registerUser}>{currentLocalization !== null ? localization[currentLocalization][keys.signupPageBtn] : ''}</button>
                    </div>
                </div>
            </div>
                
            </div>
            
            <div className="signup_alert">
                {
                    showAlert ? <Alert severity={severityAlert} text={textAlert} setShowAlert={setShowAlert} showAlert={showAlert}/> : null
                }
            </div>

            <div className="signup_localization">
                <LocalizationSelect elements_option={elements_option} updateLocalization={updateLocalization} style={styleLocalization}/>
            </div>
        </div>
        :
        <MainLoader/>
    );
}

export default SignUpPage;