import React, {Component} from 'react';
import {Flex} from 'grid-styled';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import get from 'lodash/get';
import shuffle from 'lodash/shuffle';
import {withRouter} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory';

class Game extends Component {
	static propTypes = {
		history: PropTypes.object,
		setScores: PropTypes.func,
		height: PropTypes.number,
	};


	state = {
		cards: [],
		isAllFliped: true,
		loading: true,
		clickedCards: [],
		scores: 0,
	};

	indexes = [];
	foundedCouples = 0;
	scores = 0;

	async componentDidMount() {
		const res = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52').then(response => {
			if (response.status >= 400) {
				throw new Error("Bad response from server");
			}
			return response.json();
		});
		const stateCards = [];
		const cards = get(res, 'cards', []);

		if (!cards.length) {
			throw new Error('Карт нет :(');
		}

		for (let i = 0; i < 9; i++) {
			let index = this.getRandom();
			stateCards.push(...[
				{
					...cards[index],
					isFounded: false,
					key: `${index} ${cards[index].suit} 1`,
				},
				{
					...cards[index],
					isFounded: false,
					key: `${index} ${cards[index].suit} 2`,
				},
			]);
		}

		this.setState({cards: shuffle(stateCards), loading: false}, () => setTimeout(() => this.setState({isAllFliped: false}), 5000));
	}

	handleClick(card) {
		const {clickedCards} = this.state;
		if (clickedCards.length < 2) {
			clickedCards.push(card);
			this.setState({clickedCards}, this.checkResult(clickedCards));
		}
	}

	endGame() {
		this.props.setScores(this.state.scores);
		this.props.history.push('/end');
	}

	checkResult(clickedCards) {
		const {cards} = this.state;
		if (clickedCards.length === 2) {
			if (clickedCards[0].code === clickedCards[1].code) {
				const c1 = cards.findIndex(c => clickedCards[0].key === c.key);
				const c2 = cards.findIndex(c => clickedCards[1].key === c.key);
				cards[c1] = {...cards[c1], isFounded: true};
				cards[c2] = {...cards[c2], isFounded: true};
				this.foundedCouples += 1;
				if (!cards.find(c => !c.isFounded)) {

				}
				setTimeout(() => this.setState(prev => ({cards, clickedCards: [], scores: prev.scores + (9 - this.foundedCouples) * 42}), () =>
					!cards.find(c => !c.isFounded) && this.endGame(), 1000));
			}
			setTimeout(() => this.setState(prev => ({clickedCards: [], scores: prev.scores > 0 ? prev.scores - this.foundedCouples * 42 : 0})), 1000);
		}
	}

	getRandom() {
		const num = Math.floor(Math.random() * 52);
		if (!this.indexes.includes(num)) {
			this.indexes.push(num);
			return num;
		}
		return this.getRandom();
	}

	renderRows() {
		const rows = [];
		for (let i = 0; i < 6; i++) {
			rows.push(this.renderColumns(i));
		}
		return rows;
	}

	renderColumns(row) {
		const {cards} = this.state;
		const columns = [];
		for (let j = 0; j < 3; j++) {
			columns.push(this.renderCard(cards[row * 3 + j]));
		}
		return (
			<Flex key={row} flexDirection='column'>
				{columns}
			</Flex>
		);
	}

	renderCard(card) {
		const {isAllFliped} = this.state;
		return (card.isFounded ? <Flex className='card' style={{width: '108px', height: '150px'}} /> :
				isAllFliped || this.isCardFliped(card) ? <img className='card' key={card.key} style={{height: '150px', width: '108px'}} src={card.image} alt={`${card.value} of ${card.suit}`} />
					: <img className='card' onClick={() => this.handleClick(card)} key={Math.random()} style={{height: '150px', width: '108px'}} src={require('../images/notFlipedCard.png')} alt='not flipped' />
		);
	}

	isCardFliped(card) {
		const {clickedCards} = this.state;
		return !!clickedCards.find(c => c.key === card.key);
	}

	render() {
		const {state: {loading, scores}, props: {height}} = this;
		return (loading ? <Flex>loading</Flex> :
			<Wrapper height={height} flexDirection='column'>
				<Flex className='scores'>Ваш счет: {scores}</Flex>
				<Flex flex={1} className='cards'>{this.renderRows()}</Flex>
			</Wrapper>
		);
	}
}

export default withRouter(Game);

const Wrapper = styled(({height, ...props}) => <Flex {...props} />)`
	height: ${({height}) => `${height}px`};
	padding: 10px;
	background-color: rgb(0, 57, 22);
	
	.cards {
		align-self: center;
		margin-top: 20%;
	}
	
	.card {
		margin: 5px;
	}
	
	.scores {
		color: white;
		font-weight: bold;
	}
`;
