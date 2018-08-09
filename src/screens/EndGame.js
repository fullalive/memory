import React, {Component} from 'react';
import {Flex} from 'grid-styled';
import PropTypes from 'prop-types';

export default class App extends Component {
	static propTypes = {
		history: PropTypes.object,
		scores: PropTypes.number,
	};

	render() {
		console.log(this);
		return (
			<Flex flexDirection='column'>
				<Flex mb={1}>Поздраляем!</Flex>
				<Flex>Ваш итоговый счет: {this.props.scores}</Flex>
			</Flex>
		);
	}
}
