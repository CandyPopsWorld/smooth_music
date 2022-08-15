import { LOGIN_ROUTE, SIGNUP_ROUTE, USERPAGE_ROUTE} from './utils/data/consts';
import { LoginPage, SignUpPage, UserPage} from './components/pages/index';

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        element: <LoginPage/>
    },

    {
        path: SIGNUP_ROUTE,
        element: <SignUpPage/>
    },
];

export const privateRoutes = [
    {
        path: USERPAGE_ROUTE,
        element: <UserPage/>
    },
];