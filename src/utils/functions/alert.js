export const getErrorAlert = async (error, errorsAlert, setShowAlert, setSeverityAlert, setTextAlert) => {
    await setShowAlert(false);
    setSeverityAlert('error');
    await setShowAlert(true);
    errorsAlert.forEach(item => {
        if(error.code === item.code){
            setTextAlert(item.message);
        }
    })
};

export const getErrorAlertWithText = async (text, setShowAlert, setSeverityAlert, setTextAlert) => {
    await setShowAlert(false);
    setSeverityAlert('error');
    await setShowAlert(true);
    setTextAlert(text);
};

export const getSuccessAlert = async (text, setShowAlert, setSeverityAlert, setTextAlert) => {
    await setShowAlert(false);
    setSeverityAlert('success');
    await setShowAlert(true);
    setTextAlert(text);
};