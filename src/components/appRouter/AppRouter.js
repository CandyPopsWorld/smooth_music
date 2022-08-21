import {Routes, Route, Navigate} from 'react-router-dom';
import {useFirebaseContext} from '../../context/FirebaseContext';
import {useAuthState} from 'react-firebase-hooks/auth';
import {publicRoutes, privateRoutes} from '../../routes';
import {USERPAGE_ROUTE, LOGIN_ROUTE} from '../../utils/data/consts';
function AppRouter(props) {
    const {auth} = useFirebaseContext();
    const [user] = useAuthState(auth);
    return user ?
    (
        <Routes>
            {privateRoutes.map(({path, element}, i) => {
                return <Route path={path} element={element} key={i}/>
            })}
            <Route path='*' element={<Navigate to={USERPAGE_ROUTE}/>}/>
        </Routes>
    )
    :
    (
        <Routes>
            {publicRoutes.map(({path, element}) => {
                return <Route path={path} element={element} key={path}/>
            })}
            <Route path='*' element={<Navigate to={LOGIN_ROUTE}/>}/>
        </Routes>
    )
}

export default AppRouter;