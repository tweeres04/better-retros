import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AppContainer from './AppContainer';
import Export from './Export';
import * as serviceWorker from './serviceWorker';
import initializeFirebase from './initializeFirebase';

import amplitude from 'amplitude-js';

initializeFirebase();

amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_API_KEY);

ReactDOM.render(
	<Router>
		<Switch>
			<Route path="/:retroId/export" component={Export} />
			<Route path={['/:urlRetroId', '/']} component={AppContainer} />
		</Switch>
	</Router>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
