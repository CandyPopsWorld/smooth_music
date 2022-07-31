import Helmet from '../../helmet/Helmet';
import { LOGIN_HELMET } from '../../../utils/data/seoHelmet';

import {useFirebaseContext} from '../../../context/FirebaseContext';

import {signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';

import './LoginPage.scss';
import { useState } from 'react';
function LoginPage(props) {
    const {auth} = useFirebaseContext();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visibleContent, setVisibleContent] = useState(true);

    const SignInUser = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(() => {

        })
        .catch(() => {

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
        <>
        <div className="login_container">
            <div className="login_container_item">
                <div className="login_container_item_header">
                    Вход
                </div>
            </div>

            <div className="login_container_item">
                <div className="login_container_item_input">
                    <label htmlFor="">Почта</label>
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

                <div className="login_container_item_forgot">
                    <button onClick={() => setVisibleContent(false)}>Забыли пароль?</button>
                </div>

                <div className="login_container_item_button">
                    <button onClick={SignInUser}>Вход</button>
                </div>
            </div>
        </div>
        </>
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
        <>
            <p>Введите почту для сброса пароля!</p>
            <input 
            type="email"
            name='email'
            id='email'
            onChange={(e) => setForgotEmail(e.target.value)}/>
            <button 
            style={{marginTop: '20px'}}
            onClick={getForgotPassword}>Сбросить</button>
            <button 
            style={{textDecoration: 'underline', border: 'none'}}
            onClick={() => setVisibleContent(true)}>Вернуться назад</button>
        </>
    )
}

export default LoginPage;