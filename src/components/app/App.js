import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter as Router, Route, Navigate} from 'react-router-dom';
import { useFirebaseContext } from '../../context/FirebaseContext';
import AppRouter from '../appRouter/AppRouter';

import './App.scss';
import MainLoader from '../mainLoader/MainLoader';
import ErrorPage from '../pages/errorPage/ErrorPage';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import MobilePage from '../pages/mobilePage/MobilePage';
function App(props) {

    const {auth} = useFirebaseContext();
    const [user,loading, error] = useAuthState(auth);

    if(loading){
        return <MainLoader/>
    }

    if(error){
        return <ErrorPage/>
    }

    console.log(isBrowser);
    console.log(isMobile);

    return(
        <>    
        <Router>
            <BrowserView>
                <AppRouter/>
            </BrowserView>
            
            <MobileView>
                <MobilePage/>
            </MobileView>
        </Router>
        </>
    )
}

export default App;