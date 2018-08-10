import React, {Component} from 'react';
import App from './App';
import Game from './screens/Game';
import Main from './screens/Main';
import EndGame from './screens/EndGame';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();

export default class AppProvider extends Component {
	state = {
		scores: 0,
	};

	setScores = scores => this.setState({scores});

	render() {
		return (
			<Router history={history}>
				<Switch>
					<Route path='/game'><Game setScores={this.setScores} history={history} /></Route>
					<Route path='/end' ><EndGame scores={this.state.scores} /></Route>
					<Route path='/' ><Main /></Route>
				</Switch>
			</Router>
		);
	}
}