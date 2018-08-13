import React, {Component} from 'react';
import Game from './screens/Game';
import Main from './screens/Main';
import EndGame from './screens/EndGame';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();

export default class AppProvider extends Component {
	state = {
		scores: 0,
		height: 1000,
	};

	componentDidMount() {
		const height = document.documentElement.clientHeight;
		this.setState({height});
	}


	setScores = scores => this.setState({scores});

	render() {
		const {height} = this.state;
		return (
			<Router history={history}>
				<Switch>
					<Route path='/game'><Game height={height} setScores={this.setScores} history={history} /></Route>
					<Route path='/end' ><EndGame height={height} scores={this.state.scores} /></Route>
					<Route path='/' ><Main height={height} /></Route>
				</Switch>
			</Router>
		);
	}
}