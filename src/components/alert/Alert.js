import {Alert as AlertMUI, Box, Slide} from '@mui/material';
function Alert({severity = 'error', text = 'Произошла ошибка! Попробуйте еще раз!', setShowAlert, showAlert}) {
    return (
        <Box sx={{ width: '100%' }}>
            <Slide in={showAlert} direction='down'>
                <AlertMUI severity={severity} variant="outlined" onClose={() => {
                setShowAlert(false);
                }}>{text}</AlertMUI>
            </Slide>
        </Box>
    );
}

export default Alert;