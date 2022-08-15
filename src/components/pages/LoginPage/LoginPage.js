import Helmet from '../../helmet/Helmet';
import { LOGIN_HELMET } from '../../../utils/data/seoHelmet';

import {useFirebaseContext} from '../../../context/FirebaseContext';

import {signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';

import './LoginPage.scss';
import { useState } from 'react';

import logoSprite from '../../../resources/image/logo.png';
import { Link, NavLink } from 'react-router-dom';

function LoginPage(props) {
    const {auth} = useFirebaseContext();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visibleContent, setVisibleContent] = useState(true);

    const SignInUser = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
        })
        .catch((error) => {

        })
    };

    const forgotPassword = (email) => {
        sendPasswordResetEmail(auth, email)
        .then(() => {

        })
        .catch(() => {

        })
    };

    return (
        <div className='login'>
            <Helmet title={LOGIN_HELMET.title} description={LOGIN_HELMET.description}/>
            <div className="login_navbar">
                <NavLink to={'/login'} style={({ isActive }) =>
              isActive ? {color: 'orangered'} : null
            }>Вход</NavLink>
                <span>/</span>
                <NavLink to={'/signup'} style={({ isActive }) =>
              isActive ? {color: 'orangered'} : null
            }>Регистрация</NavLink>
            </div>
            {
                visibleContent ?
                <LoginMain 
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                setVisibleContent={setVisibleContent}
                SignInUser={SignInUser}/>
                :
                <ForgotLogin setVisibleContent={setVisibleContent} forgotPassword={forgotPassword}/>
            }
        </div>
    );
};


const LoginMain = ({email, password, setEmail, setPassword,setVisibleContent,SignInUser}) => {
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
                        Вход
                    </div>
                </div>

                <div className="login_container_item login_container_item_form">
                    <div className="login_container_item_input">
                        <label htmlFor="">Электронная почта</label>
                        <input 
                        type="email" 
                        name='email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className="login_container_item_input">
                        <label htmlFor="">Пароль</label>
                        <input 
                        type="password" 
                        name='password'
                        id='passwod'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className="login_container_item_btns">
                        <div className="login_container_item_btns_forgot">
                            <button onClick={() => setVisibleContent(false)}>Забыли пароль?</button>
                        </div>

                        <div className="login_container_item_btns_login">
                            <button onClick={SignInUser}>Войти</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const ForgotLogin = ({setVisibleContent, forgotPassword}) => {
    const [forgotEmail, setForgotEmail] = useState('');

    const getForgotPassword = () => {
        forgotPassword(forgotEmail);
        setTimeout(() => {
            setVisibleContent(true);
        }, 1000)
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
                <label>Введите почту для сброса пароля!</label>
                <input 
                type="email"
                name='email'
                id='email'
                onChange={(e) => setForgotEmail(e.target.value)}/>
                <div className="forgot_login_container_form_btns">
                    <button
                    className='forgot_back'
                    style={{textDecoration: 'underline', border: 'none'}}
                    onClick={() => setVisibleContent(true)}>Вернуться назад</button>
                    <button
                    className='forgot_reset'
                    onClick={getForgotPassword}>Сбросить</button>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;