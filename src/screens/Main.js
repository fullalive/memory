import React, {Component} from 'react';
import {Flex} from 'grid-styled';
import styled from 'styled-components';
import { BrowserRouter as Router, Route } from 'react-router-dom'

export default class App extends Component {
	render() {
		return (
			<button onClick={() => window.history.pushState('', '', '/game')}>Начать игру</button>
		);
	}
}
