import {HOMEPAGE_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE, USERPAGE_ROUTE, SETTINGS_ROUTE} from './utils/consts';
import {HomePage, LoginPage, SignUpPage, SettingsPage, UserPage} from './components/pages/index';

export const publicRoutes = [
    {
        path: HOMEPAGE_ROUTE,
        element: <HomePage/>
    },

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
    {
        path: SETTINGS_ROUTE,
        element: <SettingsPage/>
    }
];