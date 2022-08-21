import {Alert as AlertMUI, Box, Slide} from '@mui/material';
import {defaultErrorText} from '../../utils/data/alert';
function Alert({severity = 'error', text = defaultErrorText, setShowAlert, showAlert}) {
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