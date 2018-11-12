import React from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route, Router} from 'react-router';

// import HomeScope from './containers/HomeScope';

import Error from './containers/Error';
import TurnScope from './containers/TurnScope';
import HistoryScope from './containers/HistoryScope'
import ReviewScope from './containers/ReviewScope';


import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();

ReactDOM.render(
    <Router history={history}>
        <Switch>
            <Route path="/review" component={ReviewScope}/>
            {/*http://localhost:3000/review/300/change/*/}
            <Route path="/history" component={HistoryScope}/>
            <Route path='/turngame' component={TurnScope}/>
        </Switch>
    </Router>
, document.getElementById('root'));
