import { useState } from 'react';
import {signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import {useFirebaseContext} from '../../../context/FirebaseContext';
import Helmet from '../../helmet/Helmet';
import Alert from '../../alert/Alert';
import MainLoader from '../../mainLoader/MainLoader';
import { LOGIN_HELMET } from '../../../utils/data/seoHelmet';
import {getSuccessAlert, getErrorAlert} from '../../../utils/functions/alert';
import { errorsAlert } from '../../../utils/data/alert';
import {forgotPasswordText} from '../../../utils/data/alert';
import logoSprite from '../../../resources/image/logo.png';
import './LoginPage.scss';
import LocalizationSelect from '../../localizationSelect/LocalizationSelect';
import {languageLocation} from '../../../utils/data/setting';
import localization from '../../../utils/data/localization/index';
import { keys } from '../../../utils/data/localization/keys';
import {useLoginAndSignUpContext} from '../../../context/LoginAndSignUpContext';
function LoginPage(props) {
    const {auth} = useFirebaseContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visibleContent, setVisibleContent] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [textAlert, setTextAlert] = useState(undefined);
    const [severityAlert, setSeverityAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const {currentLocalization, setCurrentLocalization} = useLoginAndSignUpContext();

    const SignInUser = () => {
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
        })
        .catch((error) => {
            setLoading(false);
            getErrorAlert(error, errorsAlert, setShowAlert, setSeverityAlert, setTextAlert);
        })
    };

    const forgotPassword = (email) => {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            getSuccessAlert(forgotPasswordText, setShowAlert, setSeverityAlert, setTextAlert);
            setTimeout(() => {
                setVisibleContent(true);
                setShowAlert(false);
            }, 3000)
        })
        .catch((error) => {
            getErrorAlert(error, errorsAlert, setShowAlert, setSeverityAlert, setTextAlert);
        })
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
            <div className='login'>
                <Helmet title={LOGIN_HELMET.title} description={LOGIN_HELMET.description}/>
                <div className="login_navbar">
                    <NavLink to={'/login'} style={({ isActive }) =>
                isActive ? {color: 'orangered'} : null
                }>{currentLocalization !== null ? localization[currentLocalization][keys.singupAndLoginPageNavigateLinkLogin] : ''}</NavLink>
                    <span>/</span>
                    <NavLink to={'/signup'} style={({ isActive }) =>
                isActive ? {color: 'orangered'} : null
                }>{currentLocalization !== null ? localization[currentLocalization][keys.singupAndLoginPageNavigateLinkSignup] : ''}</NavLink>
                </div>
                {
                    visibleContent ?
                    <LoginMain 
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    setVisibleContent={setVisibleContent}
                    SignInUser={SignInUser}
                    currentLocalization={currentLocalization}/>
                    :
                    <ForgotLogin setVisibleContent={setVisibleContent} forgotPassword={forgotPassword} currentLocalization={currentLocalization}/>
                }

                <div className="login_alert">
                    {
                        showAlert ? <Alert severity={severityAlert} text={textAlert} setShowAlert={setShowAlert} showAlert={showAlert}/> : null
                    }
                </div>

                <div className="login_localization">
                    <LocalizationSelect elements_option={elements_option} updateLocalization={updateLocalization} style={styleLocalization}/>
                </div>
            </div>
            :
            <MainLoader/>

    );
};


const LoginMain = ({email, password, setEmail, setPassword,setVisibleContent,SignInUser, currentLocalization}) => {
    return (
        <div className='login_wrapper'>

            <div className="login_header">
                <div className="login_header_logo">
                    <img src={logoSprite} alt="logo" />
                    <h1>Smooth Music</h1>
                </div>
                <div className="login_header_hr"></div>
            </div>

            <div className="login_container">
                <div className="login_container_item">
                    <div className="login_container_item_header">
                    {currentLocalization !== null ? localization[currentLocalization][keys.loginPageHeader] : ''}
                    </div>
                </div>

                <div className="login_container_item login_container_item_form">
                    <div className="login_container_item_input">
                        <label htmlFor="">{currentLocalization !== null ? localization[currentLocalization][keys.loginPageLabelUsername] : ''}</label>
                        <input 
                        type="email" 
                        name='email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className="login_container_item_input">
                        <label htmlFor="">{currentLocalization !== null ? localization[currentLocalization][keys.loginPageLabelPassword] : ''}</label>
                        <input 
                        type="password" 
                        name='password'
                        id='passwod'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className="login_container_item_btns">
                        <div className="login_container_item_btns_forgot">
                            <button onClick={() => setVisibleContent(false)}>{currentLocalization !== null ? localization[currentLocalization][keys.loginPageForgotLink] : ''}</button>
                        </div>

                        <div className="login_container_item_btns_login">
                            <button onClick={SignInUser}>{currentLocalization !== null ? localization[currentLocalization][keys.loginPageBtn] : ''}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const ForgotLogin = ({setVisibleContent, forgotPassword, currentLocalization}) => {
    const [forgotEmail, setForgotEmail] = useState('');
    const getForgotPassword = () => {
        if(forgotEmail !== ''){
            forgotPassword(forgotEmail);
        }
    };
    return (
        <div className='forgot_login_container'>
            <div className="login_header">
                <div className="login_header_logo">
                    <img src={logoSprite} alt="logo" />
                    <h1>Smooth Music</h1>
                </div>
                <div className="login_header_hr"></div>
            </div>

            <div className="forgot_login_container_form">
                <label>{currentLocalization !== null ? localization[currentLocalization][keys.loginForgotPageLabelInput] : ''}</label>
                <input 
                type="email"
                name='email'
                id='email'
                onChange={(e) => setForgotEmail(e.target.value)}/>
                <div className="forgot_login_container_form_btns">
                    <button
                    className='forgot_back'
                    style={{textDecoration: 'underline', border: 'none'}}
                    onClick={() => setVisibleContent(true)}>{currentLocalization !== null ? localization[currentLocalization][keys.loginForgotPageBackLink] : ''}</button>
                    <button
                    className='forgot_reset'
                    onClick={getForgotPassword}>{currentLocalization !== null ? localization[currentLocalization][keys.loginForgotPageResetBtn] : ''}</button>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;