import {Routes, Route, Navigate} from 'react-router-dom';
import {publicRoutes, privateRoutes} from '../../routes';
import {USERPAGE_ROUTE, HOMEPAGE_ROUTE} from '../../utils/data/consts';

import {useFirebaseContext} from '../../context/FirebaseContext';
import {useAuthState} from 'react-firebase-hooks/auth';

function AppRouter(props) {
    
    const {auth} = useFirebaseContext();
    const [user] = useAuthState(auth);

    console.log(user);

    return user ?
    (
        <Routes>
            {privateRoutes.map(({path, element}, i) => {
                return <Route path={path} element={element} key={i}/>
            })}
            <Route path='*' element={<Navigate to={'/user'}/>}/>
        </Routes>
    )

    :

    (
        <Routes>
            {publicRoutes.map(({path, element}) => {
                return <Route path={path} element={element} key={path}/>
            })}
            <Route path='*' element={<Navigate to={'/login'}/>}/>
        </Routes>
    )
}

export default AppRouter;