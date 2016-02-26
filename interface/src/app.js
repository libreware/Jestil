import React from 'react';
import { render } from 'react-dom'
import { Router, Route } from 'react-router'
import MainApp from './components/EditorPage/EditorPage.jsx';
import NoMatch from './components/404.jsx';
import createHistory from '../node_modules/history/lib/createHashHistory'

let history = createHistory({
    queryKey: false
});

render((
    <Router history={history}>
        <Route path="/" component={MainApp} />
        <Route path="*" component={NoMatch}/>
    </Router>
), document.getElementById('app'));
