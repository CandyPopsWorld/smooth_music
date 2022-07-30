import { BrowserRouter as Router} from 'react-router-dom';

import AppRouter from '../appRouter/AppRouter';

import './App.scss';
function App(props) {
    return(
        <Router>
            <AppRouter/>
        </Router>
    )
}

export default App;