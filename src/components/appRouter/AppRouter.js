import {Routes, Route, Navigate} from 'react-router-dom';
import {publicRoutes, privateRoutes} from '../../routes';
import {USERPAGE_ROUTE, HOMEPAGE_ROUTE} from '../../utils/consts';

function AppRouter(props) {
    const user = false;
    return user ?
    (
        <Routes>
            {privateRoutes.map(({path, element}) => {
                return <Route path={path} element={element} key={path}/>
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
            <Route path='*' element={<Navigate to={HOMEPAGE_ROUTE}/>}/>
        </Routes>
    )
}

export default AppRouter;