import React, {Component} from 'react';
import {Flex} from 'grid-styled';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export default class App extends Component {
	static propTypes = {
		history: PropTypes.object,
		scores: PropTypes.number,
		height: PropTypes.number,
	};

	state = {
		isClicked: false,
	};

	handleClick = e => {
		const {isClicked} = this.state;
		if (!isClicked && e.shiftKey) {
			this.setState({isClicked: true})
		}
		if (isClicked) {
			this.setState({isClicked: false})
		}
	};

	render() {
		const {props: {height}, state: {isClicked}} = this;
		return (isClicked ? <Wrapper height={height} flexDirection='column'><img onClick={this.handleClick} src={require('../images/ya.jpg')} alt='WIN' /></Wrapper> :
			<Wrapper height={height} flexDirection='column'>
				<Flex onClick={this.handleClick} className='congrats' mb={1}><h1>Поздраляем!</h1></Flex>
				<Flex className='scores'><h2>Ваш итоговый счет: {this.props.scores}</h2></Flex>
			</Wrapper>
		);
	}
}

const Wrapper = styled(({height, ...props}) => <Flex {...props}/>)`
	height: ${({height}) => `${height}px`};
	background-color: rgb(0, 57, 22);
	align-items: center;
	justify-content: center;
	
	.congrats {
		color: white;
	}
	
	.scores {
		color: white;
	}
`;