import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter as Router} from 'react-router-dom';
import { useFirebaseContext } from '../../context/FirebaseContext';
import AppRouter from '../appRouter/AppRouter';

import './App.scss';
import MainLoader from '../mainLoader/MainLoader';
import ErrorPage from '../pages/errorPage/ErrorPage';
function App(props) {

    const {auth} = useFirebaseContext();
    const [user,loading, error] = useAuthState(auth);

    if(loading){
        return <MainLoader/>
    }

    if(error){
        return <ErrorPage/>
    }

    return(
        <Router>
            <AppRouter/>
        </Router>
    )
}

export default App;