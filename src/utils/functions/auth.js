import {sendEmailVerification} from 'firebase/auth';
import { getSuccessAlert, getErrorAlert} from './alert';
import { defaultMailVereficationText } from '../data/alert';

export const mailVerification = (currentUser, errorsAlert, setShowAlert, setSeverityAlert, setTextAlert) => {
    sendEmailVerification(currentUser)
    .then(() => {
        getSuccessAlert(defaultMailVereficationText, setShowAlert, setSeverityAlert, setTextAlert);
    })
    .catch((error) => {
        getErrorAlert(error, errorsAlert, setShowAlert, setSeverityAlert, setTextAlert);
    })
};