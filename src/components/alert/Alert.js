import {Alert as AlertMUI} from '@mui/material';

function Alert({severity = 'error', text = 'Произошла ошибка! Попробуйте еще раз!', setShowAlert}) {
    return (
        <AlertMUI severity={severity} variant="outlined" onClose={() => {
            setShowAlert(false);
        }}>{text}</AlertMUI>
    );
}

export default Alert;