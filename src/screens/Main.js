import React, {Component} from 'react';
import {Flex} from 'grid-styled';
import styled from 'styled-components';
import {Link} from 'react-router-dom'

export default class App extends Component {
	state = {
		height: 1000,
	};

	componentDidMount() {
		const height = document.documentElement.clientHeight;
		this.setState({height});
	}

	render() {
		const {height} = this.state;
		return (
			<Main height={height}>
				<LogoImg src={require('../images/logo.png')} alt='logo' />
				<StartButton><Link className='link' to='/game'>Начать игру</Link></StartButton>
			</Main>
		);
	}
}

const Main = styled(({height, ...props}) => <Flex {...props} />)`
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: ${({height}) => `${height}px`};
	background-color: rgb(0, 57, 22);
`;

const StartButton = styled.button`
	border-radius: 3px;
	border-width: 0;
	background-color: rgba(255, 252, 252, 0.9);
	height: 35px;
	width: 130px;
	
	.link {
		display: inline-block;
		color: rgb(23, 119, 14);
		letter-spacing: 1px;
		font-weight: bold;
		padding: 10px 13px;
		text-decoration: none;
		:hover {
		    transform: scale(1.1);
		    transition: 0.5s;
		}
	}
`;

const LogoImg = styled.img`
	height: 500px;
`;