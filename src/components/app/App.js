import { BrowserRouter as Router} from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useFirebaseContext } from '../../context/FirebaseContext';
import { isMobile } from 'react-device-detect';
import AppRouter from '../appRouter/AppRouter';
import MainLoader from '../mainLoader/MainLoader';
import ErrorPage from '../pages/errorPage/ErrorPage';
import MobilePage from '../pages/mobilePage/MobilePage';
function App(props) {
    const {auth} = useFirebaseContext();
    //eslint-disable-next-line
    const [user,loading, error] = useAuthState(auth);

    return(
        loading ? <MainLoader/> 
        :
        error ? <ErrorPage/>
        :
        <Router>
            {
                isMobile ? <MobilePage/>
                :
                <AppRouter/>
            }
        </Router>
    )
}

export default App;