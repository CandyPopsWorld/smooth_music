import { getErrorAlertWithText } from "./alert";
import {validateUsernameText, validatePasswordText, validateConfirmPasswordText, validateEmailText} from '../data/alert';

export const validateUserSignUp = (username, password, confirmPassword, email, setShowAlert, setSeverityAlert, setTextAlert) => {
    let validate = 0;
    if(username.length > 3 && username.length < 30){
        validate = 1;
    } else{
        getErrorAlertWithText(validateUsernameText, setShowAlert, setSeverityAlert, setTextAlert);
        return false;
    }

    if(password.length > 5){
        validate = 2;
    } else {
        getErrorAlertWithText(validatePasswordText, setShowAlert, setSeverityAlert, setTextAlert);
        return false;
    }

    if(password === confirmPassword){
        validate = 3;
    } else {
        getErrorAlertWithText(validateConfirmPasswordText, setShowAlert, setSeverityAlert, setTextAlert);
        return false;
    }

    // eslint-disable-next-line
    if(email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
        validate = 4;
    } else {
        getErrorAlertWithText(validateEmailText, setShowAlert, setSeverityAlert, setTextAlert);
        return false;
    }

    if(validate === 4){
        setShowAlert(false);
        return true;
    } else{
        return false;
    }
};